import React, { useState, useEffect } from 'react';
import { OrderItem } from '../service/interfaces'; // Ajuste o caminho

// Interfaces para Props do Modal
export interface OrderItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (orderItem: OrderItem) => Promise<void>;
    orderItem: OrderItem | null;
    isLoading: boolean;
    error: string | null;
}

const OrderItemModal: React.FC<OrderItemModalProps> = ({ isOpen, onClose, onSubmit, orderItem, isLoading, error }) => {
    const [name, setName] = useState(orderItem?.name || '');
    const [price, setPrice] = useState(orderItem?.price?.toString() || '');
    const [quantity, setQuantity] = useState(orderItem?.quantity?.toString() || '');
    const [status, setStatus] = useState(orderItem?.status || '');

    useEffect(() => {
        if (orderItem) {
            setName(orderItem.name || '');
            setPrice(orderItem.price?.toString() || '');
            setQuantity(orderItem.quantity?.toString() || '');
            setStatus(orderItem.status || '');
        } else {
            setName('');
            setPrice('');
            setQuantity('');
            setStatus('');
        }
    }, [orderItem, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderItem?.id) {
            alert("Erro: ID do item do pedido não encontrado para atualização.");
            return;
        }
        if (!name.trim()) { alert('O nome do item é obrigatório.'); return; }
        if (parseFloat(price) <= 0 || isNaN(parseFloat(price))) { alert('O preço deve ser um número positivo.'); return; }
        if (parseInt(quantity) <= 0 || isNaN(parseInt(quantity))) { alert('A quantidade deve ser um número positivo.'); return; }
        if (!status.trim()) { alert('O status do item é obrigatório.'); return; }

        const orderItemData: OrderItem = {
            ...orderItem,
            name: name.trim(),
            price: parseFloat(price),
            quantity: parseInt(quantity),
            status: status.trim()
        };
        await onSubmit(orderItemData);
    };

    if (!isOpen || !orderItem) return null;

    const statusOptions = ['PENDING', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED'];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Editar Item do Pedido #{orderItem.id}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <p className="text-gray-700">ID do Pedido: <span className="font-semibold">{orderItem.orderId || 'N/A'}</span></p>
                    <p className="text-gray-700">ID do Produto: <span className="font-semibold">{orderItem.productId || 'N/A'}</span></p>
                    <div>
                        <label htmlFor="orderItemName" className="block text-gray-700 text-sm font-bold mb-2">Nome do Item:</label>
                        <input type="text" id="orderItemName" value={name} onChange={(e) => setName(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 border-gray-300" required />
                    </div>
                    <div>
                        <label htmlFor="orderItemPrice" className="block text-gray-700 text-sm font-bold mb-2">Preço:</label>
                        <input type="number" id="orderItemPrice" value={price} onChange={(e) => setPrice(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 border-gray-300" step="0.01" required />
                    </div>
                    <div>
                        <label htmlFor="orderItemQuantity" className="block text-gray-700 text-sm font-bold mb-2">Quantidade:</label>
                        <input type="number" id="orderItemQuantity" value={quantity} onChange={(e) => setQuantity(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 border-gray-300" required />
                    </div>
                    <div>
                        <label htmlFor="orderItemStatus" className="block text-gray-700 text-sm font-bold mb-2">Status:</label>
                        <select id="orderItemStatus" value={status} onChange={(e) => setStatus(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 border-gray-300" required>
                            <option value="">Selecione um status</option>
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
                            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    </div>
                </form>
                {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
            </div>
        </div>
    );
};

export default OrderItemModal;