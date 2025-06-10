import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../hooks';

const images = import.meta.glob('../../assets/*', { eager: true });

const Home: React.FC = () => {
  const {
    loading,
    categoryFilter,
    setCategoryFilter,
    filteredProducts,
    isCartOpen,
    setIsCartOpen,
    cartItems,
    addToCart,
    getCartTotal,
    handleUpdateCartItemQuantity,
    categories,
  } = useProducts();

  return (
    <div className="container mx-auto p-4 relative">
      <h1 className="text-3xl font-bold mb-6">Cardápio</h1>
      <div className="fixed top-28 right-4 z-50">
        <button
          onClick={() => setIsCartOpen(!isCartOpen)}
          className="bg-orange-500 hover:bg-orange-700 text-white p-3 rounded-full shadow-lg flex items-center space-x-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5H1M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span className="font-semibold">
            {cartItems.reduce((acc, item) => acc + item.quantity, 0)} Itens
          </span>
          <span className="ml-2">R$ {getCartTotal().toFixed(2)}</span>
        </button>

        {isCartOpen && (
          <div className="absolute top-0 right-0 mt-0 w-80 bg-white border border-gray-300 rounded-lg shadow-xl p-4 overflow-y-auto max-h-[80vh]">
            <h3 className="text-xl font-bold mb-4">Seu Carrinho</h3>
            {cartItems.length === 0 ? (
              <p>Seu carrinho está vazio.</p>
            ) : (
              <>
                <ul className="space-y-4">
                  {cartItems.map((item) => (
                    <li key={item.id} className="flex items-center space-x-3 border-b pb-2">
                      <img
                        src={(images[`../../assets/${item.imageUrl}`] as { default: string })?.default || ''}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{item.name}</p>
                        <p className="text-gray-600">R$ {item.price?.toFixed(2)}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <button
                            onClick={() => handleUpdateCartItemQuantity(item, -1)}
                            className="bg-gray-200 text-gray-700 px-2 py-1 rounded"
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateCartItemQuantity(item, 1)}
                            className="bg-gray-200 text-gray-700 px-2 py-1 rounded"
                          >
                            +
                          </button>
                          <button
                            onClick={() => {
                              if (typeof item.id === 'number') handleUpdateCartItemQuantity(item, -item.quantity); // Remove todos do item
                            }}
                            className="ml-auto text-red-500 hover:text-red-700 text-sm"
                          >
                            Remover
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 pt-4 border-t border-gray-300 flex justify-between items-center font-bold text-lg">
                  <span>Total:</span>
                  <span>R$ {getCartTotal().toFixed(2)}</span>
                </div>
                <Link to="/pedido">
                  <button
                    className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg"
                    disabled={cartItems.length === 0}
                  >
                    Ir para o Pedido
                  </button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
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

      {loading ? (
        <p>Carregando produtos...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducts.length === 0 ? (
            <p>Nenhum produto encontrado.</p>
          ) : (
            filteredProducts.map((product) => {
              const imgSrc = (images[`../../assets/${product.imageUrl}`] as { default: string })?.default;
              const itemInCart = cartItems.find((item) => item.id === product.id);

              return (
                <div key={product.id} className="border rounded p-4 shadow hover:shadow-lg transition">
                  <img
                    src={imgSrc || ''}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded mb-4"
                  />
                  <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                  <p className="text-gray-600 mb-2">{product.description}</p>
                  <p className="font-bold text-lg mb-4">
                    R$ {product.price !== undefined ? product.price.toFixed(2) : '--'}
                  </p>
                  {itemInCart ? (
                    <div className="flex items-center justify-between mt-auto">
                      <button
                        onClick={() => handleUpdateCartItemQuantity(itemInCart, -1)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded"
                      >
                        -
                      </button>
                      <span className="font-bold text-lg">{itemInCart.quantity}</span>
                      <button
                        onClick={() => handleUpdateCartItemQuantity(itemInCart, 1)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(product)}
                      className="w-full bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 rounded-lg transition"
                    >
                      Adicionar ao Carrinho
                    </button>
                  )}
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