import React from "react";
import { Link } from "react-router-dom";
import { useLogin } from "../../hooks";
import ImgLogin from "../../assets/login.png"; // Ajuste o caminho conforme necessário
const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const LockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 10V7a3 3 0 013-3h0a3 3 0 013 3v3" />
  </svg>
);

const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeSlashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.25L10.375 14.75m-6.75 6.75L19.25 4.75M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);


function Login() {
  const {
    email,
    setEmail,
    senha,
    setSenha,
    lembrar,
    setLembrar,
    showPassword,
    setShowPassword,
    error,
    isLoading,
    handleSubmit,
  } = useLogin();

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      <div className="hidden md:flex w-0 md:w-2/3 h-screen bg-cover bg-center" style={{ backgroundImage: `url('${ImgLogin}')` }}>
        <div className="w-full h-full bg-black bg-opacity-30 flex items-center justify-center">
            <h1 className="text-white text-4xl font-bold drop-shadow-lg"></h1>
        </div>
      </div>
      <div className="w-full md:w-1/3 h-screen flex flex-col bg-white justify-center items-center p-8 overflow-y-auto"> 
        <div className="bg-white p-8 rounded-lg shadow-2xl text-center w-full max-w-sm"> 
          <h2 className="text-gray-800 text-3xl font-bold mb-8">Bem-vindo(a)!</h2> 
          <p className="text-gray-600 mb-6">Faça login para continuar.</p>

          <form className="space-y-6" onSubmit={handleSubmit}> 
            <div className="relative">
              <label htmlFor="email" className="sr-only">E-mail</label> 
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <UserIcon /> 
              </span>
              <input
                type="email" 
                id="email"
                placeholder="E-mail"
                name="email"
                className="pl-10 pr-4 py-2 w-full rounded-lg bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 border border-transparent focus:border-red-500" // Cor da borda no focus
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                required
                aria-label="E-mail"
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="sr-only">Senha</label> 
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <LockIcon />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Senha"
                name="senha"
                className="pl-10 pr-10 py-2 w-full rounded-lg bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 border border-transparent focus:border-red-500" // Cor da borda no focus
                value={senha}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSenha(e.target.value)}
                required
                aria-label="Senha"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 focus:outline-none text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
              >
                {showPassword ? <EyeSlashIcon /> : <EyeIcon />} 
              </button>
            </div>

            <div className="flex justify-between items-center text-sm">
                <div className="flex items-center">
                    <input
                    type="checkbox"
                    id="lembrar"
                    name="lembrar"
                    className="mr-2 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded" 
                    checked={lembrar}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLembrar(e.target.checked)}
                    />
                    <label htmlFor="lembrar" className="text-gray-700">
                        Lembrar-me
                    </label>
                </div>
                <Link
                    to="/recuperar"
                    className="text-red-700 hover:underline font-medium transition-colors"
                >
                    Esqueceu a senha?
                </Link>
            </div>

            {error && (
              <p className="text-red-600 text-sm mt-2">{error}</p> 
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-red-700 hover:bg-red-800 text-white font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed" // Melhor transição e estilo para disabled
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Entrando...
                </span>
              ) : (
                "Login"
              )}
            </button>

            <Link
              to="/registrar"
              className="block mt-6 text-sm text-red-700 hover:underline font-medium transition-colors" 
            >
              Não tem uma conta? Crie uma aqui →
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;