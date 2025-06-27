import React, { useState, useEffect } from 'react';
import { Restaurant } from '../service/interfaces'; // Ajuste o caminho

// Interfaces para Props do Modal
export interface RestaurantModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (restaurant: Restaurant) => Promise<void>;
    restaurant: Restaurant | null;
    isLoading: boolean;
    error: string | null;
}

const RestaurantModal: React.FC<RestaurantModalProps> = ({ isOpen, onClose, onSubmit, restaurant, isLoading, error }) => {
    const [name, setName] = useState(restaurant?.name || '');
    const [address, setAddress] = useState(restaurant?.address || '');
    const [phone, setPhone] = useState(restaurant?.phone || '');
    const [email, setEmail] = useState(restaurant?.email || '');

    useEffect(() => {
        if (restaurant) {
            setName(restaurant.name || '');
            setAddress(restaurant.address || '');
            setPhone(restaurant.phone || '');
            setEmail(restaurant.email || '');
        } else {
            setName('');
            setAddress('');
            setPhone('');
            setEmail('');
        }
    }, [restaurant, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) { alert('O nome do restaurante é obrigatório.'); return; }
        if (!email.trim()) { alert('O email do restaurante é obrigatório.'); return; }

        const restaurantData: Restaurant = {
            id: restaurant?.id,
            name: name.trim(),
            address: address.trim() || undefined,
            phone: phone.trim() || undefined,
            email: email.trim(),
        };
        await onSubmit(restaurantData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">{restaurant ? 'Editar Restaurante' : 'Adicionar Novo Restaurante'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="restaurantName" className="block text-gray-700 text-sm font-bold mb-2">Nome do Restaurante:</label>
                        <input type="text" id="restaurantName" value={name} onChange={(e) => setName(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 border-gray-300" required />
                    </div>
                    <div>
                        <label htmlFor="restaurantAddress" className="block text-gray-700 text-sm font-bold mb-2">Endereço:</label>
                        <input type="text" id="restaurantAddress" value={address} onChange={(e) => setAddress(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 border-gray-300" />
                    </div>
                    <div>
                        <label htmlFor="restaurantPhone" className="block text-gray-700 text-sm font-bold mb-2">Telefone:</label>
                        <input type="text" id="restaurantPhone" value={phone} onChange={(e) => setPhone(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 border-gray-300" />
                    </div>
                    <div>
                        <label htmlFor="restaurantEmail" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                        <input type="email" id="restaurantEmail" value={email} onChange={(e) => setEmail(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 border-gray-300" required />
                    </div>
                    <div className="flex justify-end gap-4 mt-6">
                        <button type="button" onClick={onClose}
                            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition" disabled={isLoading}>
                            Cancelar
                        </button>
                        <button type="submit"
                            className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition" disabled={isLoading}>
                            {isLoading ? 'Salvando...' : (restaurant ? 'Salvar Alterações' : 'Adicionar Restaurante')}
                        </button>
                    </div>
                </form>
                {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
            </div>
        </div>
    );
};

export default RestaurantModal;