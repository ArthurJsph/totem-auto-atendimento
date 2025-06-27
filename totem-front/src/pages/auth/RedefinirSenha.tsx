import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom'; 
import { resetPassword } from '../../service/auth'; 

const RedefinirSenha: React.FC = () => {
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [triedSubmit, setTriedSubmit] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const urlToken = params.get('token');
        if (urlToken) {
            setToken(urlToken);
        }
    }, [location.search]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setTriedSubmit(true);

        if (!token) {
            toast.error('Token de redefinição não encontrado. Por favor, use o link completo do email.');
            return;
        }

        if (!newPassword || newPassword.length < 6) { 
            toast.error('A nova senha deve ter no mínimo 6 caracteres.');
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('As senhas não coincidem.');
            return;
        }
      
        try {
            // Usamos a função resetPassword importada
            await resetPassword(token, newPassword);
            toast.success('Sua senha foi redefinida com sucesso! Você já pode fazer login.');
            navigate('/login'); // Redireciona para a página de login após o sucesso
        } catch (error: unknown) {
            let message = 'Ocorreu um erro ao redefinir a senha. Por favor, tente novamente.';
            if (error && typeof error === 'object' && 'response' in error && 'response' in (error as any)) {
                const errorResponse = (error as any).response;
                if (errorResponse && typeof errorResponse === 'object' && 'data' in errorResponse && 'data' in errorResponse) {
                    const errorData = errorResponse.data;
                    if (errorData && typeof errorData === 'object' && 'message' in errorData) {
                        message = errorData.message;
                    }
                }
            }
            toast.error(message);
        }
    };
      
    return (
        <div className="bg-gray-200 flex items-center justify-center min-h-screen">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
                <h2 className="text-gray-800 text-2xl font-semibold mb-6 text-center">Redefinir Senha</h2>
                <p className="text-gray-600 mb-6 text-center">
                    Insira o token recebido por e-mail e sua nova senha.
                </p>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="token" className="block text-gray-700 text-sm font-bold mb-2">
                            Token de Redefinição:
                        </label>
                        <input
                            type="text"
                            id="token"
                            placeholder="Seu token de redefinição"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                triedSubmit && !token ? 'border-red-500' : ''
                            }`}
                            readOnly={!!token} 
                        />
                        {triedSubmit && !token && (
                            <p className="text-red-500 text-xs italic mt-1">Por favor, informe o token.</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="newPassword" className="block text-gray-700 text-sm font-bold mb-2">
                            Nova Senha:
                        </label>
                        <input
                            type="password"
                            id="newPassword"
                            placeholder="Mínimo 6 caracteres"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                triedSubmit && (!newPassword || newPassword.length < 6) ? 'border-red-500' : ''
                            }`}
                        />
                        {triedSubmit && (!newPassword || newPassword.length < 6) && (
                            <p className="text-red-500 text-xs italic mt-1">A senha deve ter no mínimo 6 caracteres.</p>
                        )}
                    </div>

                    <div className="mb-6">
                        <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
                            Confirmar Nova Senha:
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            placeholder="Confirme sua nova senha"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${
                                triedSubmit && (newPassword !== confirmPassword || !confirmPassword) ? 'border-red-500' : ''
                            }`}
                        />
                        {triedSubmit && (newPassword !== confirmPassword || !confirmPassword) && (
                            <p className="text-red-500 text-xs italic">As senhas não coincidem ou estão vazias.</p>
                        )}
                    </div>
                    
                    <button
                        type="submit"
                        className="w-full py-2 rounded-lg bg-red-700 hover:bg-red-800 text-white font-semibold transition-colors"
                    >
                        Redefinir Senha
                    </button>
                </form>
                
                <a 
                    href="/login" 
                    className="block mt-6 text-sm text-gray-600 text-center hover:text-red-800 transition-colors"
                >
                    Voltar para o login
                </a>
            </div>
        </div>
    );
};

export default RedefinirSenha;