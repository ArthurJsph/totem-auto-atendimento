import { Link, useNavigate } from "react-router-dom";
import { useState } from "react"; 
import { useAuth } from "../../hooks/useAuth"; 
import Logo from "../../assets/logo.png"; // Ajuste o caminho conforme necessário

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  // Use 'user' do useAuth para verificar se o usuário está logado e, se necessário, pegar o ID ou outras infos
  const { isAuthenticated, authorities, logout: authLogout, user } = useAuth(); // Adicione 'user' aqui
  
  const hasDashboardAccess = authorities.includes("ADMIN") || authorities.includes("MANAGER");

  function handleLogout() {
    authLogout();
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
          src={Logo}
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
          {/* Dashboard apenas para ADMIN/MANAGER */}
          {hasDashboardAccess && (
            <Link to="/admin" className="transition-shadow hover:shadow-[0_2px_0_0_#ef4444]">
              Dashboard
            </Link>
          )}
          {/* Minha Conta APENAS para usuários autenticados */}
          {isAuthenticated && ( // Condição para exibir "Minha Conta"
            <Link to="/my-account" className="transition-shadow hover:shadow-[0_2px_0_0_#ef4444]">
              Minha Conta
            </Link>
          )}
          <Link to="/sobre" className="transition-shadow hover:shadow-[0_2px_0_0_#ef4444]">
            Sobre
          </Link>
        </div>
      </div>

      {/* Botões de Login/Sair para telas maiores (desktop) */}
      <div className="hidden md:flex justify-end items-center space-x-4 ml-auto">
        {!isAuthenticated ? (
          <>
            <Link to="/login" className="bg-red-700 text-white px-4 py-2 rounded shadow hover:bg-red-800 transition">
              Entrar
            </Link>
            <Link to="/registrar" className="border border-red-700 text-red-700 px-4 py-2 rounded hover:bg-red-50 transition">
              Criar Conta
            </Link>
          </>
        ) : (
          // Exibe o nome do usuário ou um link para a conta, e o botão Sair
          <div className="flex items-center space-x-4">
            {user && ( // Verifica se 'user' existe para exibir o nome
              <Link to="/my-account" className="text-gray-700 font-medium hover:text-red-700">
                Olá, {user.name.split(' ')[0]}! {/* Exibe apenas o primeiro nome */}
              </Link>
            )}
            <button onClick={handleLogout} className="bg-red-700 text-white px-4 py-2 rounded shadow hover:bg-red-800 transition">
              Sair
            </button>
          </div>
        )}
      </div>

      {/* Ícone de Hambúrguer (visível apenas em telas menores) */}
      <div className="md:hidden flex items-center">
        {/* Botões de Login/Sair ao lado do hambúrguer em mobile */}
        {!isAuthenticated ? (
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
        {/* Dashboard no menu mobile */}
        {hasDashboardAccess && (
          <Link to="/admin" className="text-gray-700 font-medium hover:text-red-700" onClick={toggleMenu}>
            Dashboard
          </Link>
        )}
        {/* Minha Conta no menu mobile */}
        {isAuthenticated && (
          <Link to="/my-account" className="text-gray-700 font-medium hover:text-red-700" onClick={toggleMenu}>
            Minha Conta
          </Link>
        )}
        <Link to="/sobre" className="text-gray-700 font-medium hover:text-red-700" onClick={toggleMenu}>
          Sobre
        </Link>

        {!isAuthenticated && (
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