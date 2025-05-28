import { useEffect, useState } from 'react';
import { getAllProducts } from '../../service/product';
import { Product } from '../../service/interfaces';

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('Todos');
  const [priceFilter, setPriceFilter] = useState('Todos');

  useEffect(() => {
    getAllProducts()
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Cardápio</h1>

{/* Filtros estáticos atualizados */}
<div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center">
  {/* Botões de categoria */}
  <div className="flex gap-3 flex-wrap">
    {['Todos', 'Bebidas', 'Sobremesas', 'Lanches'].map((cat) => (
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

  {/* Select de preço */}
  <select
    className="border rounded px-3 py-2 mt-2 md:mt-0"
    value={priceFilter}
    onChange={(e) => setPriceFilter(e.target.value)}
  >
    <option>Preço</option>
    <option>Até R$5</option>
    <option>R$5 a R$10</option>
    <option>Acima de R$10</option>
  </select>
</div>

      {/* Lista de produtos */}
      {loading ? (
        <p>Carregando produtos...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.length === 0 && <p>Nenhum produto encontrado.</p>}
          {products.map((product) => (
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
