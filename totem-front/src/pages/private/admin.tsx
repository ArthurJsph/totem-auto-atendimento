import React from 'react';
import { useAuth } from '../../hooks/useAuth'; 
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
    const { authorities, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isAdmin = authorities.includes('ADMIN');

    if (!isAdmin) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-red-100 p-8 rounded-lg">
                <h2 className="text-2xl font-bold text-red-700 mb-4">Acesso Negado</h2>
                <p className="text-gray-700">Você não tem permissão para visualizar esta página.</p>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Ir para o Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6 md:p-10 text-white">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-extrabold text-blue-400">Painel do Administrador</h1>
                <button
                    onClick={handleLogout}
                    className="px-6 py-2 bg-red-700 text-white rounded-lg shadow-lg hover:bg-red-800 transition duration-300"
                >
                    Sair
                </button>
            </div>

            <p className="text-lg text-gray-300 mb-8">
                Visão geral e controle total sobre o sistema. Gerencie usuários, configurações e mais.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {/* Cards de Métricas */}
                <div className="bg-gray-700 rounded-lg shadow-xl p-6 transform hover:scale-105 transition duration-300 border-l-4 border-blue-500">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-white">Usuários Totais</h3>
                        <i className="fas fa-users-cog text-blue-400 text-3xl"></i>
                    </div>
                    <p className="text-3xl font-bold text-blue-300 mb-2">1.250</p>
                    <p className="text-gray-400 text-sm">+50 este mês</p>
                    <button className="mt-4 w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                        Gerenciar Usuários
                    </button>
                </div>

                <div className="bg-gray-700 rounded-lg shadow-xl p-6 transform hover:scale-105 transition duration-300 border-l-4 border-green-500">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-white">Transações Concluídas</h3>
                        <i className="fas fa-dollar-sign text-green-400 text-3xl"></i>
                    </div>
                    <p className="text-3xl font-bold text-green-300 mb-2">5.890</p>
                    <p className="text-gray-400 text-sm">Semanalmente</p>
                    <button className="mt-4 w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
                        Ver Transações
                    </button>
                </div>

                <div className="bg-gray-700 rounded-lg shadow-xl p-6 transform hover:scale-105 transition duration-300 border-l-4 border-red-500">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-white">Erros do Sistema</h3>
                        <i className="fas fa-bug text-red-400 text-3xl"></i>
                    </div>
                    <p className="text-3xl font-bold text-red-300 mb-2">3</p>
                    <p className="text-gray-400 text-sm">Críticos hoje</p>
                    <button className="mt-4 w-full py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition">
                        Ver Logs
                    </button>
                </div>

                <div className="bg-gray-700 rounded-lg shadow-xl p-6 transform hover:scale-105 transition duration-300 border-l-4 border-yellow-500">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-white">Configurações</h3>
                        <i className="fas fa-cogs text-yellow-400 text-3xl"></i>
                    </div>
                    <p className="text-3xl font-bold text-yellow-300 mb-2">Atualizado</p>
                    <p className="text-gray-400 text-sm">Ontem</p>
                    <button className="mt-4 w-full py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition">
                        Acessar Configurações
                    </button>
                </div>
            </div>

            {/* Seção de Atividade Recente */}
            <div className="bg-gray-700 rounded-lg shadow-xl p-6 mb-6">
                <h3 className="text-2xl font-semibold text-white mb-4">Atividade Recente</h3>
                <ul className="space-y-3 text-gray-300">
                    <li className="flex items-center">
                        <i className="fas fa-user-plus text-green-400 mr-2"></i> Novo usuário 'João Silva' registrado.
                        <span className="ml-auto text-gray-500 text-sm">5 min atrás</span>
                    </li>
                    <li className="flex items-center">
                        <i className="fas fa-server text-yellow-400 mr-2"></i> Servidor de pagamentos reiniciado.
                        <span className="ml-auto text-gray-500 text-sm">15 min atrás</span>
                    </li>
                    <li className="flex items-center">
                        <i className="fas fa-exclamation-triangle text-red-400 mr-2"></i> Erro crítico no módulo de relatórios.
                        <span className="ml-auto text-gray-500 text-sm">1 hr atrás</span>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default AdminDashboard;