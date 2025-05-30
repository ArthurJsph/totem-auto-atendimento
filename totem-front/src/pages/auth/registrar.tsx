import React, { useState } from "react";
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
      // Aqui forçamos role como "client"
      await register({ ...formData, role: "CLIENT" });
      setSuccess("Registro realizado com sucesso!");
      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        cpf: "",
      });
    } catch {
      setError("Falha no registro. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow overflow-y-auto bg-gray-50 p-4">
        <div className="bg-white shadow-lg rounded-lg max-w-6xl w-full mx-auto h-full md:flex md:overflow-hidden">
          <section className="hidden md:block md:w-1/2 bg-gradient-to-tr from-green-600 to-green-400 relative">
            <img
              alt="Imagem de restaurante moderno com ambiente acolhedor"
              className="object-cover w-full h-full"
              height={800}
              src="src/assets/registrar.jpeg"
              width={600}
            />
            <div className="absolute bottom-6 left-6 text-white">
              <h2 className="text-3xl font-semibold mb-2">Bem-vindo ao Registro</h2>
              <p className="text-lg max-w-xs">
                Cadastre seu restaurante para gerenciar seu negócio com facilidade.
              </p>
            </div>
          </section>

          <section className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center md:text-left">
              Registro de Restaurante
            </h1>

            <form onSubmit={handleSubmit} autoComplete="off" className="space-y-6" noValidate>
              <div>
                <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
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
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="exemplo@dominio.com"
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
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
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-gray-700 font-medium mb-1">
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
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label htmlFor="cpf" className="block text-gray-700 font-medium mb-1">
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
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                />
              </div>

              {error && <p className="text-red-600">{error}</p>}
              {success && <p className="text-green-600">{success}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-md transition disabled:opacity-50"
              >
                {loading ? "Registrando..." : "Registrar"}
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Registrar;
