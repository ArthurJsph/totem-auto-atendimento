import { api } from "./api";
import { Payment } from "./interfaces";

export async function getAllPayments() {
    try {
        const response = await api.get('/payments/list');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar pagamentos:', error);
        throw error;
    }
}

export async function getPaymentById(id: number) {
    try {
        const response = await api.get(`/payments/list/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar pagamento com id ${id}:`, error);
        throw error;
    }
}

export async function savePayment(payment: Payment) { 
    try {
        const response = await api.post('/payments/save', payment);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar pagamento:', error);
        throw error;
    }
}

export async function updatePayment(payment: Payment) { 
    try {
        const response = await api.put(`/payments/update/${payment.id}`, payment);
        return response.data;
    } catch (error) {
        console.error(`Erro ao atualizar pagamento com id ${payment.id}:`, error);
        throw error;
    }
}

export async function deletePayment(id: number) {
    try {
        const response = await api.delete(`/payments/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao deletar pagamento com id ${id}:`, error);
        throw error;
    }
}
