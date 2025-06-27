// src/routes/PrivateRoute.tsx
import React, { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // <<<<<<< IMPORTAR O NOVO USEAUTH AQUI!

interface PrivateRouteProps {
  allowedRoles: string[];
  children?: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, authorities, isLoading } = useAuth(); 

  if (isLoading) {
    return <div>Carregando autenticação...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const hasPermission = allowedRoles.some(role => authorities.includes(role));

  if (allowedRoles && !hasPermission) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;