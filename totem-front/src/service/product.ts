import { api}  from './api';
import { Product } from './interfaces';


export async function getAllProducts() {
    try {
        const response = await api.get('/products/list');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        throw error;
    }
}

export async function getProductById(id: string | number) {
    try {
        const response = await api.get(`/products/list/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar produto com id ${id}:`, error);
        throw error;
    }
}


export async function saveProduct(product: Product) {
    try {
        const response = await api.post('/products/save', product);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar produto:', error);
        throw error;
    }
}

export async function updateProduct(product: Product) {
    try {
        const response = await api.put(`/products/update/${product.id}`, product);
        return response.data;
    } catch (error) {
        console.error(`Erro ao atualizar produto com id ${product.id}:`, error);
        throw error;
    }
}

export async function deleteProduct(id: string | number) {
    try {
        const response = await api.delete(`/products/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao deletar produto com id ${id}:`, error);
        throw error;
    }
}