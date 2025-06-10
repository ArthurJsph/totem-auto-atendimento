// src/routes/PublicRoute.tsx
import React, { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks'; // Importe o useAuth do seu index.ts

interface PublicRouteProps {
    children?: ReactNode; // Opcional, se você usar Outlet, mas bom para flexibilidade
}

const PublicRoute: React.FC<PublicRouteProps> = () => {
    // >>> AJUSTE AQUI: Use 'useAuth' e acesse 'isLoading' e 'authorities'
    const { isAuthenticated, isLoading, authorities } = useAuth(); 

    if (isLoading) {
        return <div>Carregando autenticação...</div>;
    }

    if (isAuthenticated) {
        // Redireciona para a dashboard do usuário logado com base no papel
        // Isso é importante, pois o `PublicRoute` deve impedir acesso a `/login` para quem já está logado.
        if (authorities.includes('ADMIN')) {
            return <Navigate to="/admin" replace />;
        }
        if (authorities.includes('MANAGER')) {
            return <Navigate to="/manager" replace />;
        }
        // Se houver uma dashboard padrão para usuários comuns ou se o role for CLIENT
        // if (authorities.includes('CLIENT')) {
        //     return <Navigate to="/dashboard" replace />;
        // }
        // Caso não tenha um role específico ou um dashboard padrão
        return <Navigate to="/" replace />; // Ou para a página inicial
    }

    return <Outlet />; // Renderiza o componente filho da rota (ex: Login, Registrar)
};

export default PublicRoute;