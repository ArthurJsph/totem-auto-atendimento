import { useEffect, useState } from 'react';
import { getAllProducts } from '../../service/product';
import { Product } from '../../service/interfaces';


const images = import.meta.glob('../../assets/*', { eager: true });

const categories = [
  { id: 0, label: 'Todos' },         // ID 0 = sem filtro
  { id: 1, label: 'Bebidas' },
  { id: 2, label: 'Sobremesas' },
  { id: 3, label: 'Lanches' },
  { id: 4, label: 'Almoço' },
];

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<number>(0); 

  useEffect(() => {
    getAllProducts()
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erro ao carregar produtos:', error);
        setProducts([]);
        setLoading(false);
      });
  }, []);

  // Filtra os produtos de acordo com a categoria selecionada
  const filteredProducts =
    categoryFilter === 0
      ? products
      : products.filter((product) =>
          product.menuCategoryId != null &&
          Number(product.menuCategoryId) === categoryFilter
        );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Cardápio</h1>

      {/* Filtros de categoria */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex gap-3 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-4 py-2 rounded-full border text-sm font-medium transition ${
                categoryFilter === cat.id
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-orange-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de produtos */}
      {loading ? (
        <p>Carregando produtos...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducts.length === 0 ? (
            <p>Nenhum produto encontrado.</p>
          ) : (
            filteredProducts.map((product: Product) => {
              const imgSrc = (images[`../../assets/${product.imageUrl}`] as { default: string })?.default;

              return (
                <div key={product.id} className="border rounded p-4 shadow hover:shadow-lg transition">
                  <img
                    src={imgSrc || ''}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded mb-4"
                  />
                  <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                  <p className="text-gray-600 mb-2">{product.description}</p>
                  <p className="font-bold text-lg">
                    R$ {product.price !== undefined ? product.price.toFixed(2) : '--'}
                  </p>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
