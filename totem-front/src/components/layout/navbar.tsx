

import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold text-orange-500">
        2 Tempos Café
      </Link>

      {/* Links de navegação */}
      <div className="space-x-6 text-gray-700 font-medium">
        <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
        <Link to="/produtos" className="hover:text-orange-500 transition-colors">Produtos</Link>
        <Link to="/sobre" className="hover:text-orange-500 transition-colors">Sobre</Link>
        <Link to="/login" className="hover:text-orange-500 transition-colors">Login</Link>
      </div>
    </nav>
  );
}

