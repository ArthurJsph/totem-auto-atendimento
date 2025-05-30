import { useEffect, useState } from 'react';
import { getAllOrders } from '../../service/order';
import { getAllProducts } from '../../service/product';
import { Order, Product } from '../../service/interfaces';

const Pedido = () => {
  const [step, setStep] = useState(1);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Dados do cliente e pagamento (igual ao seu código)
  // ...

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [ordersData, productsData] = await Promise.all([getAllOrders(), getAllProducts()]);
        setOrders(ordersData);
        setProducts(productsData);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar pedido e produtos:', error);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Combinar orders com produtos para renderizar
  // Para cada order, encontrar o produto correspondente para mostrar nome, preço e imagem
  const pedido = orders.map(order => {
    const produto = products.find(p => String(p.id) === String(order.productId));
    return {
      id: order.id,
      nome: produto?.name || 'Produto não encontrado',
      descricao: produto?.description || '',
      quantidade: order.quantity || 0,
      precoUnitario: produto?.price || 0,
      imagem: produto?.imageUrl || '', // Ajuste conforme campo correto no produto
    };
  });

  const totalPedido = pedido.reduce(
    (acc, item) => acc + item.precoUnitario * item.quantidade,
    0
  );

  // Validadores, handlers, funções formatadoras continuam iguais (cliente, pagamento)...

  // JSX continua igual, só muda o pedido para o que vem do backend

  if (loading) {
    return <p>Carregando pedido...</p>;
  }

  return (
    <>
      <div className="max-w-full mx-auto h-full flex flex-col">
        {step === 1 && (
          <div className="flex flex-col h-full">
            <h2 className="text-3xl font-bold mb-6">Confirme seu pedido</h2>
            <div className="flex flex-grow border border-gray-300 rounded-lg overflow-hidden shadow-sm">
              <section className="w-2/3 overflow-auto p-10 bg-gray-50">
                <ul className="divide-y divide-gray-300">
                  {pedido.length === 0 ? (
                    <p>Nenhum item no pedido.</p>
                  ) : (
                    pedido.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center py-8 space-x-10"
                      >
                        <img
                          src={item.imagem}
                          alt={item.nome}
                          className="w-28 h-28 rounded-lg object-cover flex-shrink-0 border border-gray-300"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-2xl text-gray-900">{item.nome}</p>
                          <p className="text-lg text-gray-700 mt-2">Quantidade: {item.quantidade}</p>
                          <p className="text-lg text-gray-700 mt-1">Preço unitário: R$ {item.precoUnitario.toFixed(2)}</p>
                        </div>
                        <div className="text-right w-44 font-bold text-2xl text-gray-900">
                          R$ {(item.precoUnitario * item.quantidade).toFixed(2)}
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </section>
              <aside className="w-1/3 bg-yellow-50 p-10 flex flex-col justify-between border-l border-yellow-300">
                <div>
                  <p className="text-3xl font-extrabold text-yellow-700 mb-8">
                    Total: R$ {totalPedido.toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-5 rounded-lg shadow-lg transition"
                  disabled={pedido.length === 0}
                >
                  Continuar para dados do cliente
                </button>
              </aside>
            </div>
          </div>
        )}
      </div>
      {/* Formulário dos dados do cliente e demais steps continuam igual */}
      {/* ... */}
    </>
  );
};

export default Pedido;
