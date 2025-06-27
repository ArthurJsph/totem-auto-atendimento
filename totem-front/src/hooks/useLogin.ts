// src/hooks/useLogin.ts ou onde seu useLogin estiver
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth"; 

interface UseLoginReturn {
    email: string;
    setEmail: (email: string) => void;
    senha: string;
    setSenha: (senha: string) => void;
    lembrar: boolean;
    setLembrar: (lembrar: boolean) => void;
    showPassword: boolean;
    setShowPassword: (show: boolean) => void;
    error: string;
    isLoading: boolean;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function useLogin(): UseLoginReturn {
    const navigate = useNavigate();
    const { login, isLoading, isAuthenticated, authorities } = useAuth(); 

    const [email, setEmail] = useState<string>("");
    const [senha, setSenha] = useState<string>("");
    const [lembrar, setLembrar] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const getDashboardPath = useCallback((userAuthorities: string[]): string => {
        if (userAuthorities.includes('ADMIN')) {
            return "/admin";
        }
        if (userAuthorities.includes('MANAGER')) {
            return "/manager";
        }
        return "/"; 
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            const path = getDashboardPath(authorities);
            navigate(path);
            return;
        }

        
        const originalOverflow = document.body.style.overflow;
        const originalHeight = document.body.style.height;
        document.body.style.overflow = "hidden";
        document.body.style.height = "100vh";

        return () => {
            document.body.style.overflow = originalOverflow;
            document.body.style.height = originalHeight;
        };
    }, [isAuthenticated, navigate, authorities, getDashboardPath]); 

    const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(""); 

        try {
            if (!email || !senha) {
                setError("Por favor, preencha todos os campos.");
                return;
            }

            const result = await login(email, senha); 
            
            if (result.success) {
                if (lembrar) {
                    localStorage.setItem("rememberedEmail", email);
                } else {
                    localStorage.removeItem("rememberedEmail");
                }

                const path = getDashboardPath(authorities); 
                navigate(path); 
            } 

        } catch (err: unknown) {
            interface ErrorResponse {
                response?: {
                    data?: {
                        message?: string;
                    };
                };
            }
            const typedErr = err as ErrorResponse;
            let errorMessage = "Erro ao fazer login. Verifique suas credenciais.";

            if (
                typedErr &&
                typeof typedErr === "object" &&
                typedErr.response &&
                typeof typedErr.response === "object" &&
                typedErr.response.data &&
                typeof typedErr.response.data === "object" &&
                "message" in typedErr.response.data
            ) {
                errorMessage = typedErr.response.data.message || errorMessage;
            }
            setError(errorMessage);
            console.error("Erro de login (useLogin):", err);
        }
    }, [email, senha, lembrar, login, navigate, authorities, getDashboardPath]); 

    return {
        email,
        setEmail,
        senha,
        setSenha,
        lembrar,
        setLembrar,
        showPassword,
        setShowPassword,
        error,
        isLoading,
        handleSubmit,
    };
}