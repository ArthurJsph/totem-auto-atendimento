import  { useState, useMemo } from 'react';
import { Product, Order, User, Payment, OrderItem, Restaurant } from '../../service/interfaces';
import { useAdmin } from '../../hooks/useAdmin'; // Importe o novo hook

// Importe os componentes modais (e suas interfaces de props se precisar delas explicitamente)
import ProductModal from '../../modals/ProductModal';
import OrderModal from '../../modals/OrderModal';
import UserModal from '../../modals/UserModal';
import PaymentModal from '../../modals/PaymentModal';
import OrderItemModal from '../../modals/OrderItemModal';
import RestaurantModal from '../../modals/RestaurantModal';

// Funções auxiliares (apenas as que não dependem do estado principal do dashboard)
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


const AdminDashboard = () => {
    // const { authorities } = useAuth();
    const {
        data, loadingError,
        handleAddEditProduct, handleDeleteProduct,
        handleUpdateOrderStatus, handleDeleteOrder,
        handleEditUser, handleDeleteUser,
        handleEditPayment, handleDeletePayment,
        handleEditOrderItem, handleDeleteOrderItem,
        handleAddEditRestaurant, handleDeleteRestaurant
    } = useAdmin(); // Use o novo hook!

    // Estados para controlar a abertura dos modais e os itens selecionados
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);

    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);

    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    const [selectedOrderItem, setSelectedOrderItem] = useState<OrderItem | null>(null);
    const [isOrderItemModalOpen, setIsOrderItemModalOpen] = useState(false);

    const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
    const [isRestaurantModalOpen, setIsRestaurantModalOpen] = useState(false);


    // --- Estados para os Filtros (permanecem aqui, pois são específicos da UI do dashboard) ---
    // Produtos
    const [filterProductName, setFilterProductName] = useState('');
    const [filterProductMinPrice, setFilterProductMinPrice] = useState('');
    const [filterProductMaxPrice, setFilterProductMaxPrice] = useState('');
    const [filterProductCategory, setFilterProductCategory] = useState('');

    // Pedidos
    const [filterOrderId, setFilterOrderId] = useState('');
    const [filterOrderStatus, setFilterOrderStatus] = useState('');
    const [filterOrderMinTotal, setFilterOrderMinTotal] = useState('');
    const [filterOrderMaxTotal, setFilterOrderMaxTotal] = useState('');
    const [filterOrderConsumptionMethod, setFilterOrderConsumptionMethod] = useState('');

    // Usuários
    const [filterUserName, setFilterUserName] = useState('');
    const [filterUserEmail, setFilterUserEmail] = useState('');
    const [filterUserRole, setFilterUserRole] = useState('');

    // Pagamentos
    const [filterPaymentId, setFilterPaymentId] = useState('');
    const [filterPaymentStatus, setFilterPaymentStatus] = useState('');
    const [filterPaymentMethod, setFilterPaymentMethod] = useState('');

    // Itens de Pedido
    const [filterOrderItemId, setFilterOrderItemId] = useState('');
    const [filterOrderItemOrderId, setFilterOrderItemOrderId] = useState('');
    const [filterOrderItemStatus, setFilterOrderItemStatus] = useState('');

    // Restaurantes
    const [filterRestaurantName, setFilterRestaurantName] = useState('');
    const [filterRestaurantEmail, setFilterRestaurantEmail] = useState('');

    // if (!authorities.includes('ADMIN')) {
    //     return <div className="text-center p-10 text-red-600">Acesso negado. Você não tem permissão para visualizar este painel.</div>;
    // }


    // Funções de submit para os modais, agora que chamam as do hook
    const handleSubmitProduct = async (productData: Product) => {
        try {
            await handleAddEditProduct(productData);
            setIsProductModalOpen(false);
            setSelectedProduct(null);
        } catch (err) {
            // O erro já foi setado no hook, então o modal o exibirá
            console.error("Erro no submit do modal de produto:", err);
        }
    };

    const handleSubmitOrder = async (orderId: string | number, newStatus: Order['status']) => {
        try {
            await handleUpdateOrderStatus(orderId, newStatus);
            setIsOrderModalOpen(false);
            setSelectedOrder(null);
        } catch (err) {
            console.error("Erro no submit do modal de pedido:", err);
        }
    };

    const handleSubmitUser = async (userData: User) => {
        try {
            await handleEditUser(userData);
            setIsUserModalOpen(false);
            setSelectedUser(null);
        } catch (err) {
            console.error("Erro no submit do modal de usuário:", err);
        }
    };

    const handleSubmitPayment = async (paymentData: Payment) => {
        try {
            await handleEditPayment(paymentData);
            setIsPaymentModalOpen(false);
            setSelectedPayment(null);
        } catch (err) {
            console.error("Erro no submit do modal de pagamento:", err);
        }
    };

    const handleSubmitOrderItem = async (orderItemData: OrderItem) => {
        try {
            await handleEditOrderItem(orderItemData);
            setIsOrderItemModalOpen(false);
            setSelectedOrderItem(null);
        } catch (err) {
            console.error("Erro no submit do modal de item de pedido:", err);
        }
    };

    const handleSubmitRestaurant = async (restaurantData: Restaurant) => {
        try {
            await handleAddEditRestaurant(restaurantData);
            setIsRestaurantModalOpen(false);
            setSelectedRestaurant(null);
        } catch (err) {
            console.error("Erro no submit do modal de restaurante:", err);
        }
    };


    // --- Lógica de Filtragem Otimizada com useMemo (permanecem aqui) ---
    // Produtos Filtrados
    const filteredProducts = useMemo(() => {
        return data.products.filter(product => { // Usa data.products do hook
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
    }, [data.products, filterProductName, filterProductMinPrice, filterProductMaxPrice, filterProductCategory]);


    const filteredOrders = useMemo(() => {
        return data.orders.filter(order => { // Usa data.orders do hook
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
    }, [data.orders, filterOrderId, filterOrderStatus, filterOrderMinTotal, filterOrderMaxTotal, filterOrderConsumptionMethod]);

    // Usuários Filtrados
    const filteredUsers = useMemo(() => {
        return data.users.filter(user => { // Usa data.users do hook
            const matchesName = !filterUserName || user.name?.toLowerCase().includes(filterUserName.toLowerCase());
            const matchesEmail = !filterUserEmail || user.email?.toLowerCase().includes(filterUserEmail.toLowerCase());
            const matchesRole = !filterUserRole || user.role === filterUserRole;
            return matchesName && matchesEmail && matchesRole;
        });
    }, [data.users, filterUserName, filterUserEmail, filterUserRole]);

    // Pagamentos Filtrados
    const filteredPayments = useMemo(() => {
        return data.payments.filter(payment => { // Usa data.payments do hook
            const matchesId = !filterPaymentId || payment.id?.toString().includes(filterPaymentId);
            const matchesStatus = !filterPaymentStatus || payment.status === filterPaymentStatus;
            const matchesMethod = !filterPaymentMethod || payment.paymentMethod === filterPaymentMethod;
            return matchesId && matchesStatus && matchesMethod;
        });
    }, [data.payments, filterPaymentId, filterPaymentStatus, filterPaymentMethod]);

    // Itens de Pedido Filtrados
    const filteredOrderItems = useMemo(() => {
        return data.orderItems.filter(item => { // Usa data.orderItems do hook
            const matchesId = !filterOrderItemId || item.id?.toString().includes(filterOrderItemId);
            const matchesOrderId = !filterOrderItemOrderId || item.orderId?.toString().includes(filterOrderItemOrderId);
            const matchesStatus = !filterOrderItemStatus || item.status === filterOrderItemStatus;
            return matchesId && matchesOrderId && matchesStatus;
        });
    }, [data.orderItems, filterOrderItemId, filterOrderItemOrderId, filterOrderItemStatus]);

    // Restaurantes Filtrados
    const filteredRestaurants = useMemo(() => {
        return data.restaurants.filter(restaurant => { // Usa data.restaurants do hook
            const matchesName = !filterRestaurantName || restaurant.name?.toLowerCase().includes(filterRestaurantName.toLowerCase());
            const matchesEmail = !filterRestaurantEmail || restaurant.email?.toLowerCase().includes(filterRestaurantEmail.toLowerCase());
            return matchesName && matchesEmail;
        });
    }, [data.restaurants, filterRestaurantName, filterRestaurantEmail]);


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
                            {data.menuCategories.map(cat => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                        </select>
                    </div>
                </div>

                {loadingError.product.loading && (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
                        <p className="ml-4 text-green-600">Carregando produtos...</p>
                    </div>
                )}
                {loadingError.product.error && <p className="text-red-600 text-center py-4">{loadingError.product.error}</p>}

                {!loadingError.product.loading && !loadingError.product.error && (
                    filteredProducts.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white rounded-lg overflow-hidden border border-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">ID</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Nome</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Preço</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Estoque</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Categoria ID</th>
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
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">{product.menuCategoryId}</td>
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

                {loadingError.order.loading && (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
                        <p className="ml-4 text-orange-600">Carregando pedidos...</p>
                    </div>
                )}
                {loadingError.order.error && <p className="text-red-600 text-center py-4">{loadingError.order.error}</p>}

                {!loadingError.order.loading && !loadingError.order.error && (
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
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Método Consumo</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-200">
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">{order.id}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">{order.userId || 'N/A'}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">R$ {(order.total ? order.total.toFixed(2) : '0.00')}</td>
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

                {loadingError.user.loading && (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
                        <p className="ml-4 text-purple-600">Carregando usuários...</p>
                    </div>
                )}
                {loadingError.user.error && <p className="text-red-600 text-center py-4">{loadingError.user.error}</p>}

                {!loadingError.user.loading && !loadingError.user.error && (
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

                {loadingError.payment.loading && (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                        <p className="ml-4 text-blue-600">Carregando pagamentos...</p>
                    </div>
                )}
                {loadingError.payment.error && <p className="text-red-600 text-center py-4">{loadingError.payment.error}</p>}

                {!loadingError.payment.loading && !loadingError.payment.error && (
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

                {loadingError.orderItem.loading && (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-500"></div>
                        <p className="ml-4 text-teal-600">Carregando itens de pedido...</p>
                    </div>
                )}
                {loadingError.orderItem.error && <p className="text-red-600 text-center py-4">{loadingError.orderItem.error}</p>}

                {!loadingError.orderItem.loading && !loadingError.orderItem.error && (
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

                {loadingError.restaurant.loading && (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
                        <p className="ml-4 text-indigo-600">Carregando restaurantes...</p>
                    </div>
                )}
                {loadingError.restaurant.error && <p className="text-red-600 text-center py-4">{loadingError.restaurant.error}</p>}

                {!loadingError.restaurant.loading && !loadingError.restaurant.error && (
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
                onClose={() => { setIsProductModalOpen(false); }}
                onSubmit={handleSubmitProduct}
                product={selectedProduct}
                isLoading={loadingError.product.loading}
                error={loadingError.product.error}
                menuCategories={data.menuCategories}
            />

            <OrderModal
                isOpen={isOrderModalOpen}
                onClose={() => { setIsOrderModalOpen(false); }}
                onSubmit={handleSubmitOrder}
                order={selectedOrder}
                isLoading={loadingError.order.loading}
                error={loadingError.order.error}
            />

            <UserModal
                isOpen={isUserModalOpen}
                onClose={() => { setIsUserModalOpen(false); }}
                onSubmit={handleSubmitUser}
                user={selectedUser}
                isLoading={loadingError.user.loading}
                error={loadingError.user.error}
            />

            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => { setIsPaymentModalOpen(false); }}
                onSubmit={handleSubmitPayment}
                payment={selectedPayment}
                isLoading={loadingError.payment.loading}
                error={loadingError.payment.error}
            />

            <OrderItemModal
                isOpen={isOrderItemModalOpen}
                onClose={() => { setIsOrderItemModalOpen(false); }}
                onSubmit={handleSubmitOrderItem}
                orderItem={selectedOrderItem}
                isLoading={loadingError.orderItem.loading}
                error={loadingError.orderItem.error}
            />

            <RestaurantModal
                isOpen={isRestaurantModalOpen}
                onClose={() => { setIsRestaurantModalOpen(false); }}
                onSubmit={handleSubmitRestaurant}
                restaurant={selectedRestaurant}
                isLoading={loadingError.restaurant.loading}
                error={loadingError.restaurant.error}
            />
        </div>
    );
};

export default AdminDashboard;