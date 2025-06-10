// src/routes/PrivateRoute.tsx
import React, { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // <<<<<<< IMPORTAR O NOVO USEAUTH AQUI!

interface PrivateRouteProps {
  allowedRoles: string[];
  children?: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
  // <<<<<<< AQUI ESTÁ A MUDANÇA: Use o 'useAuth' que você criou!
  const { isAuthenticated, authorities, isLoading } = useAuth(); 

  if (isLoading) {
    return <div>Carregando autenticação...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Verificar se o usuário tem *pelo menos uma* das roles permitidas
  const hasPermission = allowedRoles.some(role => authorities.includes(role));

  if (allowedRoles && !hasPermission) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;