import { Link, useNavigate } from "react-router-dom";
// REMOVIDO: import { getToken, logout } from "../../service/auth"; // Não precisamos mais do getToken/logout diretos aqui
import { useState, useEffect } from "react"; // useEffect ainda pode ser útil para outras lógicas, mas não para 'loggedIn'
import { useAuth } from "../../hooks/useAuth"; // Importa o hook de autenticação

export default function Navbar() {
  // REMOVIDO: const [loggedIn, setLoggedIn] = useState(false); // Substituído por isAuthenticated do useAuth
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // >>> NOVO: Obtenha isAuthenticated e authorities do hook useAuth
  const { isAuthenticated, authorities, logout: authLogout } = useAuth(); // Renomeado logout para authLogout para evitar conflito

  // Verifica se o usuário tem a role ADMIN OU MANAGER
  const hasDashboardAccess = authorities.includes("ADMIN") || authorities.includes("MANAGER");

  // REMOVIDO: useEffect para setLoggedIn, pois isAuthenticated já faz isso
  // useEffect(() => {
  //   setLoggedIn(!!getToken());
  // }, []);

  function handleLogout() {
    authLogout(); // Chama a função logout do hook useAuth
    // Não precisa de setLoggedIn(false) aqui, pois o useAuth já atualiza seu estado
    navigate("/login");
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md py-4 px-6 flex items-center justify-between relative z-50">
      {/* Logo à esquerda */}
      <div className="flex items-center">
        <img
          src="src/assets/logo.png"
          alt="2 Tempos Café Logo"
          className="object-cover h-10 w-auto"
        />
      </div>

      {/* Links centralizados para telas maiores (desktop) */}
      <div className="hidden md:flex flex-1 justify-center">
        <div className="space-x-6 text-gray-700 font-medium">
          <Link to="/home" className="transition-shadow hover:shadow-[0_2px_0_0_#ef4444]">
            Home
          </Link>
          <Link to="/pedido" className="transition-shadow hover:shadow-[0_2px_0_0_#ef4444]">
            Pedidos
          </Link>
          {/* MUDANÇA AQUI: Condição para Dashboard */}
          {hasDashboardAccess && (
            <Link to="/manager" className="transition-shadow hover:shadow-[0_2px_0_0_#ef4444]">
              Dashboard
            </Link>
          )}
          <Link to="/sobre" className="transition-shadow hover:shadow-[0_2px_0_0_#ef4444]">
            Sobre
          </Link>
        </div>
      </div>

      {/* Botões de Login/Sair para telas maiores (desktop) */}
      <div className="hidden md:flex justify-end items-center space-x-4 ml-auto">
        {!isAuthenticated ? ( // Use isAuthenticated do useAuth
          <>
            <Link to="/login" className="bg-red-700 text-white px-4 py-2 rounded shadow hover:bg-red-800 transition">
              Entrar
            </Link>
            <Link to="/registrar" className="border border-red-700 text-red-700 px-4 py-2 rounded hover:bg-red-50 transition">
              Criar Conta
            </Link>
          </>
        ) : (
          <button onClick={handleLogout} className="bg-red-700 text-white px-4 py-2 rounded shadow hover:bg-red-800 transition">
            Sair
          </button>
        )}
      </div>

      {/* Ícone de Hambúrguer (visível apenas em telas menores) */}
      <div className="md:hidden flex items-center">
        {/* Botões de Login/Sair ao lado do hambúrguer em mobile */}
        {!isAuthenticated ? ( // Use isAuthenticated do useAuth
          <Link to="/login" className="bg-red-700 text-white px-3 py-1.5 text-sm rounded shadow hover:bg-red-800 transition mr-2">
            Entrar
          </Link>
        ) : (
          <button onClick={handleLogout} className="bg-red-700 text-white px-3 py-1.5 text-sm rounded shadow hover:bg-red-800 transition mr-2">
            Sair
          </button>
        )}

        <button onClick={toggleMenu} className="text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded p-1">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
      </div>

      {/* Menu Hambúrguer (aparece apenas em telas menores, slide-in) */}
      <div
        className={`
          md:hidden
          absolute top-full right-0 w-64 bg-white shadow-lg p-6
          transform transition-transform duration-300 ease-in-out
          ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
          flex flex-col space-y-4
          rounded-bl-lg
        `}
      >
        <Link to="/home" className="text-gray-700 font-medium hover:text-red-700" onClick={toggleMenu}>
          Home
        </Link>
        <Link to="/pedido" className="text-gray-700 font-medium hover:text-red-700" onClick={toggleMenu}>
          Pedidos
        </Link>
        {/* MUDANÇA AQUI: Condição para Dashboard no menu mobile */}
        {hasDashboardAccess && (
          <Link to="/manager" className="text-gray-700 font-medium hover:text-red-700" onClick={toggleMenu}>
            Dashboard
          </Link>
        )}
        <Link to="/sobre" className="text-gray-700 font-medium hover:text-red-700" onClick={toggleMenu}>
          Sobre
        </Link>

        {!isAuthenticated && ( // Use isAuthenticated do useAuth
          <>
            <div className="pt-4 border-t border-gray-200">
              <Link to="/registrar" className="block text-red-700 border border-red-700 px-4 py-2 rounded text-center hover:bg-red-50 transition" onClick={toggleMenu}>
                Criar Conta
              </Link>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}