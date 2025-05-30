import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isUserAdminOrManager } from "../../service/auth"; // ajuste o caminho

const Manager = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isUserAdminOrManager()) {
      navigate("/login"); // ou outra rota que preferir
    }
  }, [navigate]);

  if (!isUserAdminOrManager()) {
    return <p>Você não tem permissão para acessar essa página.</p>;
  }

  return (
    // Seu JSX atual da página Manager
    <div> {/* seu código aqui */} </div>
  );
};

export default Manager;
