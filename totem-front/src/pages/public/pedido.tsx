// src/pages/Pedido.tsx (seu código atualizado, com foco no botão)
import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom'; // Importe useNavigate

const Pedido = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const { cartItems, getCartTotal } = useCart();

  const pedido = cartItems.map(item => {
    return {
      id: item.id,
      nome: item.name || 'Produto não encontrado',
      descricao: item.description || '',
      quantidade: item.quantity,
      precoUnitario: item.price || 0,
      imagem: item.imageUrl || '',
    };
  });

  const totalPedido = getCartTotal();

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
                  // *** AQUI É A PARTE QUE REDIRECIONA ***
                  onClick={() => navigate("/pedido/pagamento")}
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
    </>
  );
};

export default Pedido;