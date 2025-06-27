import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { ForgotPassword } from '../../service/auth'; 

const Recuperar: React.FC = () => {
    const [email, setEmail] = useState('');
    const [triedSubmit, setTriedSubmit] = useState(false);
    const navigate = useNavigate();

    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setTriedSubmit(true);
      
        if (!email || !isValidEmail(email)) {
            toast.error('Por favor, informe um email válido.');
            return;
        }
      
        try {
            await ForgotPassword(email);
            toast.success(`Email de recuperação enviado para: ${email}. Verifique sua caixa de entrada.`);
            navigate('/redefinir-senha'); 
        } catch (error: any) { 
            let message = 'Erro ao enviar o email de recuperação.';
            if (error.response?.data?.message) {
                message = error.response.data.message;
            } else if (error.message) {
                message = error.message;
            }
            toast.error(message);
        }
    };
      
    return (
        <div className="bg-gray-200 flex items-center justify-center min-h-screen">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
                <h2 className="text-gray-800 text-2xl font-semibold mb-6 text-center">Esqueceu a Senha</h2>
                <p className="text-gray-600 mb-6 text-center">
                    Digite seu email para receber as instruções de recuperação de senha.
                </p>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <i className="fas fa-envelope text-gray-400"></i>
                            </span>
                            <input
                                type="email"
                                placeholder="Seu email cadastrado"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`pl-10 pr-4 py-2 w-full rounded-lg bg-gray-100 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                    triedSubmit && !email || (triedSubmit && email && !isValidEmail(email)) ? 'border border-red-500' : ''
                                }`}
                            />
                        </div>
                        {triedSubmit && !email && (
                            <p className="text-red-500 text-sm mt-1 text-left pl-3">
                                Por favor, informe seu email.
                            </p>
                        )}
                        {triedSubmit && email && !isValidEmail(email) && (
                            <p className="text-red-500 text-sm mt-1 text-left pl-3">
                                Por favor, informe um email válido.
                            </p>
                        )}
                    </div>
                    
                    <button
                        type="submit"
                        className="w-full py-2 rounded-lg bg-red-700 hover:bg-red-800 text-white font-semibold transition-colors"
                    >
                        Enviar Instruções
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

export default Recuperar;