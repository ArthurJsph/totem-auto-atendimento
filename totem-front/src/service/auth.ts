import { api } from "./api";
import { User } from "./interfaces";
import {jwtDecode} from 'jwt-decode';


export async function login(email: string, password: string) {
  try {
    const response = await api.post("/auth/login", { email, password });
    const token = response.data.token; 

    if (token) {
      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    return response.data;

  } catch (error) {
    console.error("Erro ao logar:", error);
    throw error;
  }
}

export async function register(data: User) {
  try {
    const response = await api.post("/users/save", data);
    return response.data; // ou conforme resposta da sua API
  } catch (error) {
    console.error("Erro ao registrar:", error);
    throw error;
  }
}



type JwtPayload = {
  sub: string;
  authorities: string[]; // vem assim no seu JWT
  exp: number;
};

export function getToken(): string | null {
  return localStorage.getItem("token");
}

export function getUserRoles(): string[] {
  const token = getToken();
  if (!token) return [];

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.authorities ?? [];
  } catch {
    return [];
  }
}


export function getMainRole(): "ADMIN" | "MANAGER" | "CLIENT" | null {
  const roles = getUserRoles().map(role => role.toUpperCase());

  if (roles.includes("ADMIN")) return "ADMIN";
  if (roles.includes("MANAGER")) return "MANAGER";
  if (roles.includes("CLIENT")) return "CLIENT";
  return null;
}

export function isTokenExpired(): boolean {
  const token = getToken();
  if (!token) return true;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const now = Date.now() / 1000;
    return decoded.exp < now;
  } catch {
    return true;
  }
}


export function isUserAdminOrManager(): boolean {
  const roles = getUserRoles();
  return roles.includes("ADMIN") || roles.includes("MANAGER");
}




export async function logout() {
  try {
    // Remove o token do localStorage
    localStorage.removeItem("token");

    // Remove o header Authorization do axios para evitar envio de token inválido
    if (api.defaults.headers.common["Authorization"]) {
      delete api.defaults.headers.common["Authorization"];
    }
    
    // Aqui pode redirecionar ou emitir algum evento global se necessário
    // Exemplo (se usar react-router): navigate("/login")

  } catch (error) {
    console.error("Erro ao deslogar:", error);
    throw error;
  }
}

