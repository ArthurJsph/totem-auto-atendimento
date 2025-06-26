import PaoDeQueijo from "../../assets/pao-queijo-recheado.jpg";
import WrapFrango from "../../assets/wrap-frango.jpg";
import Cappucino from "../../assets/cappuccino.jpg";
import Ambiente from "../../assets/ambiente.jpeg";

const Sobre = () => {
  return (
    <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-12">
      <section className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-black-600 mb-8 text-center md:text-left">
          Sobre Nós
        </h1>
        <div className="flex flex-col md:flex-row md:space-x-12 items-center md:items-start">
          <div className="md:w-1/2 space-y-6 text-gray-700 text-lg leading-relaxed">
            <p>
              Bem-vindo ao <span className="font-bold text-yellow-600">2 Tempos Café</span>, o seu lugar favorito para saborear os melhores lanches e cafés da cidade. Fundado em 2014, nosso restaurante tem como missão oferecer produtos frescos, saborosos e feitos com carinho para você e sua família.
            </p>
            <p>
              Nosso cardápio é cuidadosamente elaborado para agradar todos os gostos, desde os clássicos sanduíches até opções especiais e exclusivas. Além disso, nosso café é selecionado das melhores regiões produtoras, garantindo aroma e sabor incomparáveis.
            </p>
            <p>
              Aqui, você encontra um ambiente acolhedor, perfeito para encontros, reuniões ou simplesmente para relaxar e aproveitar um momento delicioso. Nossa equipe está sempre pronta para oferecer um atendimento amigável e personalizado.
            </p>
            <p>
              Venha nos visitar e descubra por que somos referência em qualidade e sabor na cidade!
            </p>
          </div>

          <div className="md:w-1/2 mt-10 md:mt-0 grid grid-cols-2 gap-6">
            <img
              alt="Tradicional pão de queijo recheado."
              className="rounded-lg shadow-lg object-cover w-full h-48 md:h-60"
              src={PaoDeQueijo}
            />
            <img
              alt="Cappuccino encorpado e aromático."
              className="rounded-lg shadow-lg object-cover w-full h-48 md:h-60"
              src={Cappucino}
            />
            <img
              alt="Ambiente interno do restaurante"
              className="rounded-lg shadow-lg object-cover w-full h-48 md:h-60"
              src={Ambiente}
            />
            <img
              alt="Delioso Wrap de frango."
              className="rounded-lg shadow-lg object-cover w-full h-48 md:h-60"
              src={WrapFrango}
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Sobre;