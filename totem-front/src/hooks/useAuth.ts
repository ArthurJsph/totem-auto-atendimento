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
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(authService.isAuthenticated());
    const [authorities, setAuthorities] = useState<UserAuthority[]>(authService.getUserRoles());
    const [user, setUser] = useState<User | null>(authService.getLoggedUser());
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const checkAuthStatus = useCallback(() => {

        const newAuthenticated = authService.isAuthenticated();
        const newRoles = authService.getUserRoles();
        const newUser = authService.getLoggedUser();

        setIsAuthenticated(prev => {
            if (prev !== newAuthenticated) {
                return newAuthenticated;
            }
            return prev; 
        });

        setAuthorities(prev => {
            if (JSON.stringify(prev) !== JSON.stringify(newRoles)) {
                return newRoles;
            }
            return prev; 
        });

        setUser(prev => {
            if (prev?.id !== newUser?.id || prev?.email !== newUser?.email) {
                return newUser;
            }
            return prev; 
        });
    }, []); 

    useEffect(() => {
        checkAuthStatus();

        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === 'token' || event.key === 'user' || event.key === 'roles' || event.key === null) {
                checkAuthStatus();
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
            checkAuthStatus();

            return { success: true, token: response.token };
        } catch (error) {
            setIsAuthenticated(false);
            setAuthorities([]);
            setUser(null);
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