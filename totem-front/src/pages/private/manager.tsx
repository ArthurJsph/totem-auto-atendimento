import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks'; 

const ManagerDashboard: React.FC = () => {
    const { authorities, logout } = useAuth(); 
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login'); 
    };

    const isManager = authorities.includes('MANAGER') || authorities.includes('ADMIN'); 

    if (!isManager) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-red-100 p-8 rounded-lg">
                <h2 className="text-2xl font-bold text-red-700 mb-4">Acesso Negado</h2>
                <p className="text-gray-700">Você não tem permissão para visualizar esta página.</p>
                <button
                    onClick={() => navigate('/dashboard')} // Ajuste para o dashboard padrão, se houver
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Ir para o Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6 md:p-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-extrabold text-gray-900">Dashboard do Gerente</h1>
                <button
                    onClick={handleLogout}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition duration-300"
                >
                    Sair
                </button>
            </div>

            <p className="text-lg text-gray-700 mb-8">
                Bem-vindo, Gerente! Aqui você tem uma visão geral e ferramentas para gerenciar suas operações.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {/* Cards de Métricas */}
                <div className="bg-white rounded-lg shadow-xl p-6 transform hover:scale-105 transition duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-gray-800">Vendas Mensais</h3>
                        <i className="fas fa-chart-line text-green-500 text-3xl"></i>
                    </div>
                    <p className="text-3xl font-bold text-green-600 mb-2">R$ 45.200,00</p>
                    <p className="text-gray-600 text-sm">+12% em relação ao mês anterior</p>
                    <button className="mt-4 w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                        Ver Relatório
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-xl p-6 transform hover:scale-105 transition duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-gray-800">Pedidos Pendentes</h3>
                        <i className="fas fa-box-open text-yellow-500 text-3xl"></i>
                    </div>
                    <p className="text-3xl font-bold text-yellow-600 mb-2">15</p>
                    <p className="text-gray-600 text-sm">Aguardando processamento</p>
                    <button className="mt-4 w-full py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition">
                        Gerenciar Pedidos
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-xl p-6 transform hover:scale-105 transition duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-gray-800">Novos Clientes</h3>
                        <i className="fas fa-users text-blue-500 text-3xl"></i>
                    </div>
                    <p className="text-3xl font-bold text-blue-600 mb-2">87</p>
                    <p className="text-gray-600 text-sm">Este mês</p>
                    <button className="mt-4 w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition">
                        Ver Clientes
                    </button>
                </div>
            </div>

            {/* Seção de Gráficos (Exemplo simples com texto) */}
            <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Performance Semanal</h3>
                <div className="h-64 bg-gray-50 flex items-center justify-center rounded-md border border-dashed border-gray-300 text-gray-500">
                    <p>Espaço para Gráfico de Performance (Ex: Vendas por Dia)</p>
                </div>
            </div>

            {/* Seção de Tarefas Rápidas */}
            <div className="bg-white rounded-lg shadow-xl p-6">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Tarefas Rápidas</h3>
                <ul className="space-y-3">
                    <li className="flex items-center text-gray-700">
                        <i className="fas fa-check-circle text-green-500 mr-2"></i> Confirmar 3 novos pedidos
                    </li>
                    <li className="flex items-center text-gray-700">
                        <i className="fas fa-bell text-yellow-500 mr-2"></i> Responder 2 solicitações de suporte
                    </li>
                    <li className="flex items-center text-gray-700">
                        <i className="fas fa-upload text-blue-500 mr-2"></i> Atualizar estoque de produtos esgotados
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default ManagerDashboard;