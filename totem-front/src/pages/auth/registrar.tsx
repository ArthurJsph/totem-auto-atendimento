import { useEffect } from "react";
import { useRegister } from "../../hooks"; // Adjust the path as needed

const Registrar = () => {
  const {
    formData,
    confirmPassword,
    loading,
    error,
    success,
    handleChange,
    setConfirmPassword,
    handleSubmit,
  } = useRegister();

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

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <section className="hidden md:block w-1/2 h-full">
        <img
          alt="Imagem de restaurante moderno com ambiente acolhedor"
          className="object-cover w-full h-full"
          src="src/assets/latte-macchiato.jpg"
        />
      </section>

      <section className="w-full md:w-1/2 h-full flex flex-col justify-center items-center bg-white p-4 sm:p-6 lg:p-8"> 
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto overflow-y-auto max-h-full">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center md:text-left">
            Registro de Usuário
          </h1>
          <form
            onSubmit={handleSubmit}
            autoComplete="off"
            className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3" 
            noValidate
          >
            <div>
              <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-1">
                Nome Completo
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Digite seu nome completo"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="exemplo@gmail.com"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-gray-700 text-sm font-medium mb-1">
                Telefone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                pattern="^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$"
                placeholder="(99) 99999-9999"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200"
              />
            </div>

            <div>
              <label htmlFor="cpf" className="block text-gray-700 text-sm font-medium mb-1">
                CPF
              </label>
              <input
                type="text"
                id="cpf"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                required
                pattern="^\d{3}\.\d{3}\.\d{3}-\d{2}$"
                placeholder="000.000.000-00"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-1">
                Senha
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Crie uma senha segura"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-medium mb-1">
                Confirme sua senha
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Repita a senha"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200"
              />
            </div>

            {error && (
              <p className="sm:col-span-2 text-red-600 text-sm mt-2">{error}</p>
            )}
            {success && (
              <p className="sm:col-span-2 text-green-600 text-sm mt-2">{success}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="sm:col-span-2 w-60 justify-self-center bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {loading ? "Registrando..." : "Registrar"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Registrar;