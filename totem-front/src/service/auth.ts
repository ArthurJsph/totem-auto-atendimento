import { api } from "./api";
import { User } from "./interfaces";
import { jwtDecode } from 'jwt-decode';

type LoginResponse = {
    token: string;
    userOutputDTO: User; 
};

type JwtPayload = {
    sub: string;
    authorities: string[];
    exp: number;
    iat: number;
};

type UserAuthority = 'ADMIN' | 'MANAGER' | 'CLIENT' | string; 

export async function login(email: string, password: string): Promise<{ token: string; user: User }> {
    try {
        const response = await api.post<LoginResponse>("/auth/login", { email, password });
        const { token, userOutputDTO } = response.data; 

        if (token) {
            localStorage.setItem("token", token);
        }
        if (userOutputDTO) {
            localStorage.setItem("user", JSON.stringify(userOutputDTO));
        }

        return { token, user: userOutputDTO }; 
    } catch (error) {
        console.error("Erro ao logar:", error);
        throw error;
    }
}

export function getLoggedUser(): User | null {
    const userJson = localStorage.getItem("user");
    if (!userJson) return null;
    try {
        return JSON.parse(userJson);
    } catch (e) {
        console.error("Erro ao parsear dados do usuário do localStorage:", e);
        localStorage.removeItem("user");
        return null;
    }
}

export async function logout(): Promise<void> {
    try {
        localStorage.removeItem("token");
        localStorage.removeItem("user"); 
        if (api.defaults.headers.common["Authorization"]) {
            delete api.defaults.headers.common["Authorization"];
        }
    } catch (error) {
        console.error("Erro ao deslogar:", error);
        throw error;
    }
}



export async function register(data: User): Promise<User> { 
    try {
        const response = await api.post<User>("/users/save", data);
        return response.data;
    } catch (error) {
        console.error("Erro ao registrar:", error);
        throw error;
    }
}

export function getToken(): string | null {
    return localStorage.getItem("token");
}

export function getUserRoles(): UserAuthority[] {
    const token = getToken();
    if (!token) return [];

    try {
        const decoded = jwtDecode<JwtPayload>(token);
        return decoded.authorities ?? [];
    } catch (e) {
        console.error("Erro ao decodificar JWT para roles:", e);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return [];
    }
}

export function getMainRole(): "ADMIN" | "MANAGER" | "CLIENT" | null {
    const roles = getUserRoles().map(role => role.toUpperCase());

    if (roles.includes("ADMIN")) return "ADMIN";
    if (roles.includes("MANAGER")) return "MANAGER";
    if (roles.includes("USER")) return "CLIENT"; 
    return null;
}

export function isTokenExpired(): boolean {
    const token = getToken();
    if (!token) return true;

    try {
        const decoded = jwtDecode<JwtPayload>(token);
        const now = Date.now() / 1000;
        return decoded.exp < now;
    } catch (e) {
        console.error("Erro ao verificar expiração do token:", e);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return true;
    }
}

export function isUserAdminOrManager(): boolean {
    const roles = getUserRoles();
    return roles.some(role => role.toUpperCase() === "ADMIN" || role.toUpperCase() === "MANAGER");
}

export function isAuthenticated(): boolean {
    const token = getToken();
    const user = getLoggedUser();
    return !!token && !!user && !isTokenExpired();
}

export async function ForgotPassword(email: string): Promise<void> {
    return api.post("/users/forgot-password", { email })
        .then(() => {
            console.log(`Email de recuperação enviado para: ${email}`);
        })
        .catch(error => {
            console.error("Erro ao enviar email de recuperação:", error);
            throw error;
        });
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
    try {
        await api.post("/users/reset-password", { token, newPassword });
        console.log("Senha redefinida com sucesso!");
    } catch (error) {
        console.error("Erro ao redefinir senha:", error);
        throw error;
    }
}

