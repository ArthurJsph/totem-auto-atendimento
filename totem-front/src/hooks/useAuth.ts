import { useState, useEffect, useCallback } from 'react';
import * as authService from '../service/auth'; // Ensure this path is correct

type UserAuthority = 'ADMIN' | 'MANAGER' | 'CLIENT' | string;

interface AuthHookResult {
    isAuthenticated: boolean;
    isLoading: boolean;
    authorities: UserAuthority[];
    login: (email: string, password: string) => Promise<{ success: boolean; token?: string }>;
    logout: () => void;
    checkAuthStatus: () => void; // Keeping this for explicit checks if needed
}

export const useAuth = (): AuthHookResult => {
    // Initialize state directly from authService functions using a function for useState
    // This ensures these values are only calculated once on the initial render
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => authService.isAuthenticated());
    const [authorities, setAuthorities] = useState<UserAuthority[]>(() => authService.getUserRoles());
    const [isLoading, setIsLoading] = useState<boolean>(false); // Start as false, as initial check is done

    // This callback is now primarily for external triggers (like storage events)
    // or when you explicitly need to re-evaluate the auth status.
    const checkAuthStatus = useCallback(() => {
        setIsLoading(true); // Indicate that status check is in progress
        const authenticated = authService.isAuthenticated();
        setIsAuthenticated(authenticated);
        if (authenticated) {
            setAuthorities(authService.getUserRoles());
        } else {
            setAuthorities([]);
            // Optionally, if the token is invalid/expired and still present, remove it
            if (authService.getToken()) { // Only try to logout if a token exists
                authService.logout();
            }
        }
        setIsLoading(false); // Done checking
    }, []); // No dependencies needed for this callback, it reads directly from authService

    // Effect to handle initial load and storage events
    useEffect(() => {
        // Initial check is handled by useState initializer.
        // We only need this useEffect for reactivity to external changes (localStorage).

        const handleStorageChange = (event: StorageEvent) => {
            // Check if 'token' key changed or if it's a general storage event (key is null)
            if (event.key === 'token' || event.key === null) {
                checkAuthStatus(); // Re-evaluate auth status
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // Cleanup function for the event listener
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [checkAuthStatus]); // 'checkAuthStatus' is stable due to useCallback

    const login = useCallback(async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await authService.login(email, password); 
            const token = response.token;

            // After successful login, explicitly update the state based on new token
            setIsAuthenticated(true);
            setAuthorities(authService.getUserRoles()); // Roles should now be available from the new token
            return { success: true, token };
        } catch (error) {
            setIsAuthenticated(false);
            setAuthorities([]);
            console.error('Login failed (useAuth):', error);
            authService.logout(); // Ensure token is cleared on login failure
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []); // No dependencies needed for login, as it uses parameters and stable authService functions

    const logout = useCallback(() => {
        authService.logout();
        setIsAuthenticated(false);
        setAuthorities([]);
    }, []); // No dependencies needed for logout

    return {
        isAuthenticated,
        isLoading,
        authorities,
        login,
        logout,
        checkAuthStatus,
    };
};