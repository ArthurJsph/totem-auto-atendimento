import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Product } from '../../service/interfaces';
import {
    getAllProducts,
    saveProduct,
    updateProduct,
    deleteProduct
} from '../../service/product';

const ManagerDashboard: React.FC = () => {
    const { authorities } = useAuth();
    const navigate = useNavigate();

    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);

    const [productLoading, setProductLoading] = useState(false);
    const [productError, setProductError] = useState<string | null>(null);

    // --- Estados para o Filtro ---
    const [filterName, setFilterName] = useState('');
    const [filterMinPrice, setFilterMinPrice] = useState('');
    const [filterMaxPrice, setFilterMaxPrice] = useState('');

    const hasManagerAccess = authorities.includes('MANAGER') || authorities.includes('ADMIN');

    const getErrorMessage = useCallback((error: unknown): string => {
        if (error instanceof Error) {
            return error.message;
        }
        if (typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string') {
            return error.message;
        }
        return 'Ocorreu um erro desconhecido.';
    }, []);

    // --- Funções de Fetch e CRUD para Produtos (otimizadas com useCallback) ---
    const fetchProducts = useCallback(async () => {
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
    }, [getErrorMessage]);

    const handleAddEditProduct = useCallback(async (productData: Product) => {
        setProductLoading(true);
        setProductError(null);
        try {
            if (productData.id) {
                await updateProduct(productData);
            } else {
                const { id, ...productToSave } = productData;
                await saveProduct(productToSave as Omit<Product, 'id'>);
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
    }, [fetchProducts, getErrorMessage]);

    const handleDeleteProduct = useCallback(async (productId: string | number) => {
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
    }, [fetchProducts, getErrorMessage]);

    useEffect(() => {
        if (hasManagerAccess) {
            fetchProducts();
        }
    }, [hasManagerAccess, fetchProducts]);

    // --- Lógica de Filtragem (useMemo para otimização) ---
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesName = product.name?.toLowerCase().includes(filterName.toLowerCase()) ||
                                product.description?.toLowerCase().includes(filterName.toLowerCase());

            const price = product.price ?? 0;
            const minPrice = parseFloat(filterMinPrice);
            const maxPrice = parseFloat(filterMaxPrice);

            const matchesMinPrice = isNaN(minPrice) || price >= minPrice;
            const matchesMaxPrice = isNaN(maxPrice) || price <= maxPrice;

            return matchesName && matchesMinPrice && matchesMaxPrice;
        });
    }, [products, filterName, filterMinPrice, filterMaxPrice]);

    // --- Componentes Modais Internos ---
    interface ProductModalProps {
        isOpen: boolean;
        onClose: () => void;
        onSubmit: (product: Product) => void;
        product: Product | null;
        isLoading: boolean;
        error: string | null;
    }

    const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, onSubmit, product, isLoading, error }) => {
        const [name, setName] = useState(product?.name || '');
        const [description, setDescription] = useState(product?.description || '');
        const [price, setPrice] = useState(product?.price?.toString() || '');
        const [imageUrl, setImageUrl] = useState(product?.imageUrl || ''); // Mantém a URL da imagem

        useEffect(() => {
            if (product) {
                setName(product.name || '');
                setDescription(product.description || '');
                setPrice(product.price?.toString() || '');
                setImageUrl(product.imageUrl || '');
            } else {
                setName('');
                setDescription('');
                setPrice('');
                setImageUrl('');
            }
        }, [product, isOpen]);

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();

            // Validação básica
            if (!name.trim()) {
                alert('O nome do produto é obrigatório.');
                return;
            }
            if (parseFloat(price) <= 0 || isNaN(parseFloat(price))) {
                alert('O preço deve ser um número positivo.');
                return;
            }

            const productData: Product = {
                id: product?.id,
                name: name.trim(),
                description: description.trim(),
                price: parseFloat(price),
                imageUrl: imageUrl.trim() || undefined
            };
            onSubmit(productData);
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
                            <label htmlFor="imageUrl" className="block text-gray-700 text-sm font-bold mb-2">URL da Imagem:</label>
                            <input
                                type="url"
                                id="imageUrl"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                placeholder="https://example.com/image.jpg"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 border-gray-300"
                            />
                            {/* Pré-visualização da imagem removida aqui */}
                        </div>
                        <div className="flex justify-end gap-4 mt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
                                disabled={isLoading}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Salvando...' : (product ? 'Salvar Alterações' : 'Adicionar Produto')}
                            </button>
                        </div>
                    </form>
                    {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
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
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4 sm:mb-0">Gerenciamento de Produtos</h3>
                    <button
                        onClick={() => { setSelectedProduct(null); setIsProductModalOpen(true); }}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition w-full sm:w-auto"
                    >
                        Adicionar Produto
                    </button>
                </div>

                {/* --- Filtros --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                        <label htmlFor="filterName" className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Nome/Descrição:</label>
                        <input
                            type="text"
                            id="filterName"
                            value={filterName}
                            onChange={(e) => setFilterName(e.target.value)}
                            placeholder="Nome ou descrição do produto"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="filterMinPrice" className="block text-sm font-medium text-gray-700 mb-1">Preço Mínimo:</label>
                        <input
                            type="number"
                            id="filterMinPrice"
                            value={filterMinPrice}
                            onChange={(e) => setFilterMinPrice(e.target.value)}
                            placeholder="R$ 0.00"
                            step="0.01"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="filterMaxPrice" className="block text-sm font-medium text-gray-700 mb-1">Preço Máximo:</label>
                        <input
                            type="number"
                            id="filterMaxPrice"
                            value={filterMaxPrice}
                            onChange={(e) => setFilterMaxPrice(e.target.value)}
                            placeholder="R$ 999.99"
                            step="0.01"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {productLoading && <p className="text-center text-blue-600 text-lg">Carregando produtos...</p>}
                {productError && <p className="text-red-500 text-center text-lg">{productError}</p>}

                {!productLoading && !productError && (
                    filteredProducts.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white rounded-lg overflow-hidden border border-gray-200">
                                <thead className="bg-gray-200 text-gray-700">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">ID</th>
                                        {/* Coluna de Imagem REMOVIDA AQUI */}
                                        <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">Nome</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">Descrição</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">Preço</th>
                                        <th className="px-4 py-3 text-center text-sm font-semibold uppercase tracking-wider">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredProducts.map((product) => (
                                        <tr key={product.id}>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800">{product.id}</td>
                                            {/* Célula de Imagem REMOVIDA AQUI */}
                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800 font-medium">{product.name}</td>
                                            <td className="px-4 py-2 text-sm text-gray-600 max-w-xs overflow-hidden text-ellipsis">{product.description}</td>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800">R$ {(product.price ?? 0).toFixed(2)}</td>
                                            <td className="px-4 py-2 whitespace-nowrap text-center">
                                                <button
                                                    onClick={() => { setSelectedProduct(product); setIsProductModalOpen(true); }}
                                                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-md text-sm transition mr-2"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProduct(product.id as number)}
                                                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md text-sm transition"
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
                        <p className="text-center text-gray-600 mt-4">Nenhum produto encontrado com os filtros aplicados.</p>
                    )
                )}
            </div>

            {/* Modal de Produto */}
            <ProductModal
                isOpen={isProductModalOpen}
                onClose={() => { setIsProductModalOpen(false); setProductError(null); }}
                onSubmit={handleAddEditProduct}
                product={selectedProduct}
                isLoading={productLoading}
                error={productError}
            />
        </div>
    );
};

export default ManagerDashboard;