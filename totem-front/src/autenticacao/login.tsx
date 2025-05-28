import React, { useState } from "react";
import { login } from "../service/auth";
import { Link } from "react-router-dom";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [lembrar, setLembrar] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    login(email, senha).then((response) => {
      console.log("Login bem sucedido:", response);

      // Salva email e senha no localStorage
      localStorage.setItem("email", email);
      localStorage.setItem("senha", senha);

      // Redirecionar ou outras ações aqui, se quiser
    });
  };

  const handleGoogleLoginSuccess = (credentialResponse: any) => {
    // Aqui você pode enviar o token para sua API ou autenticar o usuário
    console.log(credentialResponse);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex flex-1 md:flex-row w-full">
        <div className="hidden md:flex w-[80%] bg-gray-100 items-center justify-center">
          <img
            src="src/assets/login.png"
            alt="imagem login"
            className="max-w-[80%] max-h-full object-cover"
          />
        </div>

        <div className="w-full md:w-5/12 flex flex-col bg-white justify-center items-center p-8">
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
                  to="/esquecer-senha"
                  className="text-blue-600 hover:underline text-sm"
                >
                  Esqueci minha senha
                </Link>
              </div>
            </form>

            <GoogleOAuthProvider clientId="SEU_CLIENT_ID_AQUI">
              <div className="flex justify-center mt-4">
                <GoogleLogin
                  onSuccess={handleGoogleLoginSuccess}
                  onError={() => {
                    console.log("Login Failed");
                  }}
                  width="100%"
                  text="continue_with"
                  shape="pill"
                  theme="filled_black"
                  render={(renderProps) => (
                    <button
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                      className="w-1/2 py-2 rounded-lg bg-white border border-red-700 text-red-700 font-semibold flex items-center justify-center gap-2 shadow transition hover:bg-red-50"
                      type="button"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 48 48">
                        <path
                          fill="#FFC107"
                          d="M43.6 20.5h-1.9V20H24v8h11.3c-1.6 4.3-5.7 7-11.3 7-6.6 0-12-5.4-12-12s5.4-12 12-12c2.7 0 5.2.9 7.2 2.4l6-6C34.5 5.1 29.5 3 24 3 12.9 3 4 11.9 4 23s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.5-.3-3.5z"
                        />
                        <path
                          fill="#FF3D00"
                          d="M6.3 14.7l6.6 4.8C14.5 16.1 18.9 13 24 13c2.7 0 5.2.9 7.2 2.4l6-6C34.5 5.1 29.5 3 24 3c-7.2 0-13.4 4.1-16.7 10.1z"
                        />
                        <path
                          fill="#4CAF50"
                          d="M24 43c5.4 0 10.4-1.8 14.2-4.9l-6.6-5.4C29.5 34.9 26.9 36 24 36c-5.6 0-10.3-3.7-12-8.7l-6.6 5.1C7.9 39.1 15.4 43 24 43z"
                        />
                        <path
                          fill="#1976D2"
                          d="M43.6 20.5h-1.9V20H24v8h11.3c-1.3 3.5-4.3 6-8.3 6-5.6 0-10.3-3.7-12-8.7l-6.6 5.1C7.9 39.1 15.4 43 24 43c8.6 0 16.1-3.9 19.7-10.1z"
                        />
                      </svg>
                      Google
                    </button>
                  )}
                />
              </div>
            </GoogleOAuthProvider>

            <a
              href="/registrar"
              className="block mt-6 text-sm text-gray-600 hover:text-blue-600 hover:underline transition-colors"
            >
              Criar nova conta →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
