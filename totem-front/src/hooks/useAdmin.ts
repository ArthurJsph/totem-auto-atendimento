// src/hooks/useAdmin.ts
import { useState, useEffect, useCallback } from 'react';
import {
    Product, Order, User, Payment, OrderItem, Restaurant, MenuCategory
} from '../service/interfaces'; 
import {
    getAllProducts, saveProduct, updateProduct, deleteProduct
} from '../service/product';
import {
    getAllOrders, updateOrder, deleteOrder
} from '../service/order';
import {
    getAllUsers, updateUser, deleteUser
} from '../service/user';
import {
    getAllPayments, updatePayment, deletePayment
} from '../service/payment';
import {
    getAllOrderItems, updateOrderItem, deleteOrderItem
} from '../service/orderItem';
import {
    getRestaurants, saveRestaurant, updateRestaurant, deleteRestaurant
} from '../service/restaurants';
import { getAllMenus } from '../service/menu';

// Função auxiliar para extrair mensagem de erro
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
        return (error as { response: { data: { message: string } } }).response.data.message;
    }
    if (typeof error === 'string') {
        return error;
    }
    return 'Ocorreu um erro desconhecido.';
};

interface AdminDataState {
    products: Product[];
    orders: Order[];
    users: User[];
    payments: Payment[];
    orderItems: OrderItem[];
    restaurants: Restaurant[];
    menuCategories: MenuCategory[];
}

interface AdminLoadingErrorState {
    product: { loading: boolean; error: string | null; };
    order: { loading: boolean; error: string | null; };
    user: { loading: boolean; error: string | null; };
    payment: { loading: boolean; error: string | null; };
    orderItem: { loading: boolean; error: string | null; };
    restaurant: { loading: boolean; error: string | null; };
}

export const useAdmin = () => {
    const [data, setData] = useState<AdminDataState>({
        products: [],
        orders: [],
        users: [],
        payments: [],
        orderItems: [],
        restaurants: [],
        menuCategories: []
    });

    const [loadingError, setLoadingError] = useState<AdminLoadingErrorState>({
        product: { loading: false, error: null },
        order: { loading: false, error: null },
        user: { loading: false, error: null },
        payment: { loading: false, error: null },
        orderItem: { loading: false, error: null },
        restaurant: { loading: false, error: null }
    });

    const setLoading = useCallback((key: keyof AdminLoadingErrorState, isLoading: boolean, errorMessage: string | null = null) => {
        setLoadingError(prev => ({
            ...prev,
            [key]: { loading: isLoading, error: errorMessage }
        }));
    }, []);

    // --- Fetch Functions ---
    const fetchMenuCategories = useCallback(async () => {
        setLoading('product', true); // Pode usar 'product' ou criar um para categorias
        try {
            const data = await getAllMenus();
            setData(prev => ({ ...prev, menuCategories: data }));
            setLoading('product', false);
        } catch (err: unknown) {
            console.error("Falha ao buscar categorias de menu:", err);
            setLoading('product', false, `Não foi possível carregar as categorias: ${getErrorMessage(err)}`);
        }
    }, [setLoading]);

    const fetchProducts = useCallback(async () => {
        setLoading('product', true);
        try {
            const data = await getAllProducts();
            setData(prev => ({ ...prev, products: data }));
            setLoading('product', false);
        } catch (err: unknown) {
            console.error("Falha ao buscar produtos:", err);
            setLoading('product', false, `Não foi possível carregar os produtos: ${getErrorMessage(err)}`);
        }
    }, [setLoading]);

    const fetchOrders = useCallback(async () => {
        setLoading('order', true);
        try {
            const data = await getAllOrders();
            setData(prev => ({ ...prev, orders: data }));
            setLoading('order', false);
        } catch (err: unknown) {
            console.error("Falha ao buscar pedidos:", err);
            setLoading('order', false, `Não foi possível carregar os pedidos: ${getErrorMessage(err)}`);
        }
    }, [setLoading]);

    const fetchUsers = useCallback(async () => {
        setLoading('user', true);
        try {
            const data = await getAllUsers();
            setData(prev => ({ ...prev, users: data }));
            setLoading('user', false);
        } catch (err: unknown) {
            console.error("Falha ao buscar usuários:", err);
            setLoading('user', false, `Não foi possível carregar os usuários: ${getErrorMessage(err)}`);
        }
    }, [setLoading]);

    const fetchPayments = useCallback(async () => {
        setLoading('payment', true);
        try {
            const data = await getAllPayments();
            setData(prev => ({ ...prev, payments: data }));
            setLoading('payment', false);
        } catch (err: unknown) {
            console.error("Falha ao buscar pagamentos:", err);
            setLoading('payment', false, `Não foi possível carregar os pagamentos: ${getErrorMessage(err)}`);
        }
    }, [setLoading]);

    const fetchOrderItems = useCallback(async () => {
        setLoading('orderItem', true);
        try {
            const data = await getAllOrderItems();
            setData(prev => ({ ...prev, orderItems: data }));
            setLoading('orderItem', false);
        } catch (err: unknown) {
            console.error("Falha ao buscar itens de pedido:", err);
            setLoading('orderItem', false, `Não foi possível carregar os itens de pedido: ${getErrorMessage(err)}`);
        }
    }, [setLoading]);

    const fetchRestaurants = useCallback(async () => {
        setLoading('restaurant', true);
        try {
            const data = await getRestaurants();
            setData(prev => ({ ...prev, restaurants: data }));
            setLoading('restaurant', false);
        } catch (err: unknown) {
            console.error("Falha ao buscar restaurantes:", err);
            setLoading('restaurant', false, `Não foi possível carregar os restaurantes: ${getErrorMessage(err)}`);
        }
    }, [setLoading]);

    // --- CRUD Handlers (que chamarão as funções de fetch novamente para atualizar o estado) ---

    const handleAddEditProduct = useCallback(async (productData: Product) => {
        setLoading('product', true);
        try {
            if (productData.id) {
                await updateProduct(productData);
            } else {
                await saveProduct({ ...productData, id: undefined } as Omit<Product, 'id'>);
            }
            await fetchProducts(); // Recarrega os produtos
            return Promise.resolve();
        } catch (err: unknown) {
            const msg = `Erro ao salvar produto: ${getErrorMessage(err)}`;
            setLoading('product', false, msg);
            return Promise.reject(new Error(msg));
        }
    }, [fetchProducts, setLoading]);

    const handleDeleteProduct = useCallback(async (productId: string | number) => {
        if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;
        setLoading('product', true);
        try {
            await deleteProduct(productId);
            await fetchProducts();
            return Promise.resolve();
        } catch (err: unknown) {
            const msg = `Erro ao excluir produto: ${getErrorMessage(err)}`;
            setLoading('product', false, msg);
            return Promise.reject(new Error(msg));
        }
    }, [fetchProducts, setLoading]);

    const handleUpdateOrderStatus = useCallback(async (orderId: string | number, newStatus: Order['status']) => {
        setLoading('order', true);
        try {
            const currentOrder = data.orders.find(order => order.id === orderId);
            if (!currentOrder) {
                throw new Error("Pedido não encontrado para atualização de status.");
            }
            const updatedOrderData: Order = { ...currentOrder, status: newStatus };
            await updateOrder(updatedOrderData);
            await fetchOrders();
            return Promise.resolve();
        } catch (err: unknown) {
            const msg = `Erro ao atualizar status do pedido: ${getErrorMessage(err)}`;
            setLoading('order', false, msg);
            return Promise.reject(new Error(msg));
        }
    }, [data.orders, fetchOrders, setLoading]); // Dependência data.orders para find()

    const handleDeleteOrder = useCallback(async (orderId: string | number) => {
        if (!window.confirm("Tem certeza que deseja cancelar/excluir este pedido?")) return;
        setLoading('order', true);
        try {
            await deleteOrder(orderId);
            await fetchOrders();
            return Promise.resolve();
        } catch (err: unknown) {
            const msg = `Erro ao excluir pedido: ${getErrorMessage(err)}`;
            setLoading('order', false, msg);
            return Promise.reject(new Error(msg));
        }
    }, [fetchOrders, setLoading]);

    const handleEditUser = useCallback(async (userData: User) => {
        setLoading('user', true);
        try {
            await updateUser(userData, Number(userData.id));
            await fetchUsers();
            return Promise.resolve();
        } catch (err: unknown) {
            const msg = `Erro ao atualizar usuário: ${getErrorMessage(err)}`;
            setLoading('user', false, msg);
            return Promise.reject(new Error(msg));
        }
    }, [fetchUsers, setLoading]);

    const handleDeleteUser = useCallback(async (userId: string | number) => {
        if (!window.confirm("Tem certeza que deseja excluir este usuário?")) return;
        setLoading('user', true);
        try {
            await deleteUser(userId);
            await fetchUsers();
            return Promise.resolve();
        } catch (err: unknown) {
            const msg = `Erro ao excluir usuário: ${getErrorMessage(err)}`;
            setLoading('user', false, msg);
            return Promise.reject(new Error(msg));
        }
    }, [fetchUsers, setLoading]);

    const handleEditPayment = useCallback(async (paymentData: Payment) => {
        setLoading('payment', true);
        try {
            await updatePayment(paymentData);
            await fetchPayments();
            return Promise.resolve();
        } catch (err: unknown) {
            const msg = `Erro ao atualizar pagamento: ${getErrorMessage(err)}`;
            setLoading('payment', false, msg);
            return Promise.reject(new Error(msg));
        }
    }, [fetchPayments, setLoading]);

    const handleDeletePayment = useCallback(async (paymentId: string | number) => {
        if (!window.confirm("Tem certeza que deseja excluir este pagamento?")) return;
        setLoading('payment', true);
        try {
            await deletePayment(typeof paymentId === 'string' ? parseInt(paymentId, 10) : paymentId);
            await fetchPayments();
            return Promise.resolve();
        } catch (err: unknown) {
            const msg = `Erro ao excluir pagamento: ${getErrorMessage(err)}`;
            setLoading('payment', false, msg);
            return Promise.reject(new Error(msg));
        }
    }, [fetchPayments, setLoading]);

    const handleEditOrderItem = useCallback(async (orderItemData: OrderItem) => {
        setLoading('orderItem', true);
        try {
            await updateOrderItem(orderItemData);
            await fetchOrderItems();
            return Promise.resolve();
        } catch (err: unknown) {
            const msg = `Erro ao atualizar item de pedido: ${getErrorMessage(err)}`;
            setLoading('orderItem', false, msg);
            return Promise.reject(new Error(msg));
        }
    }, [fetchOrderItems, setLoading]);

    const handleDeleteOrderItem = useCallback(async (orderItemId: string | number) => {
        if (!window.confirm("Tem certeza que deseja excluir este item de pedido?")) return;
        setLoading('orderItem', true);
        try {
            await deleteOrderItem(orderItemId);
            await fetchOrderItems();
            return Promise.resolve();
        } catch (err: unknown) {
            const msg = `Erro ao excluir item de pedido: ${getErrorMessage(err)}`;
            setLoading('orderItem', false, msg);
            return Promise.reject(new Error(msg));
        }
    }, [fetchOrderItems, setLoading]);

    const handleAddEditRestaurant = useCallback(async (restaurantData: Restaurant) => {
        setLoading('restaurant', true);
        try {
            if (restaurantData.id) {
                await updateRestaurant(String(restaurantData.id), restaurantData);
            } else {
                await saveRestaurant({ ...restaurantData, id: undefined });
            }
            await fetchRestaurants();
            return Promise.resolve();
        } catch (err: unknown) {
            const msg = `Erro ao salvar restaurante: ${getErrorMessage(err)}`;
            setLoading('restaurant', false, msg);
            return Promise.reject(new Error(msg));
        }
    }, [fetchRestaurants, setLoading]);

    const handleDeleteRestaurant = useCallback(async (restaurantId: string | number) => {
        if (!window.confirm("Tem certeza que deseja excluir este restaurante?")) return;
        setLoading('restaurant', true);
        try {
            await deleteRestaurant(String(restaurantId));
            await fetchRestaurants();
            return Promise.resolve();
        } catch (err: unknown) {
            const msg = `Erro ao excluir restaurante: ${getErrorMessage(err)}`;
            setLoading('restaurant', false, msg);
            return Promise.reject(new Error(msg));
        }
    }, [fetchRestaurants, setLoading]);


    // Initial data fetch on mount
    useEffect(() => {
        fetchProducts();
        fetchOrders();
        fetchUsers();
        fetchPayments();
        fetchOrderItems();
        fetchRestaurants();
        fetchMenuCategories();
    }, [fetchProducts, fetchOrders, fetchUsers, fetchPayments, fetchOrderItems, fetchRestaurants, fetchMenuCategories]);


    return {
        data,
        loadingError,
        fetchProducts,
        handleAddEditProduct,
        handleDeleteProduct,
        fetchOrders,
        handleUpdateOrderStatus,
        handleDeleteOrder,
        fetchUsers,
        handleEditUser,
        handleDeleteUser,
        fetchPayments,
        handleEditPayment,
        handleDeletePayment,
        fetchOrderItems,
        handleEditOrderItem,
        handleDeleteOrderItem,
        fetchRestaurants,
        handleAddEditRestaurant,
        handleDeleteRestaurant,
        // Você pode exportar as funções de fetch para serem chamadas manualmente se precisar
        // Ou deixar que o useEffect cuide disso
    };
};