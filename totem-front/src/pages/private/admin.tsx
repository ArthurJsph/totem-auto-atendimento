import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth'; // Ajuste o caminho se necessário
import { Product, Order, User, Payment, OrderItem, Restaurant, MenuCategory } from '../../service/interfaces'; // Verifique todas as interfaces
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
    updateUser,
    deleteUser
} from '../../service/user';
import {
    getAllPayments,
    updatePayment,
    deletePayment
} from '../../service/payment'; // Adicionado
import {
    getAllOrderItems,
    updateOrderItem,
    deleteOrderItem
} from '../../service/orderItem'; // Adicionado
import {
    getRestaurants,
    saveRestaurant,
    updateRestaurant,
    deleteRestaurant
} from '../../service/restaurants'; // Adicionado
import { getAllMenus } from '../../service/menu'; // Adicionado para ProductModal

// --- Funções Auxiliares (movidas para fora do componente principal) ---
const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
        return error.message;
    }
    if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
    ) {
        return (error as { response: { data: { message: string } } }).response.data.message; // Captura mensagem de erro do Axios
    }
    if (typeof error === 'string') {
        return error;
    }
    return 'Ocorreu um erro desconhecido.';
};

const formatOrderDate = (dateInput: string | Date | undefined): string => {
    if (!dateInput) return 'N/A';
    try {
        const date = new Date(dateInput);
        if (isNaN(date.getTime())) return 'Data Inválida';
        return date.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
    } catch (e) {
        console.error("Erro ao formatar data:", e);
        return 'Erro na Data';
    }
};

// --- Interfaces para Props dos Modais (melhor definir fora) ---
interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (product: Product) => Promise<void>; // Retorna Promise<void> para async
    product: Product | null;
    isLoading: boolean;
    error: string | null;
    menuCategories: MenuCategory[]; // Passa as categorias para o modal
}

interface OrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (orderId: string | number, newStatus: Order['status']) => Promise<void>; // Retorna Promise<void>
    order: Order | null;
    isLoading: boolean;
    error: string | null;
}

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (user: User) => Promise<void>; // Retorna Promise<void>
    user: User | null;
    isLoading: boolean;
    error: string | null;
}

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (payment: Payment) => Promise<void>;
    payment: Payment | null;
    isLoading: boolean;
    error: string | null;
}

interface OrderItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (orderItem: OrderItem) => Promise<void>;
    orderItem: OrderItem | null;
    isLoading: boolean;
    error: string | null;
}

interface RestaurantModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (restaurant: Restaurant) => Promise<void>;
    restaurant: Restaurant | null;
    isLoading: boolean;
    error: string | null;
}

// --- Componentes Modais (Separados para melhor organização) ---

// ProductModal
const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, onSubmit, product, isLoading, error, menuCategories }) => {
    const [name, setName] = useState(product?.name || '');
    const [description, setDescription] = useState(product?.description || '');
    const [price, setPrice] = useState(product?.price?.toString() || '');
    const [imageUrl, setImageUrl] = useState(product?.imageUrl || '');
    const [ingredients, setIngredients] = useState<string[]>(product?.ingredients || []);
    const [amount, setAmount] = useState(product?.amount?.toString() || '0');
    const [menuCategoryId, setMenuCategoryId] = useState(product?.menuCategoryId?.toString() || (menuCategories.length > 0 ? menuCategories[0].id?.toString() : ''));

    useEffect(() => {
        if (product) {
            setName(product.name || '');
            setDescription(product.description || '');
            setPrice(product.price?.toString() || '');
            setImageUrl(product.imageUrl || '');
            setIngredients(product.ingredients || []);
            setAmount(product.amount?.toString() || '0');
            setMenuCategoryId(product.menuCategoryId?.toString() || (menuCategories.length > 0 ? menuCategories[0].id?.toString() : ''));
        } else {
            setName('');
            setDescription('');
            setPrice('');
            setImageUrl('');
            setIngredients([]);
            setAmount('0');
            setMenuCategoryId(menuCategories.length > 0 ? menuCategories[0].id?.toString() || '' : '');
        }
    }, [product, isOpen, menuCategories]); // Adicionado isOpen e menuCategories para resetar ao abrir para um novo produto ou quando categorias mudam

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validação básica
        if (!name.trim()) { alert('O nome do produto é obrigatório.'); return; }
        if (parseFloat(price) <= 0 || isNaN(parseFloat(price))) { alert('O preço deve ser um número positivo.'); return; }
        if (parseInt(amount) < 0 || isNaN(parseInt(amount))) { alert('A quantidade em estoque deve ser um número não negativo.'); return; }
        if (!menuCategoryId || parseInt(menuCategoryId) <= 0 || isNaN(parseInt(menuCategoryId))) { alert('Selecione uma categoria válida.'); return; }

        const productData: Product = {
            id: product?.id,
            name: name.trim(),
            description: description.trim(),
            price: parseFloat(price),
            imageUrl: imageUrl.trim() || undefined,
            ingredients: ingredients,
            amount: parseInt(amount),
            restaurantId: 1, // Assumindo valor fixo 1
            menuCategoryId: parseInt(menuCategoryId)
        };
        await onSubmit(productData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">{product ? 'Editar Produto' : 'Adicionar Novo Produto'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Nome do Produto:</label>
                        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 border-gray-300" required />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Descrição:</label>
                        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 border-gray-300 h-24" required></textarea>
                    </div>
                    <div>
                        <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">Preço:</label>
                        <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 border-gray-300" step="0.01" required />
                    </div>
                    <div>
                        <label htmlFor="ingredients" className="block text-gray-700 text-sm font-bold mb-2">Ingredientes (separados por vírgula):</label>
                        <input type="text" id="ingredients" value={ingredients.join(', ')} onChange={(e) => setIngredients(e.target.value.split(',').map(s => s.trim()))}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 border-gray-300" />
                    </div>
                    <div>
                        <label htmlFor="amount" className="block text-gray-700 text-sm font-bold mb-2">Quantidade em Estoque:</label>
                        <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 border-gray-300" required />
                    </div>
                    <div>
                        <label htmlFor="menuCategoryId" className="block text-gray-700 text-sm font-bold mb-2">Categoria do Menu:</label>
                        <select id="menuCategoryId" value={menuCategoryId} onChange={(e) => setMenuCategoryId(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 border-gray-300" required>
                            {menuCategories.map(cat => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="imageUrl" className="block text-gray-700 text-sm font-bold mb-2">URL da Imagem:</label>
                        <input type="url" id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="https://example.com/image.jpg"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 border-gray-300" />
                    </div>
                    <div className="flex justify-end gap-4 mt-6">
                        <button type="button" onClick={onClose}
                            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition" disabled={isLoading}>
                            Cancelar
                        </button>
                        <button type="submit"
                            className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition" disabled={isLoading}>
                            {isLoading ? 'Salvando...' : (product ? 'Salvar Alterações' : 'Adicionar Produto')}
                        </button>
                    </div>
                </form>
                {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
            </div>
        </div>
    );
};

// OrderModal
const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose, onSubmit, order, isLoading, error }) => {
    const [status, setStatus] = useState(order?.status || '');

    useEffect(() => {
        if (order) {
            setStatus(order.status || '');
        } else {
            setStatus('');
        }
    }, [order, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (order?.id) { // Certifica-se de que há um ID de pedido
            await onSubmit(order.id, status as Order['status']);
        } else {
            alert("Erro: ID do pedido não encontrado para atualização.");
        }
    };

    if (!isOpen || !order) return null;

    const statusOptions: Order['status'][] = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED'];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Atualizar Status do Pedido #{order.id}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <p className="text-gray-700">Cliente (ID): <span className="font-semibold">{order.userId || 'N/A'}</span></p>
                    <p className="text-gray-700">Total: <span className="font-semibold">R$ {order.total ? order.total.toFixed(2) : '0.00'}</span></p>
                    <p className="text-gray-700">Data do Pedido: <span className="font-semibold">{formatOrderDate(order.createdAt)}</span></p>
                    <p className="text-gray-700 mb-4">Itens: <span className="font-semibold">{order.items ? order.items.map(item => `${item.qty}x ${item.name}`).join(', ') : 'N/A'}</span></p>

                    <div>
                        <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">Novo Status:</label>
                        <select id="status" value={status} onChange={(e) => setStatus((e.target.value as Order['status']) || '')}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 border-gray-300" required>
                            {statusOptions.map(option => (<option key={option} value={option}>{option}</option>))}
                        </select>
                    </div>
                    <div className="flex justify-end gap-4 mt-6">
                        <button type="button" onClick={onClose}
                            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition" disabled={isLoading}>
                            Cancelar
                        </button>
                        <button type="submit"
                            className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition" disabled={isLoading}>
                            {isLoading ? 'Salvando...' : 'Atualizar Status'}
                        </button>
                    </div>
                </form>
                {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
            </div>
        </div>
    );
};

// UserModal
const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, onSubmit, user, isLoading, error }) => {
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [role, setRole] = useState<User['role']>(user?.role || 'CLIENT');

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
            setRole(user.role || 'CLIENT');
        } else {
            setName('');
            setEmail('');
            setRole('CLIENT');
        }
    }, [user, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !email.trim()) { alert('Nome e Email são obrigatórios.'); return; }
        if (!user?.id) { alert('Erro: ID do usuário não encontrado para atualização.'); return; }

        const userData: User = {
            ...user, // Mantém outras propriedades do usuário
            name: name.trim(),
            email: email.trim(),
            role
        };
        await onSubmit(userData);
    };

    if (!isOpen || !user) return null;

    const roleOptions: User['role'][] = ['CLIENT', 'MANAGER', 'ADMIN'];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Editar Usuário #{user.id}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="userName" className="block text-gray-700 text-sm font-bold mb-2">Nome:</label>
                        <input type="text" id="userName" value={name} onChange={(e) => setName(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 border-gray-300" required />
                    </div>
                    <div>
                        <label htmlFor="userEmail" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                        <input type="email" id="userEmail" value={email} onChange={(e) => setEmail(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 border-gray-300" required />
                    </div>
                    <div>
                        <label htmlFor="userRole" className="block text-gray-700 text-sm font-bold mb-2">Função (Role):</label>
                        <select id="userRole" value={role} onChange={(e) => setRole(e.target.value as User['role'])}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 border-gray-300" required>
                            {roleOptions.map(option => (<option key={option} value={option}>{option}</option>))}
                        </select>
                    </div>
                    <div className="flex justify-end gap-4 mt-6">
                        <button type="button" onClick={onClose}
                            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition" disabled={isLoading}>
                            Cancelar
                        </button>
                        <button type="submit"
                            className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition" disabled={isLoading}>
                            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    </div>
                </form>
                {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
            </div>
        </div>
    );
};

// PaymentModal
const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSubmit, payment, isLoading, error }) => {
    const [status, setStatus] = useState(payment?.status || '');
    const [amount, setAmount] = useState(payment?.amount?.toString() || '');
    const [paymentMethod, setPaymentMethod] = useState(payment?.paymentMethod || '');

    useEffect(() => {
        if (payment) {
            setStatus(payment.status || '');
            setAmount(payment.amount?.toString() || '');
            setPaymentMethod(payment.paymentMethod || '');
        } else {
            setStatus('');
            setAmount('');
            setPaymentMethod('');
        }
    }, [payment, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!payment?.id) {
            alert("Erro: ID do pagamento não encontrado para atualização.");
            return;
        }
        if (parseFloat(amount) <= 0 || isNaN(parseFloat(amount))) { alert('O valor deve ser um número positivo.'); return; }
        if (!status.trim()) { alert('O status do pagamento é obrigatório.'); return; }
        if (!paymentMethod.trim()) { alert('O método de pagamento é obrigatório.'); return; }

        const paymentData: Payment = {
            ...payment,
            amount: parseFloat(amount),
            status: status.trim(),
            paymentMethod: paymentMethod.trim(),
        };
        await onSubmit(paymentData);
    };

    if (!isOpen || !payment) return null;

    const statusOptions = ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'];
    const paymentMethodOptions = ['CREDIT_CARD', 'DEBIT_CARD', 'CASH', 'PIX', 'BANK_TRANSFER'];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Editar Pagamento #{payment.id}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <p className="text-gray-700">ID do Pedido: <span className="font-semibold">{payment.orderId || 'N/A'}</span></p>
                    <div>
                        <label htmlFor="paymentAmount" className="block text-gray-700 text-sm font-bold mb-2">Valor:</label>
                        <input type="number" id="paymentAmount" value={amount} onChange={(e) => setAmount(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 border-gray-300" step="0.01" required />
                    </div>
                    <div>
                        <label htmlFor="paymentMethod" className="block text-gray-700 text-sm font-bold mb-2">Método de Pagamento:</label>
                        <select id="paymentMethod" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 border-gray-300" required>
                            <option value="">Selecione um método</option>
                            {paymentMethodOptions.map(method => (<option key={method} value={method}>{method}</option>))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="paymentStatus" className="block text-gray-700 text-sm font-bold mb-2">Status:</label>
                        <select id="paymentStatus" value={status} onChange={(e) => setStatus(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 border-gray-300" required>
                            <option value="">Selecione um status</option>
                            {statusOptions.map(option => (<option key={option} value={option}>{option}</option>))}
                        </select>
                    </div>
                    <div className="flex justify-end gap-4 mt-6">
                        <button type="button" onClick={onClose}
                            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition" disabled={isLoading}>
                            Cancelar
                        </button>
                        <button type="submit"
                            className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition" disabled={isLoading}>
                            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    </div>
                </form>
                {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
            </div>
        </div>
    );
};

// OrderItemModal
const OrderItemModal: React.FC<OrderItemModalProps> = ({ isOpen, onClose, onSubmit, orderItem, isLoading, error }) => {
    const [name, setName] = useState(orderItem?.name || '');
    const [price, setPrice] = useState(orderItem?.price?.toString() || '');
    const [quantity, setQuantity] = useState(orderItem?.quantity?.toString() || '');
    const [status, setStatus] = useState(orderItem?.status || '');

    useEffect(() => {
        if (orderItem) {
            setName(orderItem.name || '');
            setPrice(orderItem.price?.toString() || '');
            setQuantity(orderItem.quantity?.toString() || '');
            setStatus(orderItem.status || '');
        } else {
            setName('');
            setPrice('');
            setQuantity('');
            setStatus('');
        }
    }, [orderItem, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderItem?.id) {
            alert("Erro: ID do item do pedido não encontrado para atualização.");
            return;
        }
        if (!name.trim()) { alert('O nome do item é obrigatório.'); return; }
        if (parseFloat(price) <= 0 || isNaN(parseFloat(price))) { alert('O preço deve ser um número positivo.'); return; }
        if (parseInt(quantity) <= 0 || isNaN(parseInt(quantity))) { alert('A quantidade deve ser um número positivo.'); return; }
        if (!status.trim()) { alert('O status do item é obrigatório.'); return; }

        const orderItemData: OrderItem = {
            ...orderItem,
            name: name.trim(),
            price: parseFloat(price),
            quantity: parseInt(quantity),
            status: status.trim()
        };
        await onSubmit(orderItemData);
    };

    if (!isOpen || !orderItem) return null;

    const statusOptions = ['PENDING', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED'];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Editar Item do Pedido #{orderItem.id}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <p className="text-gray-700">ID do Pedido: <span className="font-semibold">{orderItem.orderId || 'N/A'}</span></p>
                    <p className="text-gray-700">ID do Produto: <span className="font-semibold">{orderItem.productId || 'N/A'}</span></p>
                    <div>
                        <label htmlFor="orderItemName" className="block text-gray-700 text-sm font-bold mb-2">Nome do Item:</label>
                        <input type="text" id="orderItemName" value={name} onChange={(e) => setName(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 border-gray-300" required />
                    </div>
                    <div>
                        <label htmlFor="orderItemPrice" className="block text-gray-700 text-sm font-bold mb-2">Preço:</label>
                        <input type="number" id="orderItemPrice" value={price} onChange={(e) => setPrice(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 border-gray-300" step="0.01" required />
                    </div>
                    <div>
                        <label htmlFor="orderItemQuantity" className="block text-gray-700 text-sm font-bold mb-2">Quantidade:</label>
                        <input type="number" id="orderItemQuantity" value={quantity} onChange={(e) => setQuantity(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 border-gray-300" required />
                    </div>
                    <div>
                        <label htmlFor="orderItemStatus" className="block text-gray-700 text-sm font-bold mb-2">Status:</label>
                        <select id="orderItemStatus" value={status} onChange={(e) => setStatus(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 border-gray-300" required>
                            <option value="">Selecione um status</option>
                            {statusOptions.map(option => (<option key={option} value={option}>{option}</option>))}
                        </select>
                    </div>
                    <div className="flex justify-end gap-4 mt-6">
                        <button type="button" onClick={onClose}
                            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition" disabled={isLoading}>
                            Cancelar
                        </button>
                        <button type="submit"
                            className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition" disabled={isLoading}>
                            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    </div>
                </form>
                {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
            </div>
        </div>
    );
};

// RestaurantModal
const RestaurantModal: React.FC<RestaurantModalProps> = ({ isOpen, onClose, onSubmit, restaurant, isLoading, error }) => {
    const [name, setName] = useState(restaurant?.name || '');
    const [address, setAddress] = useState(restaurant?.address || '');
    const [phone, setPhone] = useState(restaurant?.phone || '');
    const [email, setEmail] = useState(restaurant?.email || '');

    useEffect(() => {
        if (restaurant) {
            setName(restaurant.name || '');
            setAddress(restaurant.address || '');
            setPhone(restaurant.phone || '');
            setEmail(restaurant.email || '');
        } else {
            setName('');
            setAddress('');
            setPhone('');
            setEmail('');
        }
    }, [restaurant, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) { alert('O nome do restaurante é obrigatório.'); return; }
        if (!email.trim()) { alert('O email do restaurante é obrigatório.'); return; }

        const restaurantData: Restaurant = {
            id: restaurant?.id,
            name: name.trim(),
            address: address.trim() || undefined,
            phone: phone.trim() || undefined,
            email: email.trim(),
        };
        await onSubmit(restaurantData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">{restaurant ? 'Editar Restaurante' : 'Adicionar Novo Restaurante'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="restaurantName" className="block text-gray-700 text-sm font-bold mb-2">Nome do Restaurante:</label>
                        <input type="text" id="restaurantName" value={name} onChange={(e) => setName(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 border-gray-300" required />
                    </div>
                    <div>
                        <label htmlFor="restaurantAddress" className="block text-gray-700 text-sm font-bold mb-2">Endereço:</label>
                        <input type="text" id="restaurantAddress" value={address} onChange={(e) => setAddress(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 border-gray-300" />
                    </div>
                    <div>
                        <label htmlFor="restaurantPhone" className="block text-gray-700 text-sm font-bold mb-2">Telefone:</label>
                        <input type="text" id="restaurantPhone" value={phone} onChange={(e) => setPhone(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 border-gray-300" />
                    </div>
                    <div>
                        <label htmlFor="restaurantEmail" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                        <input type="email" id="restaurantEmail" value={email} onChange={(e) => setEmail(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 border-gray-300" required />
                    </div>
                    <div className="flex justify-end gap-4 mt-6">
                        <button type="button" onClick={onClose}
                            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition" disabled={isLoading}>
                            Cancelar
                        </button>
                        <button type="submit"
                            className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition" disabled={isLoading}>
                            {isLoading ? 'Salvando...' : (restaurant ? 'Salvar Alterações' : 'Adicionar Restaurante')}
                        </button>
                    </div>
                </form>
                {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
            </div>
        </div>
    );
};


// --- Componente AdminDashboard Principal ---
const AdminDashboard = () => {
    const { authorities } = useAuth();

    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]); // New state for menu categories

    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);

    const [payments, setPayments] = useState<Payment[]>([]); // New state
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null); // New state
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false); // New state

    const [orderItems, setOrderItems] = useState<OrderItem[]>([]); // New state
    const [selectedOrderItem, setSelectedOrderItem] = useState<OrderItem | null>(null); // New state
    const [isOrderItemModalOpen, setIsOrderItemModalOpen] = useState(false); // New state

    const [restaurants, setRestaurants] = useState<Restaurant[]>([]); // New state
    const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null); // New state
    const [isRestaurantModalOpen, setIsRestaurantModalOpen] = useState(false); // New state


    const [productLoading, setProductLoading] = useState(false);
    const [productError, setProductError] = useState<string | null>(null);
    const [orderLoading, setOrderLoading] = useState(false);
    const [orderError, setOrderError] = useState<string | null>(null);
    const [userLoading, setUserLoading] = useState(false);
    const [userError, setUserError] = useState<string | null>(null);
    const [paymentLoading, setPaymentLoading] = useState(false); // New state
    const [paymentError, setPaymentError] = useState<string | null>(null); // New state
    const [orderItemLoading, setOrderItemLoading] = useState(false); // New state
    const [orderItemError, setOrderItemError] = useState<string | null>(null); // New state
    const [restaurantLoading, setRestaurantLoading] = useState(false); // New state
    const [restaurantError, setRestaurantError] = useState<string | null>(null); // New state


    // --- Estados para os Filtros ---
    // Produtos
    const [filterProductName, setFilterProductName] = useState('');
    const [filterProductMinPrice, setFilterProductMinPrice] = useState('');
    const [filterProductMaxPrice, setFilterProductMaxPrice] = useState('');
    const [filterProductCategory, setFilterProductCategory] = useState(''); // New filter

    // Pedidos
    const [filterOrderId, setFilterOrderId] = useState('');
    const [filterOrderStatus, setFilterOrderStatus] = useState('');
    const [filterOrderMinTotal, setFilterOrderMinTotal] = useState('');
    const [filterOrderMaxTotal, setFilterOrderMaxTotal] = useState('');
    const [filterOrderConsumptionMethod, setFilterOrderConsumptionMethod] = useState(''); // New filter

    // Usuários
    const [filterUserName, setFilterUserName] = useState('');
    const [filterUserEmail, setFilterUserEmail] = useState('');
    const [filterUserRole, setFilterUserRole] = useState('');

    // Pagamentos
    const [filterPaymentId, setFilterPaymentId] = useState(''); // New filter
    const [filterPaymentStatus, setFilterPaymentStatus] = useState(''); // New filter
    const [filterPaymentMethod, setFilterPaymentMethod] = useState(''); // New filter

    // Itens de Pedido
    const [filterOrderItemId, setFilterOrderItemId] = useState(''); // New filter
    const [filterOrderItemOrderId, setFilterOrderItemOrderId] = useState(''); // New filter
    const [filterOrderItemStatus, setFilterOrderItemStatus] = useState(''); // New filter

    // Restaurantes
    const [filterRestaurantName, setFilterRestaurantName] = useState(''); // New filter
    const [filterRestaurantEmail, setFilterRestaurantEmail] = useState(''); // New filter


    const isAdmin = authorities.includes('ADMIN');

    // Funções de tratamento de erro e formatação de data são movidas para fora do componente

    // --- Funções de Fetch e CRUD (otimizadas com useCallback) ---
    const fetchMenuCategories = useCallback(async () => {
        try {
            const data = await getAllMenus();
            setMenuCategories(data);
        } catch (err: unknown) {
            console.error("Falha ao buscar categorias de menu:", err);
            // Optionally set an error state if categories are critical
        }
    }, []);

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
    }, []); // Dependências vazias, pois getErrorMessage é estável

    const handleAddEditProduct = useCallback(async (productData: Product) => {
        setProductLoading(true);
        setProductError(null); // Limpa erro anterior do modal
        try {
            if (productData.id) {
                await updateProduct(productData);
            } else {
                await saveProduct({ ...productData, id: undefined } as Omit<Product, 'id'>);
            }
            setIsProductModalOpen(false);
            setSelectedProduct(null);
            await fetchProducts(); // Garante que a lista seja atualizada após a operação
        } catch (err: unknown) {
            console.error("Erro ao salvar produto:", err);
            setProductError(`Erro ao salvar produto: ${getErrorMessage(err)}`);
            throw err; // Re-throw para o modal poder pegar o erro
        } finally {
            setProductLoading(false);
        }
    }, [fetchProducts]);

    const handleDeleteProduct = useCallback(async (productId: string | number) => {
        if (window.confirm("Tem certeza que deseja excluir este produto?")) {
            setProductLoading(true);
            setProductError(null);
            try {
                await deleteProduct(productId);
                await fetchProducts();
            } catch (err: unknown) {
                console.error("Erro ao excluir produto:", err);
                setProductError(`Erro ao excluir produto: ${getErrorMessage(err)}`);
            } finally {
                setProductLoading(false);
            }
        }
    }, [fetchProducts]);

    const fetchOrders = useCallback(async () => {
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
    }, []);

    const handleUpdateOrderStatus = useCallback(async (orderId: string | number, newStatus: Order['status']) => {
        setOrderLoading(true);
        setOrderError(null); // Limpa erro anterior do modal
        try {
            const currentOrder = orders.find(order => order.id === orderId);
            if (!currentOrder) {
                throw new Error("Pedido não encontrado para atualização de status.");
            }
            const updatedOrderData: Order = { ...currentOrder, status: newStatus };
            await updateOrder(updatedOrderData);

            setIsOrderModalOpen(false);
            setSelectedOrder(null);
            await fetchOrders();
        } catch (err: unknown) {
            console.error("Erro ao atualizar status do pedido:", err);
            setOrderError(`Erro ao atualizar status do pedido: ${getErrorMessage(err)}`);
            throw err; // Re-throw para o modal poder pegar o erro
        } finally {
            setOrderLoading(false);
        }
    }, [orders, fetchOrders]); // orders é dependência, pois find() usa o estado atual

    const handleDeleteOrder = useCallback(async (orderId: string | number) => {
        if (window.confirm("Tem certeza que deseja cancelar/excluir este pedido?")) {
            setOrderLoading(true);
            setOrderError(null);
            try {
                await deleteOrder(orderId);
                await fetchOrders();
            } catch (err: unknown) {
                console.error("Erro ao excluir pedido:", err);
                setOrderError(`Erro ao excluir pedido: ${getErrorMessage(err)}`);
            } finally {
                setOrderLoading(false);
            }
        }
    }, [fetchOrders]);

    const fetchUsers = useCallback(async () => {
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
    }, []);

    const handleEditUser = useCallback(async (userData: User) => {
        setUserLoading(true);
        setUserError(null); // Limpa erro anterior do modal
        try {
            await updateUser(userData);
            setIsUserModalOpen(false);
            setSelectedUser(null);
            await fetchUsers();
        } catch (err: unknown) {
            console.error("Erro ao atualizar usuário:", err);
            setUserError(`Erro ao atualizar usuário: ${getErrorMessage(err)}`);
            throw err; // Re-throw para o modal poder pegar o erro
        } finally {
            setUserLoading(false);
        }
    }, [fetchUsers]);

    const handleDeleteUser = useCallback(async (userId: string | number) => {
        if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
            setUserLoading(true);
            setUserError(null);
            try {
                await deleteUser(userId);
                await fetchUsers();
            } catch (err: unknown) {
                console.error("Erro ao excluir usuário:", err);
                setUserError(`Erro ao excluir usuário: ${getErrorMessage(err)}`);
            } finally {
                setUserLoading(false);
            }
        }
    }, [fetchUsers]);

    // New fetch and CRUD functions for Payments
    const fetchPayments = useCallback(async () => {
        setPaymentLoading(true);
        setPaymentError(null);
        try {
            const data = await getAllPayments();
            console.log("Dados de pagamentos recebidos:", data); // Log para verificar os dados recebidos
            setPayments(data);
        } catch (err: unknown) {
            console.error("Falha ao buscar pagamentos:", err);
            setPaymentError(`Não foi possível carregar os pagamentos: ${getErrorMessage(err)}`);
        } finally {
            setPaymentLoading(false);
        }
    }, []);

    const handleEditPayment = useCallback(async (paymentData: Payment) => {
        setPaymentLoading(true);
        setPaymentError(null);
        try {
            await updatePayment(paymentData);
            setIsPaymentModalOpen(false);
            setSelectedPayment(null);
            await fetchPayments();
        } catch (err: unknown) {
            console.error("Erro ao atualizar pagamento:", err);
            setPaymentError(`Erro ao atualizar pagamento: ${getErrorMessage(err)}`);
            throw err;
        } finally {
            setPaymentLoading(false);
        }
    }, [fetchPayments]);

    const handleDeletePayment = useCallback(async (paymentId: string | number) => {
        if (window.confirm("Tem certeza que deseja excluir este pagamento?")) {
            setPaymentLoading(true);
            setPaymentError(null);
            try {
                await deletePayment(typeof paymentId === 'string' ? parseInt(paymentId, 10) : paymentId);
                await fetchPayments();
            } catch (err: unknown) {
                console.error("Erro ao excluir pagamento:", err);
                setPaymentError(`Erro ao excluir pagamento: ${getErrorMessage(err)}`);
            } finally {
                setPaymentLoading(false);
            }
        }
    }, [fetchPayments]);

    // New fetch and CRUD functions for Order Items
    const fetchOrderItems = useCallback(async () => {
        setOrderItemLoading(true);
        setOrderItemError(null);
        try {
            const data = await getAllOrderItems();
            setOrderItems(data);
        } catch (err: unknown) {
            console.error("Falha ao buscar itens de pedido:", err);
            setOrderItemError(`Não foi possível carregar os itens de pedido: ${getErrorMessage(err)}`);
        } finally {
            setOrderItemLoading(false);
        }
    }, []);

    const handleEditOrderItem = useCallback(async (orderItemData: OrderItem) => {
        setOrderItemLoading(true);
        setOrderItemError(null);
        try {
            await updateOrderItem(orderItemData);
            setIsOrderItemModalOpen(false);
            setSelectedOrderItem(null);
            await fetchOrderItems();
        } catch (err: unknown) {
            console.error("Erro ao atualizar item de pedido:", err);
            setOrderItemError(`Erro ao atualizar item de pedido: ${getErrorMessage(err)}`);
            throw err;
        } finally {
            setOrderItemLoading(false);
        }
    }, [fetchOrderItems]);

    const handleDeleteOrderItem = useCallback(async (orderItemId: string | number) => {
        if (window.confirm("Tem certeza que deseja excluir este item de pedido?")) {
            setOrderItemLoading(true);
            setOrderItemError(null);
            try {
                await deleteOrderItem(orderItemId);
                await fetchOrderItems();
            } catch (err: unknown) {
                console.error("Erro ao excluir item de pedido:", err);
                setOrderItemError(`Erro ao excluir item de pedido: ${getErrorMessage(err)}`);
            } finally {
                setOrderItemLoading(false);
            }
        }
    }, [fetchOrderItems]);

    // New fetch and CRUD functions for Restaurants
    const fetchRestaurants = useCallback(async () => {
        setRestaurantLoading(true);
        setRestaurantError(null);
        try {
            const data = await getRestaurants();
            setRestaurants(data);
        } catch (err: unknown) {
            console.error("Falha ao buscar restaurantes:", err);
            setRestaurantError(`Não foi possível carregar os restaurantes: ${getErrorMessage(err)}`);
        } finally {
            setRestaurantLoading(false);
        }
    }, []);

    const handleAddEditRestaurant = useCallback(async (restaurantData: Restaurant) => {
        setRestaurantLoading(true);
        setRestaurantError(null);
        try {
            if (restaurantData.id) {
                await updateRestaurant(String(restaurantData.id), restaurantData);
            } else {
                await saveRestaurant({ ...restaurantData, id: undefined });
            }
            setIsRestaurantModalOpen(false);
            setSelectedRestaurant(null);
            await fetchRestaurants();
        } catch (err: unknown) {
            console.error("Erro ao salvar restaurante:", err);
            setRestaurantError(`Erro ao salvar restaurante: ${getErrorMessage(err)}`);
            throw err;
        } finally {
            setRestaurantLoading(false);
        }
    }, [fetchRestaurants]);

    const handleDeleteRestaurant = useCallback(async (restaurantId: string | number) => {
        if (window.confirm("Tem certeza que deseja excluir este restaurante?")) {
            setRestaurantLoading(true);
            setRestaurantError(null);
            try {
                await deleteRestaurant(String(restaurantId));
                await fetchRestaurants();
            } catch (err: unknown) {
                console.error("Erro ao excluir restaurante:", err);
                setRestaurantError(`Erro ao excluir restaurante: ${getErrorMessage(err)}`);
            } finally {
                setRestaurantLoading(false);
            }
        }
    }, [fetchRestaurants]);


    // --- useEffects para carregar dados na montagem ou quando isAdmin muda ---
    useEffect(() => {
        if (isAdmin) {
            fetchProducts();
            fetchOrders();
            fetchUsers();
            fetchPayments(); // Fetch payments
            fetchOrderItems(); // Fetch order items
            fetchRestaurants(); // Fetch restaurants
            fetchMenuCategories(); // Fetch menu categories for product modal
        }
    }, [isAdmin, fetchProducts, fetchOrders, fetchUsers, fetchPayments, fetchOrderItems, fetchRestaurants, fetchMenuCategories]); // All fetch functions are dependencies

    // --- Lógica de Filtragem Otimizada com useMemo ---

    // Produtos Filtrados
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesName = product.name?.toLowerCase().includes(filterProductName.toLowerCase()) ||
                product.description?.toLowerCase().includes(filterProductName.toLowerCase());

            const price = product.price ?? 0;
            const minPrice = parseFloat(filterProductMinPrice);
            const maxPrice = parseFloat(filterProductMaxPrice);

            const matchesMinPrice = isNaN(minPrice) || price >= minPrice;
            const matchesMaxPrice = isNaN(maxPrice) || price <= maxPrice;

            const matchesCategory = !filterProductCategory || product.menuCategoryId?.toString() === filterProductCategory;

            return matchesName && matchesMinPrice && matchesMaxPrice && matchesCategory;
        });
    }, [products, filterProductName, filterProductMinPrice, filterProductMaxPrice, filterProductCategory]);

    // Pedidos Filtrados
    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const matchesId = !filterOrderId || order.id?.toString().includes(filterOrderId);
            const matchesStatus = !filterOrderStatus || order.status === filterOrderStatus;
            const matchesConsumptionMethod = !filterOrderConsumptionMethod || order.consumption_method === filterOrderConsumptionMethod;


            const total = order.total ?? 0;
            const minTotal = parseFloat(filterOrderMinTotal);
            const maxTotal = parseFloat(filterOrderMaxTotal);

            const matchesMinTotal = isNaN(minTotal) || total >= minTotal;
            const matchesMaxTotal = isNaN(maxTotal) || total <= maxTotal;

            return matchesId && matchesStatus && matchesMinTotal && matchesMaxTotal && matchesConsumptionMethod;
        });
    }, [orders, filterOrderId, filterOrderStatus, filterOrderMinTotal, filterOrderMaxTotal, filterOrderConsumptionMethod]);

    // Usuários Filtrados
    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesName = !filterUserName || user.name?.toLowerCase().includes(filterUserName.toLowerCase());
            const matchesEmail = !filterUserEmail || user.email?.toLowerCase().includes(filterUserEmail.toLowerCase());
            const matchesRole = !filterUserRole || user.role === filterUserRole;
            return matchesName && matchesEmail && matchesRole;
        });
    }, [users, filterUserName, filterUserEmail, filterUserRole]);

    // Pagamentos Filtrados
    const filteredPayments = useMemo(() => {
        return payments.filter(payment => {
            const matchesId = !filterPaymentId || payment.id?.toString().includes(filterPaymentId);
            const matchesStatus = !filterPaymentStatus || payment.status === filterPaymentStatus;
            const matchesMethod = !filterPaymentMethod || payment.paymentMethod === filterPaymentMethod;
            return matchesId && matchesStatus && matchesMethod;
        });
    }, [payments, filterPaymentId, filterPaymentStatus, filterPaymentMethod]);

    // Itens de Pedido Filtrados
    const filteredOrderItems = useMemo(() => {
        return orderItems.filter(item => {
            const matchesId = !filterOrderItemId || item.id?.toString().includes(filterOrderItemId);
            const matchesOrderId = !filterOrderItemOrderId || item.orderId?.toString().includes(filterOrderItemOrderId);
            const matchesStatus = !filterOrderItemStatus || item.status === filterOrderItemStatus;
            return matchesId && matchesOrderId && matchesStatus;
        });
    }, [orderItems, filterOrderItemId, filterOrderItemOrderId, filterOrderItemStatus]);

    // Restaurantes Filtrados
    const filteredRestaurants = useMemo(() => {
        return restaurants.filter(restaurant => {
            const matchesName = !filterRestaurantName || restaurant.name?.toLowerCase().includes(filterRestaurantName.toLowerCase());
            const matchesEmail = !filterRestaurantEmail || restaurant.email?.toLowerCase().includes(filterRestaurantEmail.toLowerCase());
            return matchesName && matchesEmail;
        });
    }, [restaurants, filterRestaurantName, filterRestaurantEmail]);


    // --- Renderização Principal do AdminDashboard ---
    return (
        <div className="min-h-screen bg-white p-6 md:p-10 text-gray-800 rounded-lg shadow-lg font-sans">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
                <h1 className="text-4xl md:text-5xl font-extrabold text-orange-600 mb-4 sm:mb-0">Painel do Administrador</h1>
            </div>

            <p className="text-lg text-gray-700 mb-10">
                Gerencie produtos, pedidos, usuários, pagamentos, itens de pedido e restaurantes do sistema.
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

                {/* --- Filtros de Produto --- */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div>
                        <label htmlFor="filterProductName" className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Nome/Descrição:</label>
                        <input
                            type="text"
                            id="filterProductName"
                            value={filterProductName}
                            onChange={(e) => setFilterProductName(e.target.value)}
                            placeholder="Nome ou descrição do produto"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="filterProductMinPrice" className="block text-sm font-medium text-gray-700 mb-1">Preço Mínimo:</label>
                        <input
                            type="number"
                            id="filterProductMinPrice"
                            value={filterProductMinPrice}
                            onChange={(e) => setFilterProductMinPrice(e.target.value)}
                            placeholder="R$ 0.00"
                            step="0.01"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="filterProductMaxPrice" className="block text-sm font-medium text-gray-700 mb-1">Preço Máximo:</label>
                        <input
                            type="number"
                            id="filterProductMaxPrice"
                            value={filterProductMaxPrice}
                            onChange={(e) => setFilterProductMaxPrice(e.target.value)}
                            placeholder="R$ 999.99"
                            step="0.01"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="filterProductCategory" className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Categoria:</label>
                        <select
                            id="filterProductCategory"
                            value={filterProductCategory}
                            onChange={(e) => setFilterProductCategory(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Todas</option>
                            {menuCategories.map(cat => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                        </select>
                    </div>
                </div>

                {productLoading && (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
                        <p className="ml-4 text-green-600">Carregando produtos...</p>
                    </div>
                )}
                {productError && <p className="text-red-600 text-center py-4">{productError}</p>}

                {!productLoading && !productError && (
                    filteredProducts.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white rounded-lg overflow-hidden border border-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">ID</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Nome</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Preço</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Estoque</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Categoria ID</th> {/* Adicionado */}
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredProducts.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50 transition-colors duration-200">
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">{product.id}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">{product.name}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">R$ {(product.price ?? 0).toFixed(2)}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">{product.amount}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">{product.menuCategoryId}</td> {/* Exibe Categoria ID */}
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
                        <p className="text-gray-600 text-center py-4">Nenhum produto encontrado com os filtros aplicados.</p>
                    )
                )}
            </div>

            {/* --- Seção de Gerenciamento de Pedidos --- */}
            <div className="bg-gray-100 rounded-lg shadow-md p-6 mb-10 border border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                    <h3 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">Gerenciamento de Pedidos</h3>
                </div>

                {/* --- Filtros de Pedidos --- */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                    <div>
                        <label htmlFor="filterOrderId" className="block text-sm font-medium text-gray-700 mb-1">Filtrar por ID do Pedido:</label>
                        <input
                            type="text"
                            id="filterOrderId"
                            value={filterOrderId}
                            onChange={(e) => setFilterOrderId(e.target.value)}
                            placeholder="ID do Pedido"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="filterOrderStatus" className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Status:</label>
                        <select
                            id="filterOrderStatus"
                            value={filterOrderStatus}
                            onChange={(e) => setFilterOrderStatus(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Todos</option>
                            <option value="PENDING">PENDENTE</option>
                            <option value="CONFIRMED">CONFIRMADO</option>
                            <option value="PREPARING">PREPARANDO</option>
                            <option value="READY">PRONTO</option>
                            <option value="DELIVERED">ENTREGUE</option>
                            <option value="CANCELLED">CANCELADO</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="filterOrderMinTotal" className="block text-sm font-medium text-gray-700 mb-1">Total Mínimo:</label>
                        <input
                            type="number"
                            id="filterOrderMinTotal"
                            value={filterOrderMinTotal}
                            onChange={(e) => setFilterOrderMinTotal(e.target.value)}
                            placeholder="R$ 0.00"
                            step="0.01"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="filterOrderMaxTotal" className="block text-sm font-medium text-gray-700 mb-1">Total Máximo:</label>
                        <input
                            type="number"
                            id="filterOrderMaxTotal"
                            value={filterOrderMaxTotal}
                            onChange={(e) => setFilterOrderMaxTotal(e.target.value)}
                            placeholder="R$ 999.99"
                            step="0.01"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="filterOrderConsumptionMethod" className="block text-sm font-medium text-gray-700 mb-1">Método Consumo:</label>
                        <select
                            id="filterOrderConsumptionMethod"
                            value={filterOrderConsumptionMethod}
                            onChange={(e) => setFilterOrderConsumptionMethod(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Todos</option>
                            <option value="DELIVERY">DELIVERY</option>
                            <option value="PICKUP">PICKUP</option>
                            <option value="DINE_IN">DINE_IN</option>
                        </select>
                    </div>
                </div>

                {orderLoading && (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
                        <p className="ml-4 text-orange-600">Carregando pedidos...</p>
                    </div>
                )}
                {orderError && <p className="text-red-600 text-center py-4">{orderError}</p>}

                {!orderLoading && !orderError && (
                    filteredOrders.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white rounded-lg overflow-hidden border border-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">ID</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Cliente (ID)</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Total</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Data</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Status</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Método Consumo</th> {/* Adicionado */}
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-200">
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">{order.id}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">{order.userId || 'N/A'}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">R$ {order.total ? order.total.toFixed(2) : '0.00'}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">
                                                {formatOrderDate(order.createdAt)}
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
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">{order.consumption_method || 'N/A'}</td>
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
                        <p className="text-gray-600 text-center py-4">Nenhum pedido encontrado com os filtros aplicados.</p>
                    )
                )}
            </div>

            {/* --- Nova Seção de Gerenciamento de Usuários --- */}
            <div className="bg-gray-100 rounded-lg shadow-md p-6 mb-10 border border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                    <h3 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">Gerenciamento de Usuários</h3>
                </div>

                {/* --- Filtros de Usuários --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                        <label htmlFor="filterUserName" className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Nome:</label>
                        <input
                            type="text"
                            id="filterUserName"
                            value={filterUserName}
                            onChange={(e) => setFilterUserName(e.target.value)}
                            placeholder="Nome do usuário"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="filterUserEmail" className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Email:</label>
                        <input
                            type="email"
                            id="filterUserEmail"
                            value={filterUserEmail}
                            onChange={(e) => setFilterUserEmail(e.target.value)}
                            placeholder="email@exemplo.com"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="filterUserRole" className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Função (Role):</label>
                        <select
                            id="filterUserRole"
                            value={filterUserRole}
                            onChange={(e) => setFilterUserRole(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Todas</option>
                            <option value="CLIENT">CLIENTE</option>
                            <option value="MANAGER">GERENTE</option>
                            <option value="ADMIN">ADMIN</option>
                        </select>
                    </div>
                </div>

                {userLoading && (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
                        <p className="ml-4 text-purple-600">Carregando usuários...</p>
                    </div>
                )}
                {userError && <p className="text-red-600 text-center py-4">{userError}</p>}

                {!userLoading && !userError && (
                    filteredUsers.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white rounded-lg overflow-hidden border border-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">ID</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Nome</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Email</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Role</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-200">
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">{user.id}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">{user.name}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">{user.email}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    user.role === 'ADMIN' ? 'bg-orange-100 text-orange-800' :
                                                        user.role === 'MANAGER' ? 'bg-purple-100 text-purple-800' :
                                                            'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => { setSelectedUser(user); setIsUserModalOpen(true); }}
                                                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-xs mr-2 transition"
                                                >
                                                    <i className="fas fa-edit mr-1"></i> Editar
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(user.id as number)}
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
                        <p className="text-gray-600 text-center py-4">Nenhum usuário encontrado com os filtros aplicados.</p>
                    )
                )}
            </div>

            {/* --- Nova Seção de Gerenciamento de Pagamentos --- */}
            <div className="bg-gray-100 rounded-lg shadow-md p-6 mb-10 border border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                    <h3 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">Gerenciamento de Pagamentos</h3>
                </div>

                {/* --- Filtros de Pagamentos --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                        <label htmlFor="filterPaymentId" className="block text-sm font-medium text-gray-700 mb-1">Filtrar por ID do Pagamento:</label>
                        <input
                            type="text"
                            id="filterPaymentId"
                            value={filterPaymentId}
                            onChange={(e) => setFilterPaymentId(e.target.value)}
                            placeholder="ID do Pagamento"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="filterPaymentStatus" className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Status:</label>
                        <select
                            id="filterPaymentStatus"
                            value={filterPaymentStatus}
                            onChange={(e) => setFilterPaymentStatus(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Todos</option>
                            <option value="PENDING">PENDENTE</option>
                            <option value="COMPLETED">COMPLETADO</option>
                            <option value="FAILED">FALHOU</option>
                            <option value="REFUNDED">REEMBOLSADO</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="filterPaymentMethod" className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Método:</label>
                        <select
                            id="filterPaymentMethod"
                            value={filterPaymentMethod}
                            onChange={(e) => setFilterPaymentMethod(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Todos</option>
                            <option value="CREDIT_CARD">CARTÃO DE CRÉDITO</option>
                            <option value="DEBIT_CARD">CARTÃO DE DÉBITO</option>
                            <option value="CASH">DINHEIRO</option>
                            <option value="PIX">PIX</option>
                            <option value="BANK_TRANSFER">TRANSFERÊNCIA BANCÁRIA</option>
                        </select>
                    </div>
                </div>

                {paymentLoading && (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                        <p className="ml-4 text-blue-600">Carregando pagamentos...</p>
                    </div>
                )}
                {paymentError && <p className="text-red-600 text-center py-4">{paymentError}</p>}

                {!paymentLoading && !paymentError && (
                    filteredPayments.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white rounded-lg overflow-hidden border border-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">ID</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">ID Pedido</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Valor</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Método</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Status</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredPayments.map((payment) => (
                                        <tr key={payment.id} className="hover:bg-gray-50 transition-colors duration-200">
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">{payment.id}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">{payment.orderId || 'N/A'}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">R$ {(payment.amount ?? 0).toFixed(2)}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">{payment.paymentMethod}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    payment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                        payment.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                                            'bg-red-100 text-red-800'
                                                }`}>
                                                    {payment.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => { setSelectedPayment(payment); setIsPaymentModalOpen(true); }}
                                                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-xs mr-2 transition"
                                                >
                                                    <i className="fas fa-edit mr-1"></i> Editar
                                                </button>
                                                <button
                                                    onClick={() => handleDeletePayment(payment.id as number)}
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
                        <p className="text-gray-600 text-center py-4">Nenhum pagamento encontrado com os filtros aplicados.</p>
                    )
                )}
            </div>

            {/* --- Nova Seção de Gerenciamento de Itens de Pedido --- */}
            <div className="bg-gray-100 rounded-lg shadow-md p-6 mb-10 border border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                    <h3 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">Gerenciamento de Itens de Pedido</h3>
                </div>

                {/* --- Filtros de Itens de Pedido --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                        <label htmlFor="filterOrderItemId" className="block text-sm font-medium text-gray-700 mb-1">Filtrar por ID do Item:</label>
                        <input
                            type="text"
                            id="filterOrderItemId"
                            value={filterOrderItemId}
                            onChange={(e) => setFilterOrderItemId(e.target.value)}
                            placeholder="ID do Item"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="filterOrderItemOrderId" className="block text-sm font-medium text-gray-700 mb-1">Filtrar por ID do Pedido:</label>
                        <input
                            type="text"
                            id="filterOrderItemOrderId"
                            value={filterOrderItemOrderId}
                            onChange={(e) => setFilterOrderItemOrderId(e.target.value)}
                            placeholder="ID do Pedido"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="filterOrderItemStatus" className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Status:</label>
                        <select
                            id="filterOrderItemStatus"
                            value={filterOrderItemStatus}
                            onChange={(e) => setFilterOrderItemStatus(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Todos</option>
                            <option value="PENDING">PENDENTE</option>
                            <option value="PREPARING">PREPARANDO</option>
                            <option value="READY">PRONTO</option>
                            <option value="DELIVERED">ENTREGUE</option>
                            <option value="CANCELLED">CANCELADO</option>
                        </select>
                    </div>
                </div>

                {orderItemLoading && (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-500"></div>
                        <p className="ml-4 text-teal-600">Carregando itens de pedido...</p>
                    </div>
                )}
                {orderItemError && <p className="text-red-600 text-center py-4">{orderItemError}</p>}

                {!orderItemLoading && !orderItemError && (
                    filteredOrderItems.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white rounded-lg overflow-hidden border border-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">ID</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">ID Pedido</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">ID Produto</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Nome</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Preço</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Quantidade</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Status</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredOrderItems.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-200">
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">{item.id}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">{item.orderId || 'N/A'}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">{item.productId || 'N/A'}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">{item.name}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">R$ {(item.price ?? 0).toFixed(2)}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">{item.quantity}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    item.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                        item.status === 'PREPARING' ? 'bg-blue-100 text-blue-800' :
                                                            item.status === 'READY' ? 'bg-purple-100 text-purple-800' :
                                                                item.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => { setSelectedOrderItem(item); setIsOrderItemModalOpen(true); }}
                                                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-xs mr-2 transition"
                                                >
                                                    <i className="fas fa-edit mr-1"></i> Editar
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteOrderItem(item.id as number)}
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
                        <p className="text-gray-600 text-center py-4">Nenhum item de pedido encontrado com os filtros aplicados.</p>
                    )
                )}
            </div>

            {/* --- Nova Seção de Gerenciamento de Restaurantes --- */}
            <div className="bg-gray-100 rounded-lg shadow-md p-6 mb-10 border border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                    <h3 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">Gerenciamento de Restaurantes</h3>
                    <button
                        onClick={() => { setSelectedRestaurant(null); setIsRestaurantModalOpen(true); }}
                        className="px-6 py-3 bg-indigo-500 text-white font-semibold rounded-md shadow-md hover:bg-indigo-600 transition duration-300 flex items-center"
                    >
                        <i className="fas fa-plus mr-2"></i> Adicionar Novo Restaurante
                    </button>
                </div>

                {/* --- Filtros de Restaurantes --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label htmlFor="filterRestaurantName" className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Nome:</label>
                        <input
                            type="text"
                            id="filterRestaurantName"
                            value={filterRestaurantName}
                            onChange={(e) => setFilterRestaurantName(e.target.value)}
                            placeholder="Nome do restaurante"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="filterRestaurantEmail" className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Email:</label>
                        <input
                            type="email"
                            id="filterRestaurantEmail"
                            value={filterRestaurantEmail}
                            onChange={(e) => setFilterRestaurantEmail(e.target.value)}
                            placeholder="email@restaurante.com"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {restaurantLoading && (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
                        <p className="ml-4 text-indigo-600">Carregando restaurantes...</p>
                    </div>
                )}
                {restaurantError && <p className="text-red-600 text-center py-4">{restaurantError}</p>}

                {!restaurantLoading && !restaurantError && (
                    filteredRestaurants.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white rounded-lg overflow-hidden border border-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">ID</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Nome</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Email</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Telefone</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredRestaurants.map((restaurant) => (
                                        <tr key={restaurant.id} className="hover:bg-gray-50 transition-colors duration-200">
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">{restaurant.id}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">{restaurant.name}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">{restaurant.email}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">{restaurant.phone || 'N/A'}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => { setSelectedRestaurant(restaurant); setIsRestaurantModalOpen(true); }}
                                                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-xs mr-2 transition"
                                                >
                                                    <i className="fas fa-edit mr-1"></i> Editar
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteRestaurant(restaurant.id as number)}
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
                        <p className="text-gray-600 text-center py-4">Nenhum restaurante encontrado com os filtros aplicados.</p>
                    )
                )}
            </div>


            {/* Modals */}
            <ProductModal
                isOpen={isProductModalOpen}
                onClose={() => { setIsProductModalOpen(false); setProductError(null); }}
                onSubmit={handleAddEditProduct}
                product={selectedProduct}
                isLoading={productLoading}
                error={productError}
                menuCategories={menuCategories} // Pass menu categories
            />

            <OrderModal
                isOpen={isOrderModalOpen}
                onClose={() => { setIsOrderModalOpen(false); setOrderError(null); }}
                onSubmit={handleUpdateOrderStatus}
                order={selectedOrder}
                isLoading={orderLoading}
                error={orderError}
            />

            <UserModal
                isOpen={isUserModalOpen}
                onClose={() => { setIsUserModalOpen(false); setUserError(null); }}
                onSubmit={handleEditUser}
                user={selectedUser}
                isLoading={userLoading}
                error={userError}
            />

            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => { setIsPaymentModalOpen(false); setPaymentError(null); }}
                onSubmit={handleEditPayment}
                payment={selectedPayment}
                isLoading={paymentLoading}
                error={paymentError}
            />

            <OrderItemModal
                isOpen={isOrderItemModalOpen}
                onClose={() => { setIsOrderItemModalOpen(false); setOrderItemError(null); }}
                onSubmit={handleEditOrderItem}
                orderItem={selectedOrderItem}
                isLoading={orderItemLoading}
                error={orderItemError}
            />

            <RestaurantModal
                isOpen={isRestaurantModalOpen}
                onClose={() => { setIsRestaurantModalOpen(false); setRestaurantError(null); }}
                onSubmit={handleAddEditRestaurant}
                restaurant={selectedRestaurant}
                isLoading={restaurantLoading}
                error={restaurantError}
            />
        </div>
    );
};

export default AdminDashboard;