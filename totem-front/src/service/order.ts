import { api } from "./api";
import { Order } from "./interfaces";

export async function getAllOrders() {
    try {
        const response = await api.get('/orders/list');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
        throw error;
    }
}

export async function getOrderById(id: string | number) {
    try {
        const response = await api.get(`/orders/list/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar pedido com id ${id}:`, error);
        throw error;
    }
}

export async function saveOrder(order: Order) {
    try {
        const response = await api.post('/orders/save', order);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar pedido:', error);
        throw error;
    }
}

export async function updateOrder(order: Order) {
    try {
        const response = await api.put(`/orders/update/${order.id}`, order);
        return response.data;
    } catch (error) {
        console.error(`Erro ao atualizar pedido com id ${order.id}:`, error);
        throw error;
    }
}

export async function deleteOrder(id: string | number) {
    try {
        const response = await api.delete(`/orders/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao deletar pedido com id ${id}:`, error);
        throw error;
    }
}