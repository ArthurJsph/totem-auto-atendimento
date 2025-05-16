const Home = () => {
  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <img
          src="https://storage.googleapis.com/a1aa/image/u2Z7q8f7aZE5S8R04m0iUm0-HBdyqrlBEeGbPdLAX_8.jpg"
          alt="2 Tempos Café logo"
          className="w-48 h-auto rounded-md shadow-sm"
        />
      </div>

      {/* Texto de boas-vindas */}
      <h1 className="text-center text-3xl font-bold text-gray-800 mb-4">
        Seja bem-vindo!
      </h1>
      <p className="text-center text-gray-600 mb-6 text-lg">
        Escolha como prefere aproveitar sua refeição. Estamos aqui para oferecer praticidade e sabor em cada detalhe!
      </p>

      {/* Opções de atendimento */}
      <div className="flex justify-around">
        {/* Opção: Comer no local */}
        <div className="text-center">
          <img
            src="https://storage.googleapis.com/a1aa/image/fOQfUzlJI2HlSSovAvy0tFoXmz4u9ZbcnhIA-WBmk5k.jpg"
            alt="Burger"
            className="w-28 h-28 mx-auto mb-3 rounded-lg shadow-md"
          />
          <button className="bg-amber-600 text-white rounded-lg px-5 py-3 text-lg font-semibold shadow-md hover:bg-amber-700 transition">
            Para comer aqui
          </button>
        </div>

        {/* Opção: Para levar */}
        <div className="text-center">
          <img
            src="https://storage.googleapis.com/a1aa/image/GGQDfbbBO2Wa8gbA6Eq-ioxwno8PYPLHp9uq7tiwre0.jpg"
            alt="Takeaway bag"
            className="w-28 h-28 mx-auto mb-3 rounded-lg shadow-md"
          />
          <button className="bg-amber-500 text-white rounded-lg px-5 py-3 text-lg font-semibold shadow-md hover:bg-amber-600 transition">
            Para levar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
