import React, { useState, useEffect } from 'react';
import { Product, MenuCategory } from '../service/interfaces'; // Ajuste o caminho conforme necessário

// Interfaces para Props do Modal
export interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (product: Product) => Promise<void>;
    product: Product | null;
    isLoading: boolean;
    error: string | null;
    menuCategories: MenuCategory[];
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, onSubmit, product, isLoading, error, menuCategories }) => {
    const [name, setName] = useState(product?.name || '');
    const [description, setDescription] = useState(product?.description || '');
    const [price, setPrice] = useState(product?.price?.toString() || '');
    const [imageUrl, setImageUrl] = useState(product?.imageUrl || '');
    const [ingredients, setIngredients] = useState<string[]>(product?.ingredients || []);
    const [amount, setAmount] = useState(product?.amount?.toString() || '0');
    const [menuCategoryId, setMenuCategoryId] = useState(product?.menuCategoryId?.toString() || (menuCategories.length > 0 ? menuCategories[0].id?.toString() : ''));

    useEffect(() => {
        if (product) {
            setName(product.name || '');
            setDescription(product.description || '');
            setPrice(product.price?.toString() || '');
            setImageUrl(product.imageUrl || '');
            setIngredients(product.ingredients || []);
            setAmount(product.amount?.toString() || '0');
            setMenuCategoryId(product.menuCategoryId?.toString() || (menuCategories.length > 0 ? menuCategories[0].id?.toString() : ''));
        } else {
            setName('');
            setDescription('');
            setPrice('');
            setImageUrl('');
            setIngredients([]);
            setAmount('0');
            setMenuCategoryId(menuCategories.length > 0 ? menuCategories[0].id?.toString() || '' : '');
        }
    }, [product, isOpen, menuCategories]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validação básica
        if (!name.trim()) { alert('O nome do produto é obrigatório.'); return; }
        if (parseFloat(price) <= 0 || isNaN(parseFloat(price))) { alert('O preço deve ser um número positivo.'); return; }
        if (parseInt(amount) < 0 || isNaN(parseInt(amount))) { alert('A quantidade em estoque deve ser um número não negativo.'); return; }
        if (!menuCategoryId || parseInt(menuCategoryId) <= 0 || isNaN(parseInt(menuCategoryId))) { alert('Selecione uma categoria válida.'); return; }

        const productData: Product = {
            id: product?.id,
            name: name.trim(),
            description: description.trim(),
            price: parseFloat(price),
            imageUrl: imageUrl.trim() || undefined,
            ingredients: ingredients,
            amount: parseInt(amount),
            restaurantId: 1, // Assumindo valor fixo 1
            menuCategoryId: parseInt(menuCategoryId)
        };
        await onSubmit(productData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">{product ? 'Editar Produto' : 'Adicionar Novo Produto'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Nome do Produto:</label>
                        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 border-gray-300" required />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Descrição:</label>
                        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 border-gray-300 h-24" required></textarea>
                    </div>
                    <div>
                        <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">Preço:</label>
                        <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 border-gray-300" step="0.01" required />
                    </div>
                    <div>
                        <label htmlFor="ingredients" className="block text-gray-700 text-sm font-bold mb-2">Ingredientes (separados por vírgula):</label>
                        <input type="text" id="ingredients" value={ingredients.join(', ')} onChange={(e) => setIngredients(e.target.value.split(',').map(s => s.trim()))}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 border-gray-300" />
                    </div>
                    <div>
                        <label htmlFor="amount" className="block text-gray-700 text-sm font-bold mb-2">Quantidade em Estoque:</label>
                        <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 border-gray-300" required />
                    </div>
                    <div>
                        <label htmlFor="menuCategoryId" className="block text-gray-700 text-sm font-bold mb-2">Categoria do Menu:</label>
                        <select id="menuCategoryId" value={menuCategoryId} onChange={(e) => setMenuCategoryId(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 border-gray-300" required>
                            {menuCategories.map(cat => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="imageUrl" className="block text-gray-700 text-sm font-bold mb-2">URL da Imagem:</label>
                        <input type="text" id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="https://example.com/image.jpg"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-50 border-gray-300" />
                    </div>
                    <div className="flex justify-end gap-4 mt-6">
                        <button type="button" onClick={onClose}
                            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition" disabled={isLoading}>
                            Cancelar
                        </button>
                        <button type="submit"
                            className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition" disabled={isLoading}>
                            {isLoading ? 'Salvando...' : (product ? 'Salvar Alterações' : 'Adicionar Produto')}
                        </button>
                    </div>
                </form>
                {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
            </div>
        </div>
    );
};

export default ProductModal;