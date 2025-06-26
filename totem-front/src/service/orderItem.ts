import { api } from "./api";
import { OrderItem } from "./interfaces";

export async function getAllOrderItems() {
    try {
        const response = await api.get('/order-items/list');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar itens de pedido:', error);
        throw error;
    }
}

export async function getOrderItemById(id: string | number) {
    try {
        const response = await api.get(`/order-items/list/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar item de pedido com id ${id}:`, error);
        throw error;
    }
}

export async function saveOrderItem(orderItem: OrderItem) {
    try {
        const response = await api.post('/order-items/save', orderItem);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar item de pedido:', error);
        throw error;
    }
}

export async function updateOrderItem(orderItem: OrderItem) {
    try {
        const response = await api.put(`/order-items/update/${orderItem.id}`, orderItem);
        return response.data;
    } catch (error) {
        console.error(`Erro ao atualizar item de pedido com id ${orderItem.id}:`, error);
        throw error;
    }
}

export async function deleteOrderItem(id: string | number) {
    try {
        const response = await api.delete(`/order-items/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao deletar item de pedido com id ${id}:`, error);
        throw error;
    }
}