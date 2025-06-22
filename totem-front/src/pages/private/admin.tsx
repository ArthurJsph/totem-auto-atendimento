import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks';
import { Product, Order, User } from '../../service/interfaces'; 
import {
    getAllProducts,
    saveProduct,
    updateProduct,
    deleteProduct
} from '../../service/product';

import {
    getAllOrders,
    updateOrder,
    deleteOrder
} from '../../service/order'; 

import {
    getAllUsers,
    deleteUser
} from '../../service/user';

// --- Componente AdminDashboard ---
const AdminDashboard = () => {
    const { authorities } = useAuth();

    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);

    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

    const [users, setUsers] = useState<User[]>([]);

    const [productLoading, setProductLoading] = useState(false);
    const [productError, setProductError] = useState<string | null>(null);
    const [orderLoading, setOrderLoading] = useState(false);
    const [orderError, setOrderError] = useState<string | null>(null);
    const [userLoading, setUserLoading] = useState(false);
    const [userError, setUserError] = useState<string | null>(null);

    const isAdmin = authorities.includes('ADMIN');

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

    // --- Funções de Fetch e CRUD para Pedidos ---
    const fetchOrders = async () => {
        setOrderLoading(true);
        setOrderError(null);
        try {
            const data = await getAllOrders();
            setOrders(data);
        } catch (err: unknown) {
            console.error("Falha ao buscar pedidos:", err);
            setOrderError(`Não foi possível carregar os pedidos: ${getErrorMessage(err)}`);
        } finally {
            setOrderLoading(false);
        }
    };

    const handleUpdateOrderStatus = async (orderId: string | number, newStatus: Order['status']) => {
        setOrderLoading(true);
        setOrderError(null);
        try {
            const currentOrder = orders.find(order => order.id === orderId);
            if (!currentOrder) {
                throw new Error("Pedido não encontrado para atualização de status.");
            }

            // Garante que o objeto enviado tenha todos os campos obrigatórios da Order
            const updatedOrderData: Order = { ...currentOrder, status: newStatus };
            await updateOrder(updatedOrderData);

            setIsOrderModalOpen(false);
            setSelectedOrder(null);
            fetchOrders();
        } catch (err: unknown) {
            console.error("Erro ao atualizar status do pedido:", err);
            setOrderError(`Erro ao atualizar status do pedido: ${getErrorMessage(err)}`);
        } finally {
            setOrderLoading(false);
        }
    };

    const handleDeleteOrder = async (orderId: string | number) => {
        if (window.confirm("Tem certeza que deseja cancelar/excluir este pedido?")) {
            setOrderLoading(true);
            setOrderError(null);
            try {
                await deleteOrder(orderId);
                fetchOrders();
            } catch (err: unknown) {
                console.error("Erro ao excluir pedido:", err);
                setOrderError(`Erro ao excluir pedido: ${getErrorMessage(err)}`);
            } finally {
                setOrderLoading(false);
            }
        }
    };

    // --- Funções de Fetch e CRUD para Usuários ---
    const fetchUsers = async () => {
        setUserLoading(true);
        setUserError(null);
        try {
            const data = await getAllUsers();
            setUsers(data);
        } catch (err: unknown) {
            console.error("Falha ao buscar usuários:", err);
            setUserError(`Não foi possível carregar os usuários: ${getErrorMessage(err)}`);
        } finally {
            setUserLoading(false);
        }
    };

    const handleDeleteUser = async (userId: string | number) => {
        if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
            setUserLoading(true);
            setUserError(null);
            try {
                await deleteUser(userId);
                fetchUsers();
            } catch (err: unknown) {
                console.error("Erro ao excluir usuário:", err);
                setUserError(`Erro ao excluir usuário: ${getErrorMessage(err)}`);
            } finally {
                setUserLoading(false);
            }
        }
    };

    useEffect(() => {
        if (isAdmin) {
            fetchProducts();
            fetchOrders();
            fetchUsers();
        }
    }, [isAdmin]);


    // --- Componentes Modais Internos ---
    const ProductModal = ({ isOpen, onClose, onSubmit, product }) => {
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

    const OrderModal = ({ isOpen, onClose, onSubmit, order }) => {
        const [status, setStatus] = useState(order?.status || '');

        useEffect(() => {
            if (order) {
                setStatus(order.status || '');
            } else {
                setStatus('');
            }
        }, [order]);

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            onSubmit(order.id, status);
        };

        if (!isOpen || !order) return null;

        const statusOptions: Order['status'][] = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED'];

        const formatOrderDate = (dateInput: string | Date | undefined): string => {
            if (!dateInput) {
                return 'N/A';
            }
            try {
                // Tenta criar um objeto Date. Se for string, New Date() vai parsear.
                // Se já for Date, será usado diretamente.
                const date = new Date(dateInput);
                // getTime() retorna NaN se a data for inválida
                if (isNaN(date.getTime())) {
                    return 'Data Inválida';
                }
                return date.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
            } catch (e) {
                // Captura qualquer outro erro de parsing
                console.error("Erro ao formatar data:", e);
                return 'Erro na Data';
            }
        };


        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-200">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Atualizar Status do Pedido #{order.id}</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Exibindo User ID para Cliente */}
                        <p className="text-gray-700">Cliente (ID): <span className="font-semibold">{order.userId || 'N/A'}</span></p>
                        <p className="text-gray-700">Total: <span className="font-semibold">R$ {order.totalAmount ? order.totalAmount.toFixed(2) : '0.00'}</span></p>
                        <p className="text-gray-700">Data do Pedido: <span className="font-semibold">{formatOrderDate(order.createdAt)}</span></p> {/* Usar createdAt para a data do pedido */}
                        <p className="text-gray-700 mb-4">Itens: <span className="font-semibold">{order.items ? order.items.map(item => `${item.qty}x ${item.name}`).join(', ') : 'N/A'}</span></p>

                        <div>
                            <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">Novo Status:</label>
                            <select
                                id="status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value as Order['status'])}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 border-gray-300"
                                required
                            >
                                {statusOptions.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
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
                                disabled={orderLoading}
                            >
                                {orderLoading ? 'Salvando...' : 'Atualizar Status'}
                            </button>
                        </div>
                    </form>
                    {orderError && <p className="text-red-600 mt-4 text-center">{orderError}</p>}
                </div>
            </div>
        );
    };

    function formatOrderDate(createdAt: string | Date | undefined): string {
        if (!createdAt) return 'N/A';
        const date = new Date(createdAt);
        if (isNaN(date.getTime())) return 'Data Inválida';
        return date.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
    }

    // --- Renderização Principal do AdminDashboard ---
    return (
        <div className="min-h-screen bg-white p-6 md:p-10 text-gray-800 rounded-lg shadow-lg font-sans">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
                <h1 className="text-4xl md:text-5xl font-extrabold text-orange-600 mb-4 sm:mb-0">Painel do Administrador</h1>
            </div>

            <p className="text-lg text-gray-700 mb-10">
                Gerencie produtos, pedidos e usuários do sistema.
            </p>

            {/* --- Seção de Gerenciamento de Produtos --- */}
            <div className="bg-gray-100 rounded-lg shadow-md p-6 mb-10 border border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                    <h3 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">Gerenciamento de Produtos</h3>
                    <button
                        onClick={() => { setSelectedProduct(null); setIsProductModalOpen(true); }}
                        className="px-6 py-3 bg-green-500 text-white font-semibold rounded-md shadow-md hover:bg-green-600 transition duration-300 flex items-center"
                    >
                        <i className="fas fa-plus mr-2"></i> Adicionar Novo Produto
                    </button>
                </div>

                {productLoading && (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
                        <p className="ml-4 text-green-600">Carregando produtos...</p>
                    </div>
                )}
                {productError && <p className="text-red-600 text-center py-4">{productError}</p>}

                {!productLoading && !productError && (
                    products.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white rounded-lg overflow-hidden border border-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">ID</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Nome</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Preço</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Estoque</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {products.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50 transition-colors duration-200">
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">{product.id}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">{product.name}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">R$ {(product.price ?? 0).toFixed(2)}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">{product.stock}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => { setSelectedProduct(product); setIsProductModalOpen(true); }}
                                                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-xs mr-2 transition"
                                                >
                                                    <i className="fas fa-edit mr-1"></i> Editar
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProduct(product.id as number)}
                                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-xs transition"
                                                >
                                                    <i className="fas fa-trash-alt mr-1"></i> Excluir
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-600 text-center py-4">Nenhum produto cadastrado. Adicione um novo!</p>
                    )
                )}
            </div>

            {/* --- Seção de Gerenciamento de Pedidos --- */}
            <div className="bg-gray-100 rounded-lg shadow-md p-6 mb-10 border border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                    <h3 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">Gerenciamento de Pedidos</h3>
                </div>

                {orderLoading && (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
                        <p className="ml-4 text-orange-600">Carregando pedidos...</p>
                    </div>
                )}
                {orderError && <p className="text-red-600 text-center py-4">{orderError}</p>}

                {!orderLoading && !orderError && (
                    orders.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white rounded-lg overflow-hidden border border-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">ID</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Cliente (ID)</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Total</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Data</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Status</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-200">
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">{order.id}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">{order.userId || 'N/A'}</td> {/* Exibe userId */}
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">R$ {order.total ? order.total.toFixed(2) : '0.00'}</td> {/* Usar total, não totalAmount */}
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">
                                                {formatOrderDate(order.createdAt)} {/* Usar createdAt para data do pedido */}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                    order.status === 'CONFIRMED' || order.status === 'PREPARING' ? 'bg-blue-100 text-blue-800' :
                                                    order.status === 'READY' ? 'bg-purple-100 text-purple-800' :
                                                    order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                                    'bg-red-100 text-red-800' // CANCELLED
                                                }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => { setSelectedOrder(order); setIsOrderModalOpen(true); }}
                                                    className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-md text-xs mr-2 transition"
                                                >
                                                    <i className="fas fa-sync-alt mr-1"></i> Status
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteOrder(order.id as number)}
                                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-xs transition"
                                                >
                                                    <i className="fas fa-times-circle mr-1"></i> Cancelar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-600 text-center py-4">Nenhum pedido recente para exibir.</p>
                    )
                )}
            </div>

            {/* --- Nova Seção de Gerenciamento de Usuários --- */}
            <div className="bg-gray-100 rounded-lg shadow-md p-6 mb-10 border border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                    <h3 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">Gerenciamento de Usuários</h3>
                </div>

                {userLoading && (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
                        <p className="ml-4 text-orange-600">Carregando usuários...</p>
                    </div>
                )}
                {userError && <p className="text-red-600 text-center py-4">{userError}</p>}

                {!userLoading && !userError && (
                    users.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white rounded-lg overflow-hidden border border-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">ID</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Nome</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Email</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Role</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-200">
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">{user.id}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">{user.name}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">{user.email}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    user.role === 'ADMIN' ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-xs transition"
                                                >
                                                    <i className="fas fa-trash-alt mr-1"></i> Deletar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-600 text-center py-4">Nenhum usuário cadastrado.</p>
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

            {/* Modal de Pedido */}
            <OrderModal
                isOpen={isOrderModalOpen}
                onClose={() => setIsOrderModalOpen(false)}
                onSubmit={handleUpdateOrderStatus}
                order={selectedOrder}
            />
        </div>
    );
};

export default AdminDashboard;