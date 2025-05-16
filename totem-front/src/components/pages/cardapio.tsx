const Cardapio = () => {
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <img
          src="https://placehold.co/400x200"
          alt="Interior of 2 Tempos Café with tables and chairs"
          className="w-full"
        />
        <div className="p-4">
          <div className="flex items-center">
            <img
              src="https://placehold.co/100x50"
              alt="2 Tempos Café logo"
              className="h-12"
            />
            <div className="ml-4">
              <h1 className="text-xl font-bold">2 Tempos Café</h1>
              <div className="flex items-center text-yellow-500">
                <i className="fas fa-star"></i>
                <span className="ml-1 text-gray-700">5.0</span>
              </div>
            </div>
          </div>
          <div className="mt-2 flex items-center">
            <span className="text-green-500">
              <i className="fas fa-circle"></i>
            </span>
            <span className="ml-2 text-gray-700">Aberto</span>
          </div>
          <div className="mt-4 flex space-x-2">
            <button className="bg-yellow-400 text-white px-4 py-2 rounded-full">Lançamentos</button>
            <button className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-full">Lanches</button>
            <button className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-full">Refeição</button>
            <button className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-full">Bebidas</button>
          </div>
          <div className="mt-6">
            <h2 className="text-lg font-bold">Lançamentos</h2>
            <div className="mt-4">
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <h3 className="text-md font-semibold">Pão de Queijo</h3>
                  <p className="text-gray-500">Pão de Queijo ou biscoito de queijo...</p>
                  <p className="text-gray-700 font-bold">R$ 3,00</p>
                </div>
                <img
                  src="https://placehold.co/60x60"
                  alt="Pão de Queijo"
                  className="h-16 w-16 rounded"
                />
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <h3 className="text-md font-semibold">Tapioca Recheada</h3>
                  <p className="text-gray-500">Tapioca Caseira recheada com frango, bacon e queijo...</p>
                  <p className="text-gray-700 font-bold">R$ 12,00</p>
                </div>
                <img
                  src="https://placehold.co/60x60"
                  alt="Tapioca Recheada"
                  className="h-16 w-16 rounded"
                />
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <h3 className="text-md font-semibold">Feijoada com costela suína</h3>
                  <p className="text-gray-500">Arroz, feijoada, costelinha suína, farofa temperada e couve...</p>
                  <p className="text-gray-700 font-bold">R$ 20,90</p>
                </div>
                <img
                  src="https://placehold.co/60x60"
                  alt="Feijoada com costela suína"
                  className="h-16 w-16 rounded"
                />
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <h3 className="text-md font-semibold">X - 2 Tempos</h3>
                  <p className="text-gray-500">Pão Hamburger, Filé de carne ou frango, ovo, muçarela, presunto...</p>
                  <p className="text-gray-700 font-bold">R$ 19,99</p>
                </div>
                <img
                  src="https://placehold.co/60x60"
                  alt="X - 2 Tempos"
                  className="h-16 w-16 rounded"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Cardapio;
  