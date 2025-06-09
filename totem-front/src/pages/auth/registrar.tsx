import React, { useState, useEffect } from "react";
import { register } from "../../service/auth";
import { User } from "../../service/interfaces";

const Registrar = () => {
  const [formData, setFormData] = useState<Omit<User, "role">>({
    name: "",
    email: "",
    password: "",
    phone: "",
    cpf: "",
  });
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Impede rolagem apenas nesta tela
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

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (formData.password !== confirmPassword) {
        setError("As senhas não conferem.");
        setLoading(false);
        return;
      }

      await register({ ...formData, role: "CLIENT" });
      setSuccess("Registro realizado com sucesso!");
      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        cpf: "",
      });
      setConfirmPassword("");
    } catch {
      setError("Falha no registro. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Imagem ocupa toda a esquerda */}
      <section className="hidden md:block w-1/2 h-full">
        <img
          alt="Imagem de restaurante moderno com ambiente acolhedor"
          className="object-cover w-full h-full"
          src="src/assets/latte-macchiato.jpg"
        />
      </section>

      {/* Formulário ocupa toda a direita, centralizado verticalmente */}
      <section className="w-full md:w-1/2 h-full flex flex-col justify-center items-center bg-white">
        <div className="w-full max-w-lg flex flex-col justify-center h-full">
          <h1 className="text-xl font-semibold text-gray-800 mb-2 text-center md:text-left">
            Registro de Usuário
          </h1>
          <form onSubmit={handleSubmit} autoComplete="off" className="grid grid-cols-1 md:grid-cols-2 gap-3" noValidate>
            <div>
              <label htmlFor="name" className="block text-gray-700 text-sm mb-1">
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
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm mb-1">
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
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-gray-700 text-sm mb-1">
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
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label htmlFor="cpf" className="block text-gray-700 text-sm mb-1">
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
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-700 text-sm mb-1">
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
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-gray-700 text-sm mb-1">
                Confirme sua senha
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                placeholder="Repita a senha"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
              />
            </div>

            {error && (
              <p className="md:col-span-2 text-red-600 text-sm">{error}</p>
            )}
            {success && (
              <p className="md:col-span-2 text-red-600 text-sm">{success}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="md:col-span-2 w-1/2 mx-auto bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-md transition disabled:opacity-50"
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
