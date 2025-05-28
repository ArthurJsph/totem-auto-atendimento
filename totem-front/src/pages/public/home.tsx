import { useEffect, useState } from 'react';
import { getAllProducts } from '../../service/product';

import { Product } from '../../service/interfaces';

import { produtos } from './produto'; // Importa os produtos locais


const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);


  // Filtros (mantidos)

  const [categoryFilter, setCategoryFilter] = useState('Todos');

  useEffect(() => {
    getAllProducts()
      .then((data) => {
        // Junta os produtos da API com os do arquivo produto.tsx
        // Se quiser evitar duplicidade, pode filtrar por id
        const todosProdutos = [
          ...data,
          ...produtos.filter(
            (p) => !data.some((apiProd: Product) => apiProd.id === p.id)
          ),
        ];
        setProducts(todosProdutos);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        // Se a API falhar, mostra só os produtos locais
        setProducts(
          produtos.map((p) => ({
            id: p.id,
            name: p.nome,
            description: p.descricao,
            imageUrl: p.imagem,
            price: p.preco,
          }))
        );
        setLoading(false);
      });
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Cardápio</h1>

      {/* Filtros */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex gap-3 flex-wrap">
          {['Todos', 'Bebidas', 'Sobremesas', 'Lanches', 'Almoço'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-full border text-sm font-medium transition ${
                categoryFilter === cat
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-orange-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        {/* Removido o select de preços */}
      </div>

      {/* Lista de produtos */}
      {loading ? (
        <p>Carregando produtos...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.length === 0 && <p>Nenhum produto encontrado.</p>}
          {products.map((product: Product) => (
            <div key={product.id} className="border rounded p-4 shadow hover:shadow-lg transition">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-48 object-cover rounded mb-4"
              />

              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              <p className="text-gray-600 mb-2">{product.description}</p>
              <p className="font-bold text-lg">
                R$ {product.price !== undefined ? product.price.toFixed(2) : '--'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
