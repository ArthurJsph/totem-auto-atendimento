// src/routes/PrivateRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { getUserRoles, getToken } from "../service/auth";

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, allowedRoles }) => {
  const token = getToken();
  const roles = getUserRoles();

  // Se não estiver logado, vai para login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Se não tiver nenhuma das roles permitidas, vai para 401
  const hasAccess = roles.some(role => allowedRoles.includes(role));
  if (!hasAccess) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
