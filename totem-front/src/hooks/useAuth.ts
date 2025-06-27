import { useState, useEffect, useCallback } from 'react';
import * as authService from '../service/auth'; 
import { User } from '../service/interfaces';
type UserAuthority = 'ADMIN' | 'MANAGER' | 'CLIENT' | string;

interface AuthHookResult {
    isAuthenticated: boolean;
    isLoading: boolean;
    authorities: UserAuthority[];
    user: User | null; 
    login: (email: string, password: string) => Promise<{ success: boolean; token?: string }>;
    logout: () => void; 
    checkAuthStatus: () => void; 
}

export const useAuth = (): AuthHookResult => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => authService.isAuthenticated());
    const [authorities, setAuthorities] = useState<UserAuthority[]>(() => authService.getUserRoles());
    const [user, setUser] = useState<User | null>(() => authService.getLoggedUser()); 
    const [isLoading, setIsLoading] = useState<boolean>(false); 

    
    const checkAuthStatus = useCallback(() => {
        setIsLoading(true);
        const authenticated = authService.isAuthenticated();
        setIsAuthenticated(authenticated);

        if (authenticated) {
            setAuthorities(authService.getUserRoles());
            setUser(authService.getLoggedUser()); 
        } else {
            setAuthorities([]);
            setUser(null); 
        }
        setIsLoading(false);
    }, []); 
    useEffect(() => {
        checkAuthStatus(); 

        const handleStorageChange = (event: StorageEvent) => {
            // Reage a mudanças nas chaves 'token' ou 'user'
            if (event.key === 'token' || event.key === 'user' || event.key === null) {
                checkAuthStatus(); // Re-avalia o status de autenticação
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [checkAuthStatus]);

    const login = useCallback(async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await authService.login(email, password);
            return { success: true, token: response.token };
        } catch (error) {
            setIsAuthenticated(false);
            setAuthorities([]);
            setUser(null);
            console.error('Login failed (useAuth):', error);
            throw error; 
        } finally {
            setIsLoading(false);
        }
    }, [checkAuthStatus]); 

    
    const logout = useCallback(() => {
        authService.logout(); 
        setIsAuthenticated(false);
        setAuthorities([]);
        setUser(null); 
    }, []); 

    return {
        isAuthenticated,
        isLoading,
        authorities,
        user, 
        login,
        logout, 
        checkAuthStatus,
    };
};