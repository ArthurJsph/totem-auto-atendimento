const Produto = () => {
  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Campo de pesquisa no canto superior direito */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <div className="flex items-center bg-white rounded-full shadow px-3 py-1">
          <input
            type="text"
            placeholder="Pesquisar produto..."
            className="outline-none bg-transparent px-2 py-1 text-gray-700"
          />
          <button className="ml-2 text-green-700 hover:text-green-900">
            {/* Ícone de lupa */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
            </svg>
          </button>
        </div>
        {/* Botão para cadastrar novo produto */}
        <button className="flex items-center bg-green-700 text-white px-4 py-2 rounded-full shadow hover:bg-green-800 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Novo Produto
        </button>
      </div>

      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden mt-6">
        <div className="relative">
          <img 
            src="https://placehold.co/600x400" 
            alt="A tapioca filled with chicken, bacon, and cheese, garnished with parsley" 
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-2 left-2">
            <button className="bg-white p-2 rounded-full shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className="absolute top-2 right-2">
            <button className="bg-white p-2 rounded-full shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
            <button className="bg-white p-2 rounded-full shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center mb-2">
            <img src="https://placehold.co/24x24" alt="Cafe logo" className="w-6 h-6 rounded-full" />
            <span className="ml-2 text-sm text-gray-600">2 tempos Café</span>
          </div>
          <h2 className="text-xl font-semibold">Tapioca Recheada</h2>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-bold">R$ 12,00</span>
            <div className="flex items-center">
              <button className="bg-gray-200 p-1 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
              <span className="mx-2">1</span>
              <button className="bg-red-500 text-white p-1 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Sobre</h3>
            <p className="text-gray-600">Tapioca caseira recheada com frango, bacon e queijo</p>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Ingredientes</h3>
            <ul className="list-disc list-inside text-gray-600">
              <li>Tapioca</li>
              <li>Frango</li>
              <li>Bacon</li>
              <li>Queijo</li>
            </ul>
          </div>
          <button className="w-full bg-yellow-500 text-white py-2 rounded-lg mt-4 hover:bg-yellow-600 transition-colors">
            Adicionar à Sacola
          </button>
        </div>
      </div>
    </div>
  );
};

export default Produto;