import React, { useState, useMemo } from 'react'; // Removido useEffect e useCallback, agora no hook
import { useAuth } from '../../hooks/useAuth';
import { Product } from '../../service/interfaces'; // Importe Product
import { useAdmin } from '../../hooks/useAdmin'; // Importe o useAdmin hook

// Importe o modal de produto específico para o gerente
import ProductModalForManager from '../../modals/ProductModalForManager'; // Ajuste o caminho se necessário

const ManagerDashboard: React.FC = () => {
    const { authorities } = useAuth();
    const {
        data, // Contém todos os dados (products, orders, etc.)
        loadingError, // Contém o estado de loading e erro para cada tipo
        handleAddEditProduct, // Funções CRUD para produtos do hook
        handleDeleteProduct
    } = useAdmin(); // Use o hook useAdmin

    // Estados para controle do modal
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);

    // --- Estados para o Filtro (permanecem aqui, pois são específicos da UI do dashboard) ---
    const [filterName, setFilterName] = useState('');
    const [filterMinPrice, setFilterMinPrice] = useState('');
    const [filterMaxPrice, setFilterMaxPrice] = useState('');

    const hasManagerAccess = authorities.includes('MANAGER') || authorities.includes('ADMIN');

    // Funções de submit para o modal de produto, que chamam as do hook
    const handleSubmitProduct = async (productData: Product) => {
        try {
            await handleAddEditProduct(productData);
            setIsProductModalOpen(false);
            setSelectedProduct(null);
        } catch (err) {
            // O erro já é tratado e setado dentro do hook, o modal o exibirá
            console.error("Erro ao salvar produto no ManagerDashboard:", err);
        }
    };

    // Lógica de filtragem otimizada com useMemo
    const filteredProducts = useMemo(() => {
        if (!hasManagerAccess) {
            return []; // Retorna vazio se não tiver acesso
        }
        return data.products.filter(product => { // Usa data.products do hook
            const matchesName = product.name?.toLowerCase().includes(filterName.toLowerCase()) ||
                                product.description?.toLowerCase().includes(filterName.toLowerCase());

            const price = product.price ?? 0;
            const minPrice = parseFloat(filterMinPrice);
            const maxPrice = parseFloat(filterMaxPrice);

            const matchesMinPrice = isNaN(minPrice) || price >= minPrice;
            const matchesMaxPrice = isNaN(maxPrice) || price <= maxPrice;

            return matchesName && matchesMinPrice && matchesMaxPrice;
        });
    }, [data.products, filterName, filterMinPrice, filterMaxPrice, hasManagerAccess]); // Adicionado hasManagerAccess como dependência

    // Condição para renderizar o dashboard (opcional, mas boa prática)
    if (!hasManagerAccess) {
        return (
            <div className="min-h-screen bg-gray-100 p-6 md:p-10 flex items-center justify-center">
                <p className="text-xl text-red-600 font-semibold">Acesso Negado: Você não tem permissão para acessar este painel.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6 md:p-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-extrabold text-gray-900">Dashboard do Gerente</h1>
            </div>

            <p className="text-lg text-gray-700 mb-8">
                Bem-vindo, Gerente! Aqui você pode gerenciar os produtos.
            </p>

            {/* --- Seção de Gerenciamento de Produtos --- */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-10">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4 sm:mb-0">Gerenciamento de Produtos</h3>
                    <button
                        onClick={() => { setSelectedProduct(null); setIsProductModalOpen(true); }}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition w-full sm:w-auto"
                    >
                        Adicionar Produto
                    </button>
                </div>

                {/* --- Filtros --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                        <label htmlFor="filterName" className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Nome/Descrição:</label>
                        <input
                            type="text"
                            id="filterName"
                            value={filterName}
                            onChange={(e) => setFilterName(e.target.value)}
                            placeholder="Nome ou descrição do produto"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="filterMinPrice" className="block text-sm font-medium text-gray-700 mb-1">Preço Mínimo:</label>
                        <input
                            type="number"
                            id="filterMinPrice"
                            value={filterMinPrice}
                            onChange={(e) => setFilterMinPrice(e.target.value)}
                            placeholder="R$ 0.00"
                            step="0.01"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="filterMaxPrice" className="block text-sm font-medium text-gray-700 mb-1">Preço Máximo:</label>
                        <input
                            type="number"
                            id="filterMaxPrice"
                            value={filterMaxPrice}
                            onChange={(e) => setFilterMaxPrice(e.target.value)}
                            placeholder="R$ 999.99"
                            step="0.01"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {loadingError.product.loading && <p className="text-center text-blue-600 text-lg">Carregando produtos...</p>}
                {loadingError.product.error && <p className="text-red-500 text-center text-lg">{loadingError.product.error}</p>}

                {!loadingError.product.loading && !loadingError.product.error && (
                    filteredProducts.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white rounded-lg overflow-hidden border border-gray-200">
                                <thead className="bg-gray-200 text-gray-700">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">ID</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">Nome</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">Descrição</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">Preço</th>
                                        <th className="px-4 py-3 text-center text-sm font-semibold uppercase tracking-wider">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredProducts.map((product) => (
                                        <tr key={product.id}>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800">{product.id}</td>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800 font-medium">{product.name}</td>
                                            <td className="px-4 py-2 text-sm text-gray-600 max-w-xs overflow-hidden text-ellipsis">{product.description}</td>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800">R$ {(product.price ?? 0).toFixed(2)}</td>
                                            <td className="px-4 py-2 whitespace-nowrap text-center">
                                                <button
                                                    onClick={() => { setSelectedProduct(product); setIsProductModalOpen(true); }}
                                                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-md text-sm transition mr-2"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProduct(product.id as number)}
                                                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md text-sm transition"
                                                >
                                                    Excluir
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-center text-gray-600 mt-4">Nenhum produto encontrado com os filtros aplicados.</p>
                    )
                )}
            </div>

            {/* Modal de Produto para Gerente */}
            <ProductModalForManager
                isOpen={isProductModalOpen}
                onClose={() => { setIsProductModalOpen(false); }} // O erro é tratado no hook
                onSubmit={handleSubmitProduct}
                product={selectedProduct}
                isLoading={loadingError.product.loading}
                error={loadingError.product.error}
            />
        </div>
    );
};

export default ManagerDashboard;