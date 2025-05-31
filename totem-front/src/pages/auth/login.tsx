import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../service/auth";
import { Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [lembrar, setLembrar] = useState(false);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalHeight = document.body.style.height;
    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.height = originalHeight;
    };
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    login(email, senha).then(() => {
      localStorage.setItem("email", email);
      localStorage.setItem("senha", senha);
      navigate("/redirect");
    });
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Imagem ocupa 80% da tela, alinhada à esquerda */}
      <div className="hidden md:block w-[70vw] h-screen">
        <img
          src="src/assets/login.png"
          alt="imagem login"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Formulário ocupa 20% da tela, alinhado à direita */}
      <div className="w-full md:w-[30vw] h-screen flex flex-col bg-white justify-center items-center p-8">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center w-full max-w-sm">
          <h2 className="text-gray-800 text-2xl font-semibold mb-6">Login</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="mb-4">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <i className="fas fa-user text-gray-400"></i>
                </span>
                <input
                  type="text"
                  placeholder="E-mail"
                  name="email"
                  className="pl-10 pr-4 py-2 w-full rounded-lg bg-gray-100 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <i className="fas fa-lock text-gray-400"></i>
                </span>
                <input
                  type="password"
                  placeholder="Senha"
                  name="senha"
                  className="pl-10 pr-10 py-2 w-full rounded-lg bg-gray-100 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  <i className="fas fa-eye text-gray-400"></i>
                </button>
              </div>
            </div>

            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                id="lembrar"
                name="lembrar"
                className="mr-2"
                checked={lembrar}
                onChange={(e) => setLembrar(e.target.checked)}
              />
              <label htmlFor="lembrar" className="text-gray-600">
                Lembrar-me
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-red-700 hover:bg-red-800 text-white font-semibold"
            >
              Login
            </button>

            <div className="flex justify-between items-center mt-2">
              <Link
                to="/recuperar"
                className="text-blue-600 hover:underline text-sm"
              >
                Esqueci minha senha
              </Link>
            </div>
          </form>
          <a
            href="/registrar"
            className="block mt-6 text-sm text-gray-600 hover:text-blue-600 hover:underline transition-colors"
          >
            Criar nova conta →
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;
