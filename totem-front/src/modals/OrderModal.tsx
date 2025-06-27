import React, { useState, useEffect } from 'react';
import { Order } from '../service/interfaces'; // Ajuste o caminho

// Função auxiliar (mantenha aqui se for usada apenas neste modal)
const formatOrderDate = (dateInput: string | Date | undefined): string => {
    if (!dateInput) return 'N/A';
    try {
        const date = new Date(dateInput);
        if (isNaN(date.getTime())) return 'Data Inválida';
        return date.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
    } catch (e) {
        console.error("Erro ao formatar data:", e);
        return 'Erro na Data';
    }
};

// Interfaces para Props do Modal
export interface OrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (orderId: string | number, newStatus: Order['status']) => Promise<void>;
    order: Order | null;
    isLoading: boolean;
    error: string | null;
}

const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose, onSubmit, order, isLoading, error }) => {
    const [status, setStatus] = useState(order?.status || '');

    useEffect(() => {
        if (order) {
            setStatus(order.status || '');
        } else {
            setStatus('');
        }
    }, [order, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (order?.id) {
            await onSubmit(order.id, status as Order['status']);
        } else {
            alert("Erro: ID do pedido não encontrado para atualização.");
        }
    };

    if (!isOpen || !order) return null;

    const statusOptions: Order['status'][] = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED'];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Atualizar Status do Pedido #{order.id}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <p className="text-gray-700">Cliente (ID): <span className="font-semibold">{order.userId || 'N/A'}</span></p>
                    <p className="text-gray-700">Total: <span className="font-semibold">R$ {order.total ? order.total.toFixed(2) : '0.00'}</span></p>
                    <p className="text-gray-700">Data do Pedido: <span className="font-semibold">{formatOrderDate(order.createdAt)}</span></p>
                    <p className="text-gray-700 mb-4">Itens: <span className="font-semibold">{order.items ? order.items.map(item => `${item.qty}x ${item.name}`).join(', ') : 'N/A'}</span></p>

                    <div>
                        <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">Novo Status:</label>
                        <select id="status" value={status} onChange={(e) => setStatus((e.target.value as Order['status']) || '')}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 border-gray-300" required>
                            {statusOptions.map(option => (<option key={option} value={option}>{option}</option>))}
                        </select>
                    </div>
                    <div className="flex justify-end gap-4 mt-6">
                        <button type="button" onClick={onClose}
                            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition" disabled={isLoading}>
                            Cancelar
                        </button>
                        <button type="submit"
                            className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition" disabled={isLoading}>
                            {isLoading ? 'Salvando...' : 'Atualizar Status'}
                        </button>
                    </div>
                </form>
                {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
            </div>
        </div>
    );
};

export default OrderModal;