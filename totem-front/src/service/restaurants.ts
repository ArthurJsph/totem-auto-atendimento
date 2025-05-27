import { api } from "./api";
import { Restaurant } from "./interfaces";

export const getRestaurants = async () => {
  try {
    const response = await api.get("/restaurants/list");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar restaurantes:", error);
    throw error;
  }
};

export const getRestaurantById = async (id: string) => {
  try {
    const response = await api.get(`/restaurants/list/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar restaurantes com id ${id}:`, error);
    throw error;
  }
};

export const saveRestaurant = async (restaurantData: Restaurant) => {
  try {
    const response = await api.post("/restaurants/save", restaurantData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar restaurante:", error);
    throw error;
  }
};

export const updateRestaurant = async (id: string, restaurantData: Restaurant) => {
  try {
    const response = await api.put(`/restaurants/update/${id}`, restaurantData);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar restaurante com id ${id}:`, error);
    throw error;
  }
};

export const deleteRestaurant = async (id: string) => {
  try {
    const response = await api.delete(`/restaurants/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao deletar restaurante com id ${id}:`, error);
    throw error;
  }
};