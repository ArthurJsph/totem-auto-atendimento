import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks';
import { Product } from '../../service/interfaces';
import {
    getAllProducts,
    saveProduct,
    updateProduct,
    deleteProduct
} from '../../service/product';

const ManagerDashboard: React.FC = () => {
    const { authorities, logout } = useAuth();
    const navigate = useNavigate();

    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);

    const [productLoading, setProductLoading] = useState(false);
    const [productError, setProductError] = useState<string | null>(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isManager = authorities.includes('MANAGER') || authorities.includes('ADMIN');

    const getErrorMessage = (error: unknown): string => {
        if (error instanceof Error) {
            return error.message;
        }
        if (typeof error === 'string') {
            return error;
        }
        return 'Ocorreu um erro desconhecido.';
    };

    // --- Funções de Fetch e CRUD para Produtos ---
    const fetchProducts = async () => {
        setProductLoading(true);
        setProductError(null);
        try {
            const data = await getAllProducts();
            setProducts(data);
        } catch (err: unknown) {
            console.error("Falha ao buscar produtos:", err);
            setProductError(`Não foi possível carregar os produtos: ${getErrorMessage(err)}`);
        } finally {
            setProductLoading(false);
        }
    };

    const handleAddEditProduct = async (productData: Product) => {
        setProductLoading(true);
        setProductError(null);
        try {
            if (productData.id) {
                await updateProduct(productData);
            } else {
                // Ao salvar, certifique-se de que productData não tem um ID
                const productToSave: Omit<Product, 'id'> = {
                    name: productData.name,
                    description: productData.description,
                    price: productData.price,
                    imageUrl: productData.imageUrl
                };
                await saveProduct(productToSave); // Use o tipo Omit se seu saveProduct não aceita ID
            }
            setIsProductModalOpen(false);
            setSelectedProduct(null);
            fetchProducts();
        } catch (err: unknown) {
            console.error("Erro ao salvar produto:", err);
            setProductError(`Erro ao salvar produto: ${getErrorMessage(err)}`);
        } finally {
            setProductLoading(false);
        }
    };

    const handleDeleteProduct = async (productId: string | number) => {
        if (window.confirm("Tem certeza que deseja excluir este produto?")) {
            setProductLoading(true);
            setProductError(null);
            try {
                await deleteProduct(productId);
                fetchProducts();
            } catch (err: unknown) {
                console.error("Erro ao excluir produto:", err);
                setProductError(`Erro ao excluir produto: ${getErrorMessage(err)}`);
            } finally {
                setProductLoading(false);
            }
        }
    };

    useEffect(() => {
        if (isManager) {
            fetchProducts();
        }
    }, [isManager]);

    // --- Componentes Modais Internos ---
    interface ProductModalProps {
        isOpen: boolean;
        onClose: () => void;
        onSubmit: (product: Product) => void;
        product: Product | null;
    }

    const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, onSubmit, product }) => {
        const [name, setName] = useState(product?.name || '');
        const [description, setDescription] = useState(product?.description || '');
        const [price, setPrice] = useState(product?.price?.toString() || '');
        const [imageFile, setImageFile] = useState<File | null>(null);
        const [previewImage, setPreviewImage] = useState<string | null>(product?.imageUrl || null);

        useEffect(() => {
            if (product) {
                setName(product.name || '');
                setDescription(product.description || '');
                setPrice(product.price?.toString() || '');
                setPreviewImage(product.imageUrl || null);
                setImageFile(null);
            } else {
                setName('');
                setDescription('');
                setPrice('');
                setImageFile(null);
                setPreviewImage(null);
            }
        }, [product]);

        const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                setImageFile(file);
                setPreviewImage(URL.createObjectURL(file));
            } else {
                setImageFile(null);
                setPreviewImage(null);
            }
        };

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            let uploadedImageUrl: string | undefined = previewImage || undefined;

            if (imageFile) {
                await new Promise(resolve => setTimeout(resolve, 500));
                uploadedImageUrl = `https://via.placeholder.com/150/FFA500/FFFFFF?text=${name.replace(/\s/g, '+')}_${Date.now()}`;
                console.log("IMAGEM UPLOADADA (simulado):", uploadedImageUrl);
            }

            // Adapta o objeto para o formato Product
            const productData: Product = {
                id: product ? product.id : undefined,
                name,
                description,
                price: parseFloat(price),
                imageUrl: uploadedImageUrl
            };
            onSubmit(productData); // Envia o objeto Product completo
        };

        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-200">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">{product ? 'Editar Produto' : 'Adicionar Novo Produto'}</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Nome do Produto:</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 border-gray-300"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Descrição:</label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 border-gray-300 h-24"
                                required
                            ></textarea>
                        </div>
                        <div>
                            <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">Preço:</label>
                            <input
                                type="number"
                                id="price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 border-gray-300"
                                step="0.01"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="image" className="block text-gray-700 text-sm font-bold mb-2">Imagem do Produto:</label>
                            <input
                                type="file"
                                id="image"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                            />
                            {previewImage && (
                                <div className="mt-4">
                                    <p className="text-gray-600 text-sm mb-2">Pré-visualização:</p>
                                    <img src={previewImage} alt="Pré-visualização do produto" className="w-24 h-24 object-cover rounded-md border border-gray-300" />
                                </div>
                            )}
                        </div>
                        <div className="flex justify-end gap-4 mt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition"
                                disabled={productLoading}
                            >
                                {productLoading ? 'Salvando...' : (product ? 'Salvar Alterações' : 'Adicionar Produto')}
                            </button>
                        </div>
                    </form>
                    {productError && <p className="text-red-600 mt-4 text-center">{productError}</p>}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6 md:p-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-extrabold text-gray-900">Dashboard do Gerente</h1>
                
            </div>

            <p className="text-lg text-gray-700 mb-8">
                Bem-vindo, Gerente! Aqui você pode gerenciar os produtos.
            </p>

            {/* --- Seção de Gerenciamento de Produtos --- */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-10">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                    <h3 className="text-2xl font-semibold text-gray-800">Gerenciamento de Produtos</h3>
                    <button
                        onClick={() => { setSelectedProduct(null); setIsProductModalOpen(true); }}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                    >
                        Adicionar Produto
                    </button>
                </div>

                {productLoading && <p>Carregando produtos...</p>}
                {productError && <p className="text-red-500">{productError}</p>}

                {!productLoading && !productError && (
                    products.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white rounded-lg overflow-hidden">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="px-4 py-2">ID</th>
                                        <th className="px-4 py-2">Nome</th>
                                        <th className="px-4 py-2">Preço</th>
                                        <th className="px-4 py-2">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => (
                                        <tr key={product.id}>
                                            <td className="border px-4 py-2">{product.id}</td>
                                            <td className="border px-4 py-2">{product.name}</td>
                                            <td className="border px-4 py-2">R$ {(product.price ?? 0).toFixed(2)}</td>
                                            <td className="border px-4 py-2">
                                                <button
                                                    onClick={() => { setSelectedProduct(product); setIsProductModalOpen(true); }}
                                                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProduct(product.id as number)}
                                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                                >
                                                    Excluir
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p>Nenhum produto cadastrado.</p>
                    )
                )}
            </div>

            {/* Modal de Produto */}
            <ProductModal
                isOpen={isProductModalOpen}
                onClose={() => setIsProductModalOpen(false)}
                onSubmit={handleAddEditProduct}
                product={selectedProduct}
            />
        </div>
    );
};

export default ManagerDashboard;