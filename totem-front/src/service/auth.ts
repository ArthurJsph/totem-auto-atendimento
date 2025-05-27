import { api } from "./api";

export async function login(email: string, password: string) {
  try {
    const response = await api.post("/auth/login", { email, password });
    const token = response.data.token;

    localStorage.setItem("token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    return response.data;
    
  } catch (error) {
    console.error("Erro ao logar:", error);
    throw error;
  }
}

export async function logout() {
  try {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
  } catch (error) {
    console.error("Erro ao deslogar:", error);
    throw error;
  }
}

