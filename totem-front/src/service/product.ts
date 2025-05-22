import { api}  from './api';
import { Product } from './interfaces';


export async function getAllProducts() {
    try {
        const response = await api.get('/products/list');
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}

export async function getProductById(id: string | number) {
    try {
        const response = await api.get(`/products/list/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching product:', error);
        throw error;
    }
}


export async function SaveProduct(product: Product) {
    try {
        const response = await api.post('/products/save', product);
        return response.data;
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
}

export async function UpdateProduct(product: Product) {
    try {
        const response = await api.put(`/products/update/${product.id}`, product);
        return response.data;
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
}

export async function DeleteProduct(id: string | number) {
    try {
        const response = await api.delete(`/products/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
}