// src/pages/private/myAccout.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLoggedUser, isAuthenticated, logout } from '../../service/auth';
import { User } from '../../service/interfaces';
import { updateUser as updateUserService, changePassword as changePasswordService } from '../../service/user';
import axios from 'axios'; 

const MyAccount: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [formData, setFormData] = useState<User | null>(null);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });
    const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login');
            return;
        }

        const currentUser = getLoggedUser();
        if (currentUser) {
            setUser(currentUser);
            setFormData(currentUser); // Inicializa o formData com os dados do usuário
        } else {
            logout(); // Força o logout para limpar qualquer estado inválido
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => prev ? { ...prev, [name]: value } : null);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveAll = async () => {
        setIsSubmitting(true);
        setFeedbackMessage(null);

        if (!user || user.id === undefined || user.id === null || !formData) {
            setFeedbackMessage({ type: 'error', message: 'Dados do usuário não carregados corretamente. Por favor, tente novamente.' });
            setIsSubmitting(false);
            return;
        }

        let updateSuccess = true;
        let passwordChangeSuccess = true;
        const messages: string[] = [];

        // 1. Tentar atualizar os dados pessoais
        try {
            const dataToUpdate: Partial<User> = {
                id: user.id,
                name: formData.name,
                phone: formData.phone,
                // Adicione outros campos editáveis aqui, como email se ele puder ser atualizado
                // email: formData.email,
            };

            const updatedUser = await updateUserService(dataToUpdate, Number(user.id)); 
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            messages.push('Dados pessoais atualizados!');
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                messages.push(`Erro ao atualizar dados: ${error.response.data || error.message}.`);
            } else {
                messages.push(`Erro ao atualizar dados: ${error instanceof Error ? error.message : String(error)}.`);
            }
            console.error('Erro ao atualizar dados pessoais:', error);
            updateSuccess = false;
        }

        // 2. Tentar alterar a senha, SE os campos de senha foram preenchidos
        const hasPasswordFieldsFilled = passwordData.currentPassword || passwordData.newPassword || passwordData.confirmNewPassword;

        if (hasPasswordFieldsFilled) {
            if (!passwordData.currentPassword) {
                messages.push('Preencha a senha atual para alterá-la.');
                passwordChangeSuccess = false;
            } else if (!passwordData.newPassword || !passwordData.confirmNewPassword) {
                messages.push('Preencha os campos de nova senha para alterá-la.');
                passwordChangeSuccess = false;
            } else if (passwordData.newPassword !== passwordData.confirmNewPassword) {
                messages.push('A nova senha e a confirmação não coincidem.');
                passwordChangeSuccess = false;
            } else if (passwordData.newPassword.length < 6) {
                messages.push('A nova senha deve ter pelo menos 6 caracteres.');
                passwordChangeSuccess = false;
            } else {
                try {
                    await changePasswordService(passwordData.currentPassword, passwordData.newPassword);
                    messages.push('Senha alterada com sucesso!');
                    setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' }); // Limpa campos
                } catch (error) {
                    if (axios.isAxiosError(error) && error.response) {
                        messages.push(`Erro ao alterar senha: ${error.response.data || error.message}.`);
                    } else {
                        messages.push(`Erro ao alterar senha: ${error instanceof Error ? error.message : String(error)}.`);
                    }
                    console.error('Erro ao alterar senha:', error);
                    passwordChangeSuccess = false;
                }
            }
        }

        // --- EXIBIR FEEDBACK FINAL ---
        if (updateSuccess && passwordChangeSuccess && messages.length > 0) {
            setFeedbackMessage({ type: 'success', message: messages.join(' ') });
        } else if (!updateSuccess || !passwordChangeSuccess) {
            setFeedbackMessage({ type: 'error', message: messages.join(' ') || 'Ocorreu um erro inesperado.' });
        } else {
            setFeedbackMessage({ type: 'success', message: 'Nenhuma alteração foi realizada.' });
        }
        setIsSubmitting(false);
    };

    // --- FUNÇÕES DE FORMATAÇÃO VISUAL (Frontend apenas) ---
    const formatPhone = (phone: string | undefined) => {
        if (!phone) return 'N/A';
        const cleaned = ('' + phone).replace(/\D/g, '');
        if (cleaned.length === 11) { // (XX) XXXXX-XXXX (com nono dígito)
            return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7, 11)}`;
        } else if (cleaned.length === 10) { // (XX) XXXX-XXXX (sem nono dígito)
            return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 6)}-${cleaned.substring(6, 10)}`;
        }
        return phone; // Retorna o original se não conseguir formatar
    };

    const formatCpf = (cpf: string | undefined) => {
        if (!cpf) return 'N/A';
        const cleaned = ('' + cpf).replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);
        if (match) {
            return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`;
        }
        return cpf;
    };

    if (!user || !formData) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <p className="text-lg text-gray-600">Carregando informações do usuário...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-200">
                {/* Título Principal */}
                <h1 className="text-5xl font-extrabold text-orange-600 text-left mb-8 tracking-tight">
                    Minha Conta
                </h1>
                <p className="text-gray-700 text-lg mb-8">
                    Gerencie seus dados pessoais e sua senha de acesso.
                </p>

                {/* Mensagens de Feedback */}
                {feedbackMessage && (
                    <div className={`p-4 rounded-md text-sm font-medium ${
                        feedbackMessage.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    } flex items-center justify-center shadow-md`}>
                        {feedbackMessage.message}
                    </div>
                )}

                {/* Seção de Dados Pessoais */}
                <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-300">Meus Dados</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Campo Nome */}
                        <div>
                            <label htmlFor="name" className="block text-gray-700 text-sm font-semibold mb-2">Nome:</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm shadow-sm"
                                disabled={isSubmitting}
                            />
                        </div>
                        {/* Campo Telefone */}
                        <div>
                            <label htmlFor="phone" className="block text-gray-700 text-sm font-semibold mb-2">Telefone:</label>
                            <input
                                type="text"
                                id="phone"
                                name="phone"
                                value={formatPhone(formData.phone)}
                                onChange={handleChange}
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm shadow-sm"
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* Campos não editáveis */}
                        <div>
                            <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">E-mail:</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                disabled
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-600 bg-gray-100 cursor-not-allowed sm:text-sm shadow-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="cpf" className="block text-gray-700 text-sm font-semibold mb-2">CPF:</label>
                            <input
                                type="text"
                                id="cpf"
                                name="cpf"
                                value={formatCpf(formData.cpf)}
                                disabled
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-600 bg-gray-100 cursor-not-allowed sm:text-sm shadow-sm"
                            />
                        </div>
                    </div>

                    {/* Informações adicionais não editáveis */}
                    <div className="mt-8 text-sm text-gray-600 space-y-1">
                        <p><strong>ID:</strong> {user.id}</p>
                        <p><strong>Perfil (Role):</strong> {user.role}</p>
                        <p><strong>Membro desde:</strong> {user.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : 'N/A'}</p>
                        <p><strong>Última atualização:</strong> {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('pt-BR') : 'N/A'}</p>
                    </div>
                </div>

                {/* Seção de Alterar Senha */}
                <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 mt-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-300">Alterar Senha</h2>
                    <p className="text-sm text-gray-600 mb-6">Preencha os campos abaixo **apenas** se desejar alterar sua senha.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Campo Senha Atual */}
                        <div>
                            <label htmlFor="currentPassword" className="block text-gray-700 text-sm font-semibold mb-2">Senha Atual:</label>
                            <input
                                type="password"
                                id="currentPassword"
                                name="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm shadow-sm"
                                disabled={isSubmitting}
                            />
                        </div>
                        {/* Campo Nova Senha */}
                        <div>
                            <label htmlFor="newPassword" className="block text-gray-700 text-sm font-semibold mb-2">Nova Senha:</label>
                            <input
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm shadow-sm"
                                disabled={isSubmitting}
                            />
                        </div>
                        {/* Campo Confirmar Nova Senha */}
                        <div>
                            <label htmlFor="confirmNewPassword" className="block text-gray-700 text-sm font-semibold mb-2">Confirmar Nova Senha:</label>
                            <input
                                type="password"
                                id="confirmNewPassword"
                                name="confirmNewPassword"
                                value={passwordData.confirmNewPassword}
                                onChange={handlePasswordChange}
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm shadow-sm"
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>
                </div>

                {/* Botões de Ação Global */}
                <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4 mt-8">
                    <button
                        className="w-full sm:w-auto flex justify-center py-3 px-8 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                        onClick={handleSaveAll}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                    <button
                        className="w-full sm:w-auto flex justify-center py-3 px-8 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                        onClick={handleLogout}
                        disabled={isSubmitting}
                    >
                        Sair da Conta
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MyAccount;