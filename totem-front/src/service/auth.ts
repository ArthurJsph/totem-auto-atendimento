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

// Defina uma chave para as roles no localStorage
const ROLES_KEY = 'roles'; // Nova constante

export async function login(email: string, password: string): Promise<{ token: string; user: User }> {
    try {
        const response = await api.post<LoginResponse>("/auth/login", { email, password });
        const { token, userOutputDTO } = response.data;

        if (token) {
            localStorage.setItem("token", token);
            // Decodificar e salvar as roles imediatamente
            try {
                const decoded = jwtDecode<JwtPayload>(token);
                localStorage.setItem(ROLES_KEY, JSON.stringify(decoded.authorities ?? []));
            } catch (e) {
                console.error("Erro ao decodificar JWT para roles no login:", e);
               
            }
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
        localStorage.removeItem(ROLES_KEY); // Remover as roles também no logout
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
    // Agora lê as roles diretamente do localStorage
    const rolesStr = localStorage.getItem(ROLES_KEY);
    if (!rolesStr) return [];
    try {
        return JSON.parse(rolesStr);
    } catch (e) {
        console.error("Erro ao parsear roles do localStorage:", e);
        localStorage.removeItem(ROLES_KEY);
        // Não remova token/user aqui, pois o token pode ser válido mas as roles corrompidas.
        // A lógica de isTokenExpired e isAuthenticated já lidam com a limpeza geral.
        return [];
    }
}

export function getMainRole(): "ADMIN" | "MANAGER" | "CLIENT" | null {
    const roles = getUserRoles().map(role => role.toUpperCase());

    if (roles.includes("ADMIN")) return "ADMIN";
    if (roles.includes("MANAGER")) return "MANAGER";
    if (roles.includes("CLIENT")) return "CLIENT"; // Consistente com seu `getDashboardPath`
    return null;
}

export function isTokenExpired(): boolean {
    const token = getToken();
    if (!token) return true;

    try {
        const decoded = jwtDecode<JwtPayload>(token);
        const now = Date.now() / 1000; // Tempo atual em segundos desde a época
        return decoded.exp < now;
    } catch (e) {
        console.error("Erro ao verificar expiração do token:", e);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem(ROLES_KEY); // Limpa tudo se o token for inválido
        return true;
    }
}

export function isAuthenticated(): boolean {
    const token = getToken();
    const user = getLoggedUser();
    // Verificamos o token E o user, e se o token não está expirado.
    // Isso garante um estado de autenticação mais robusto.
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