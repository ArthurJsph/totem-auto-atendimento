import { api } from "./api";
import { Manager } from "./interfaces";
export async function getAllManagers() {
    try {
        const response = await api.get('/managers/list');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar gerentes:', error);
        throw error;
    }
}

export async function getManagerById(id: number) {
    try {
        const response = await api.get(`/managers/list/${id}`);
        return response.data;
    }
    catch (error) {
        console.error(`Erro ao buscar gerente com id ${id}:`, error);
        throw error;
    }
}
export async function saveManager(manager: Manager) { 
    try {
        const response = await api.post('/managers/save', manager);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar gerente:', error);
        throw error;
    }
}

export async function updateManager(manager: Manager) { 
    try {
        const response = await api.put(`/managers/update/${manager.id}`, manager);
        return response.data;
    } catch (error) {
        console.error(`Erro ao atualizar gerente com id ${manager.id}:`, error);
        throw error;
    }
}

export async function deleteManager(id: number) {
    try {
        const response = await api.delete(`/managers/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao deletar gerente com id ${id}:`, error);
        throw error;
    }
}