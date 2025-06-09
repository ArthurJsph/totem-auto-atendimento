import { api } from "./api";
import { MenuCategory } from "./interfaces";

export async function getAllMenus() {
    try {
        const response = await api.get('/menu-categories/list');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar menus:', error);
        throw error;
    }
}

export async function getMenuById(id: number) {
    try {
        const response = await api.get(`/menu-categories/list/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar menu com id ${id}:`, error);
        throw error;
    }
}

export async function saveMenu(menu: MenuCategory) {
    try {
        const response = await api.post('/menu-categories/save', menu);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar menu:', error);
        throw error;
    }
}

export async function updateMenu(menu: MenuCategory) {
    try {
        const response = await api.put(`/menu-categories/update/${menu.id}`, menu);
        return response.data;
    } catch (error) {
        console.error(`Erro ao atualizar menu com id ${menu.id}:`, error);
        throw error;
    }
}

export async function deleteMenu(id: number) {
    try {
        const response = await api.delete(`/menu-categories/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao deletar menu com id ${id}:`, error);
        throw error;
    }
}