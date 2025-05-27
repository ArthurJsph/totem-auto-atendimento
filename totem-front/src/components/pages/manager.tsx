
import React, { useState } from 'react';

// Componente Card
const Card = ({ icon, title, value, trend, trendIcon, color }) => {
  const colorMap = {
    red: {
      bg: 'bg-red-100',
      text: 'text-red-600',
      border: 'border-red-600',
    },
    yellow: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-600',
      border: 'border-yellow-600',
    },
    green: {
      bg: 'bg-green-100',
      text: 'text-green-600',
      border: 'border-green-600',
    },
  };

  return (
    <div className={`bg-white rounded shadow p-4 border-l-4 flex items-center space-x-3`}>
      <div className={`p-3 rounded-full`}>
        <i className={`fas ${icon} fa-lg`}></i>
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-bold text-gray-900">{value}</p>
        <p className={`text-sm  flex items-center space-x-1`}>
          <i className={`fas ${trendIcon}`}></i>
          <span>{trend}</span>
        </p>
      </div>
    </div>
  );
};

function Manager() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const statusColorMap = {
    green: "bg-green-100 text-green-800",
    yellow: "bg-yellow-100 text-yellow-800",
    red: "bg-red-100 text-red-800",
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <img
            alt="Logo do restaurante, letra R vermelha estilizada"
            className="w-10 h-10 rounded-full"
            src="https://storage.googleapis.com/a1aa/image/69efbfc2-363f-4996-c4f7-b9e5c32dab81.jpg"
            width="40"
            height="40"
          />
          <h1 className="text-xl font-semibold text-red-600 select-none">Restaurante Admin</h1>
        </div>
        <nav className="hidden md:flex space-x-6 text-gray-700 font-medium">
          <a className="hover:text-red-600 transition" href="#">Dashboard</a>
          <a className="hover:text-red-600 transition" href="#">Pedidos</a>
          <a className="hover:text-red-600 transition" href="#">Produtos</a>
          <a className="hover:text-red-600 transition" href="#">Clientes</a>
        </nav>
        <button
          aria-label="Abrir menu mobile"
          className="md:hidden text-gray-700 hover:text-red-600 focus:outline-none"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          <i className="fas fa-bars fa-lg"></i>
        </button>
      </header>

      {/* Menu Mobile */}
      <nav
        aria-label="Menu mobile"
        className={`md:hidden bg-white border-t border-gray-200 flex-col ${showMobileMenu ? 'flex' : 'hidden'}`}
      >
        <a className="block px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 font-medium" href="#">Dashboard</a>
        <a className="block px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 font-medium" href="#">Pedidos</a>
        <a className="block px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 font-medium" href="#">Produtos</a>
        <a className="block px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 font-medium" href="#">Clientes</a>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Dashboard de Vendas e Pedidos
        </h2>

        {/* Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card
            icon="fa-dollar-sign"
            title="Vendas este mês"
            value="R$ 58.430,75"
            trend="+12.5% vs mês anterior"
            trendIcon="fa-arrow-up"
            color="red"
          />
          <Card
            icon="fa-shopping-cart"
            title="Pedidos hoje"
            value="124"
            trend="-3 vs ontem"
            trendIcon="fa-arrow-down"
            color="yellow"
          />
          <Card
            icon="fa-users"
            title="Clientes ativos"
            value="1.245"
            trend="+8.3% vs mês anterior"
            trendIcon="fa-arrow-up"
            color="green"
          />
        </section>

        {/* Tabela de Pedidos */}
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Últimos Pedidos</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded shadow divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  {["Pedido", "Cliente", "Data", "Total", "Status"].map((head) => (
                    <th
                      key={head}
                      className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  { id: "#1001", cliente: "Ana Silva", data: "20/06/2024", total: "R$ 120,50", status: "Entregue", cor: "green" },
                  { id: "#1002", cliente: "Carlos Pereira", data: "20/06/2024", total: "R$ 89,90", status: "Em andamento", cor: "yellow" },
                  { id: "#1003", cliente: "Mariana Costa", data: "19/06/2024", total: "R$ 45,00", status: "Cancelado", cor: "red" },
                  { id: "#1004", cliente: "Lucas Almeida", data: "19/06/2024", total: "R$ 230,00", status: "Entregue", cor: "green" },
                  { id: "#1005", cliente: "Fernanda Lima", data: "18/06/2024", total: "R$ 75,20", status: "Em andamento", cor: "yellow" },
                ].map((pedido) => (
                  <tr key={pedido.id}>
                    <td className="px-4 py-3 text-gray-900 font-medium">{pedido.id}</td>
                    <td className="px-4 py-3 text-gray-700">{pedido.cliente}</td>
                    <td className="px-4 py-3 text-gray-700">{pedido.data}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">{pedido.total}</td>
                    <td className="px-4 py-3">
                        {pedido.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Manager;