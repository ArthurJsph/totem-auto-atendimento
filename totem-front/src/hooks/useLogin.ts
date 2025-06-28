import { useState, useEffect, useCallback, useRef } from "react";
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
    const hasNavigated = useRef(false);

    const getDashboardPath = useCallback((userAuthorities: string[]): string => {
        if (userAuthorities.includes('ADMIN')) {
            return "/admin";
        }
        if (userAuthorities.includes('MANAGER')) {
            return "/manager";
        }

        return "/home"; 
    }, []);

    useEffect(() => {
    
        if (isAuthenticated && !hasNavigated.current) {
            const path = getDashboardPath(authorities);
          
            navigate(path);
            hasNavigated.current = true; 
        } else if (!isAuthenticated && hasNavigated.current) {
           
            hasNavigated.current = false;
        }

       
        document.body.style.overflow = "hidden";
        document.body.style.height = "100vh";

        return () => {
            document.body.style.overflow = "";
            document.body.style.height = ""; 
        };
    }, [isAuthenticated, navigate, authorities, getDashboardPath]);

    // Função para lidar com o envio do formulário de login.
    const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(""); // Limpa mensagens de erro anteriores.
       

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
                // A navegação será tratada pelo useEffect.
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
            
        }
    }, [email, senha, lembrar, login]); // Dependências do useCallback.

    // Retorna os estados e funções necessários para o componente Login.
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