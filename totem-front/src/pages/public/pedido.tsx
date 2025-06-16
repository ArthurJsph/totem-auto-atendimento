// src/pages/Pedido.tsx
import React from 'react';
import { useOrder } from '../../hooks';

const Pedido: React.FC = () => {
  const {
    pedido,
    totalPedido,
    isCartEmpty,
    navigateToHome,
    navigateToPayment,
  } = useOrder();

  return (
    // Adicionado padding horizontal e vertical para o container principal para evitar que o conteúdo fique colado nas bordas
    <div className="max-w-full mx-auto px-4 py-8 md:px-8 lg:px-12">
      <div className="flex flex-col">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center md:text-left">Confirme seu pedido</h2>

        {isCartEmpty ? (
          <div className="mt-10 text-center">
            <p className="text-lg text-gray-500 mb-4">Nenhum item no pedido. Adicione algo delicioso ao seu carrinho!</p>
            <button
              onClick={navigateToHome}
              className="mt-4 bg-orange-500 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Voltar para o menu
            </button>
          </div>
        ) : (
          // O container flex que define o layout em colunas (desktop) ou empilhado (mobile)
          <div className="flex flex-col md:flex-row border border-gray-300 rounded-lg overflow-hidden shadow-sm">
            {/* Seção dos Itens do Pedido */}
            {/* Em mobile: ocupa largura total (w-full). Em desktop: ocupa 2/3 da largura (md:w-2/3) */}
            <section className="w-full md:w-2/3 overflow-auto p-4 md:p-10 bg-gray-50 max-h-[60vh] md:max-h-full">
              <ul className="divide-y divide-gray-300">
                {pedido.map((item) => (
                  <li
                    key={item.id}
                    className="flex flex-col sm:flex-row items-center py-4 sm:py-8 space-y-4 sm:space-y-0 sm:space-x-10"
                  >
                    <img
                      src={item.imagem}
                      alt={item.nome}
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg object-cover flex-shrink-0 border border-gray-300"
                    />
                    <div className="flex-1 text-center sm:text-left">
                      <p className="font-semibold text-xl sm:text-2xl text-gray-900">{item.nome}</p>
                      <p className="text-base sm:text-lg text-gray-700 mt-1">Quantidade: {item.quantidade}</p>
                      <p className="text-base sm:text-lg text-gray-700 mt-1">Preço unitário: R$ {item.precoUnitario.toFixed(2)}</p>
                    </div>
                    <div className="text-center sm:text-right w-full sm:w-44 font-bold text-xl sm:text-2xl text-gray-900 mt-2 sm:mt-0">
                      R$ {(item.precoUnitario * item.quantidade).toFixed(2)}
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* Seção do Resumo do Pedido e Botão */}
            {/* Em mobile: ocupa largura total (w-full). Em desktop: ocupa 1/3 da largura (md:w-1/3) */}
            {/* Em mobile: ordem padrão. Em desktop: borda à esquerda (md:border-l) */}
            <aside className="w-full md:w-1/3 bg-yellow-50 p-4 md:p-10 flex flex-col justify-between border-t border-yellow-300 md:border-t-0 md:border-l">
              <div className="text-center md:text-left mb-6 md:mb-0"> {/* Adicionei mb-6 para espaçamento em mobile */}
                <p className="text-3xl font-extrabold text-yellow-700">
                  Total: R$ {totalPedido.toFixed(2)}
                </p>
              </div>
              <button
                onClick={navigateToPayment}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 md:py-5 rounded-lg shadow-lg transition-colors duration-200"
                disabled={isCartEmpty}
              >
                Continuar para dados do cliente
              </button>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pedido;