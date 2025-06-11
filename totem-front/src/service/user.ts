import { api } from "./api";
import { User } from "./interfaces";


export async function getAllUsers(): Promise<User[]> {
    try {
        const response = await api.get("/users/list");
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        throw error;
    }
}

export async function getUserById(id: string | number): Promise<User> {
    try {
        const response = await api.get(`/users/list/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar usuário com id ${id}:`, error);
        throw error;
    }
}

export async function saveUser(user: User): Promise<User> {
    try {
        const response = await api.post("/users/save", user);
        return response.data;
    } catch (error) {
        console.error("Erro ao criar usuário:", error);
        throw error;
    }
}

export async function updateUser(user: User): Promise<User> {
    try {
        const response = await api.put(`/users/update/${user.id}`, user);
        return response.data;
    } catch (error) {
        console.error(`Erro ao atualizar usuário com id ${user.id}:`, error);
        throw error;
    }
}

export async function deleteUser(id: string | number): Promise<void> {
    try {
        await api.delete(`/users/delete/${id}`);
    } catch (error) {
        console.error(`Erro ao deletar usuário com id ${id}:`, error);
        throw error;
    }
}