import { useState, useEffect, useCallback } from 'react';
import * as authService from '../service/auth';

type UserAuthority = 'ADMIN' | 'MANAGER' | 'CLIENT' | string;

interface AuthHookResult {
    isAuthenticated: boolean;
    isLoading: boolean;
    authorities: UserAuthority[];
    login: (email: string, password: string) => Promise<{ success: boolean; token?: string }>;
    logout: () => void;
    checkAuthStatus: () => void;
}

export const useAuth = (): AuthHookResult => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [authorities, setAuthorities] = useState<UserAuthority[]>([]);

    const checkAuthStatus = useCallback(() => {
        const authenticated = authService.isAuthenticated();
        setIsAuthenticated(authenticated);
        if (authenticated) {
            setAuthorities(authService.getUserRoles());
        } else {
            setAuthorities([]);
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        checkAuthStatus();
    }, [checkAuthStatus]);

    const login = useCallback(async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await authService.login(email, password); 
            const token = response.token;

            setIsAuthenticated(true);
            setAuthorities(authService.getUserRoles());
            return { success: true, token };
        } catch (error) {
            setIsAuthenticated(false);
            setAuthorities([]);
            console.error('Falha no login (useAuth):', error);
            authService.logout();
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []); 

    const logout = useCallback(() => {
        authService.logout();
        setIsAuthenticated(false);
        setAuthorities([]);
    }, []);

    return {
        isAuthenticated,
        isLoading,
        authorities,
        login,
        logout,
        checkAuthStatus,
    };
};
