// src/pages/RedirectByRole.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMainRole, getToken, isTokenExpired } from "../service/auth";

const RedirectByRole = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = getToken();
    if (!token || isTokenExpired()) {
      navigate("/login");
      return;
    }

    const role = getMainRole();
    if (role === "ADMIN") navigate("/admin");
    else if (role === "MANAGER") navigate("/manager");
    else navigate("/"); 
  }, [navigate]);
  return null; 
};

export default RedirectByRole;
