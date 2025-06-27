import React, { useState, useEffect } from 'react';
import { User } from '../service/interfaces'; // Ajuste o caminho

// Interfaces para Props do Modal
export interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (user: User) => Promise<void>;
    user: User | null;
    isLoading: boolean;
    error: string | null;
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, onSubmit, user, isLoading, error }) => {
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [role, setRole] = useState<User['role']>(user?.role || 'CLIENT');

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
            setRole(user.role || 'CLIENT');
        } else {
            setName('');
            setEmail('');
            setRole('CLIENT');
        }
    }, [user, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !email.trim()) { alert('Nome e Email são obrigatórios.'); return; }
        if (!user?.id) { alert('Erro: ID do usuário não encontrado para atualização.'); return; }

        const userData: User = {
            ...user, // Mantém outras propriedades do usuário
            name: name.trim(),
            email: email.trim(),
            role
        };
        await onSubmit(userData);
    };

    if (!isOpen || !user) return null;

    const roleOptions: User['role'][] = ['CLIENT', 'MANAGER', 'ADMIN'];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Editar Usuário #{user.id}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="userName" className="block text-gray-700 text-sm font-bold mb-2">Nome:</label>
                        <input type="text" id="userName" value={name} onChange={(e) => setName(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 border-gray-300" required />
                    </div>
                    <div>
                        <label htmlFor="userEmail" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                        <input type="email" id="userEmail" value={email} onChange={(e) => setEmail(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 border-gray-300" required />
                    </div>
                    <div>
                        <label htmlFor="userRole" className="block text-gray-700 text-sm font-bold mb-2">Função (Role):</label>
                        <select id="userRole" value={role} onChange={(e) => setRole(e.target.value as User['role'])}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 border-gray-300" required>
                            {roleOptions.map(option => (<option key={option} value={option}>{option}</option>))}
                        </select>
                    </div>
                    <div className="flex justify-end gap-4 mt-6">
                        <button type="button" onClick={onClose}
                            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition" disabled={isLoading}>
                            Cancelar
                        </button>
                        <button type="submit"
                            className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition" disabled={isLoading}>
                            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    </div>
                </form>
                {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
            </div>
        </div>
    );
};

export default UserModal;