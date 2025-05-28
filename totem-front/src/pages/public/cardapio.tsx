
import { produtos } from './produto'; // ajuste o caminho conforme sua estrutura

export function Cardapio() {
  return (
      <div className="min-h-screen bg-gray-100 p-6 pb-24">
        <h1 className="text-3xl font-bold mb-6 text-center">Nosso Cardápio</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {produtos.map((produto) => (
            <div
              key={produto.id}
              className="bg-white shadow-md rounded-xl overflow-hidden hover:scale-105 transition-transform"
            >
              <img
                src={produto.imagem}
                alt={produto.nome}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold">{produto.nome}</h2>
                <p className="text-gray-600 text-sm mt-1">{produto.descricao}</p>
                <p className="text-green-600 font-bold mt-2">R$ {produto.preco.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
  );
}

export default Cardapio;