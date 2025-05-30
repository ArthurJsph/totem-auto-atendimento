import { Link, useNavigate } from "react-router-dom";
import { getToken, logout } from "../../service/auth";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoggedIn(!!getToken());
  }, []);

  function handleLogout() {
    logout();
    setLoggedIn(false);
    navigate("/login");
  }

  return (
    <nav className="bg-white shadow-md py-4 px-6 flex items-center justify-between">
      {/* Logo à esquerda */}
      <div className="flex-1 flex items-center">
        <img
          src="src/assets/logo.png"
          alt="imagem login"
          className="object-cover h-10 w-auto"
        />
      </div>

      {/* Links centralizados */}
      <div className="flex-1 flex justify-center">
        <div className="space-x-6 text-gray-700 font-medium">
          <Link
            to="/"
            className="transition-shadow hover:shadow-[0_2px_0_0_#ef4444]"
          >
            Home
          </Link>

          <Link
            to="/pedido"
            className="transition-shadow hover:shadow-[0_2px_0_0_#ef4444]"
          >
            Pedidos
          </Link>

          <Link
            to="/sobre"
            className="transition-shadow hover:shadow-[0_2px_0_0_#ef4444]"
          >
            Sobre
          </Link>
        </div>
      </div>

      {/* Botões à direita */}
      <div className="flex-1 flex justify-end items-center space-x-4">
        {!loggedIn ? (
          <>
            <Link
              to="/login"
              className="bg-red-700 text-white px-4 py-2 rounded shadow hover:bg-red-800 transition"
            >
              Entrar
            </Link>
            <Link
              to="/registrar"
              className="border border-red-700 text-red-700 px-4 py-2 rounded hover:bg-red-50 transition"
            >
              Criar Conta
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-red-700 text-white px-4 py-2 rounded shadow hover:bg-red-800 transition"
          >
            Sair
          </button>
        )}
      </div>
    </nav>
  );
}
