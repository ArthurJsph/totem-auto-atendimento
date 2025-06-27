import React, { useState, useEffect } from 'react';
import { Payment } from '../service/interfaces'; // Ajuste o caminho

// Interfaces para Props do Modal
export interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (payment: Payment) => Promise<void>;
    payment: Payment | null;
    isLoading: boolean;
    error: string | null;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSubmit, payment, isLoading, error }) => {
    const [status, setStatus] = useState(payment?.status || '');
    const [amount, setAmount] = useState(payment?.amount?.toString() || '');
    const [paymentMethod, setPaymentMethod] = useState(payment?.paymentMethod || '');

    useEffect(() => {
        if (payment) {
            setStatus(payment.status || '');
            setAmount(payment.amount?.toString() || '');
            setPaymentMethod(payment.paymentMethod || '');
        } else {
            setStatus('');
            setAmount('');
            setPaymentMethod('');
        }
    }, [payment, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!payment?.id) {
            alert("Erro: ID do pagamento não encontrado para atualização.");
            return;
        }
        if (parseFloat(amount) <= 0 || isNaN(parseFloat(amount))) { alert('O valor deve ser um número positivo.'); return; }
        if (!status.trim()) { alert('O status do pagamento é obrigatório.'); return; }
        if (!paymentMethod.trim()) { alert('O método de pagamento é obrigatório.'); return; }

        const paymentData: Payment = {
            ...payment,
            amount: parseFloat(amount),
            status: status.trim(),
            paymentMethod: paymentMethod.trim(),
        };
        await onSubmit(paymentData);
    };

    if (!isOpen || !payment) return null;

    const statusOptions = ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'];
    const paymentMethodOptions = ['CREDIT_CARD', 'DEBIT_CARD', 'CASH', 'PIX', 'BANK_TRANSFER'];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Editar Pagamento #{payment.id}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <p className="text-gray-700">ID do Pedido: <span className="font-semibold">{payment.orderId || 'N/A'}</span></p>
                    <div>
                        <label htmlFor="paymentAmount" className="block text-gray-700 text-sm font-bold mb-2">Valor:</label>
                        <input type="number" id="paymentAmount" value={amount} onChange={(e) => setAmount(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 border-gray-300" step="0.01" required />
                    </div>
                    <div>
                        <label htmlFor="paymentMethod" className="block text-gray-700 text-sm font-bold mb-2">Método de Pagamento:</label>
                        <select id="paymentMethod" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 border-gray-300" required>
                            <option value="">Selecione um método</option>
                            {paymentMethodOptions.map(method => (<option key={method} value={method}>{method}</option>))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="paymentStatus" className="block text-gray-700 text-sm font-bold mb-2">Status:</label>
                        <select id="paymentStatus" value={status} onChange={(e) => setStatus(e.target.value)}
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

export default PaymentModal;