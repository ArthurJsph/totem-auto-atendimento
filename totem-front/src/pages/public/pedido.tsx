import { useState } from 'react';

const Pedido = () => {
  const [step, setStep] = useState(1); 
  

  const pedido = [
    {
      id: 1,
      nome: "Café Espresso",
      descricao: "Café espresso encorpado e aromático.",
      quantidade: 2,
      precoUnitario: 6.5,
      imagem: "/imagens/cafe-espresso.jpg",
    },
    {
      id: 3,
      nome: "Pão de Queijo",
      descricao: "Tradicional pão de queijo mineiro.",
      quantidade: 1,
      precoUnitario: 4.0,
      imagem: "/imagens/pao-de-queijo.jpg",
    },
    {
      id: 6,
      nome: "Croissant",
      descricao: "Croissant francês amanteigado.",
      quantidade: 3,
      precoUnitario: 5.5,
      imagem: "/imagens/croissant.jpg",
    },
  ];

  const totalPedido = pedido.reduce(
    (acc, item) => acc + item.precoUnitario * item.quantidade,
    0
  );
  
    // Estado dos dados do cliente
        const [cliente, setCliente] = useState({
          nome: "",
          telefone: "",
          endereco: "",
          complemento: "",
          bairro: "",
          cidade: "",
          cep: "",
        });

        // Estado do pagamento
        const [pagamento, setPagamento] = useState({
          metodo: "dinheiro", // dinheiro, cartao, pix
          nomeCartao: "",
          numeroCartao: "",
          validadeCartao: "",
          cvvCartao: "",
        });

        // Validação simples para habilitar o botão de avançar
        const isClienteValido =
          cliente.nome.trim().length > 2 &&
          cliente.telefone.trim().length >= 10 &&
          cliente.endereco.trim().length > 5 &&
          cliente.bairro.trim().length > 2 &&
          cliente.cidade.trim().length > 2 &&
          cliente.cep.trim().length >= 8;

        const isCartaoValido =
          pagamento.nomeCartao.trim().length > 2 &&
          /^[0-9]{13,19}$/.test(pagamento.numeroCartao.replace(/\s/g, "")) &&
          /^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(pagamento.validadeCartao) &&
          /^[0-9]{3,4}$/.test(pagamento.cvvCartao);

        function handleClienteChange(e: { target: { name: any; value: any; }; }) {
          const { name, value } = e.target;
          setCliente((prev) => ({ ...prev, [name]: value }));
        }

        function handlePagamentoChange(e: { target: { name: any; value: any; }; }) {
          const { name, value } = e.target;
          setPagamento((prev) => ({ ...prev, [name]: value }));
        }

        function formatCardNumber(value: string) {
          return value
            .replace(/\D/g, "")
            .replace(/(.{4})/g, "$1 ")
            .trim();
        }

        function formatValidade(value: string) {
          return value
            .replace(/\D/g, "")
            .replace(/^([2-9])$/g, "0$1")
            .replace(/^(1{1})([3-9]{1})$/g, "0$1/$2")
            .replace(/^([0-1]{1}[0-9]{1})([0-9]{1,2}).*/g, "$1/$2");
        }

        function handleCardNumberChange(e: { target: { value: any; }; }) {
          const formatted = formatCardNumber(e.target.value);
          setPagamento((prev) => ({ ...prev, numeroCartao: formatted }));
        }

        function handleValidadeChange(e: { target: { value: any; }; }) {
          const formatted = formatValidade(e.target.value);
          setPagamento((prev) => ({ ...prev, validadeCartao: formatted }));
        }

        function handleSubmit(e: { preventDefault: () => void; }) {
          e.preventDefault();
          alert(
            `Pedido confirmado!\n\nCliente: ${cliente.nome}\nTelefone: ${cliente.telefone}\nEndereço: ${cliente.endereco}, ${cliente.complemento}, ${cliente.bairro}, ${cliente.cidade} - CEP: ${cliente.cep}\nPagamento: ${
              pagamento.metodo === "cartao"
                ? `Cartão de Crédito (Nome: ${pagamento.nomeCartao})`
                : pagamento.metodo === "dinheiro"
                ? "Dinheiro"
                : "PIX"
            }\n\nTotal: R$ ${totalPedido.toFixed(2)}`
          );
          // Resetar formulário e voltar para o início
          setStep(1);
          setCliente({
            nome: "",
            telefone: "",
            endereco: "",
            complemento: "",
            bairro: "",
            cidade: "",
            cep: "",
          });
          setPagamento({
            metodo: "dinheiro",
            nomeCartao: "",
            numeroCartao: "",
            validadeCartao: "",
            cvvCartao: "",
          });
        }

  return (
    <><div className="max-w-full mx-auto h-full flex flex-col">
      {step === 1 && (
        <div className="flex flex-col h-full">
          <h2 className="text-3xl font-semibold mb-10 text-gray-800">
            Confirme seu pedido
          </h2>
          <div className="flex flex-grow border border-gray-300 rounded-lg overflow-hidden shadow-sm">
            <section className="w-2/3 overflow-auto p-10 bg-gray-50">
              <ul className="divide-y divide-gray-300">
                {pedido.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center py-8 space-x-10"
                  >
                    <img
                      src={item.imagem}
                      alt={item.nome} // <-- corrigido
                      className="w-28 h-28 rounded-lg object-cover flex-shrink-0 border border-gray-300" />
                    <div className="flex-1">
                      <p className="font-semibold text-2xl text-gray-900">
                        {item.nome}
                      </p>
                      <p className="text-lg text-gray-700 mt-2">
                        Quantidade: {item.quantidade}
                      </p>
                      <p className="text-lg text-gray-700 mt-1">
                        Preço unitário: R$ {item.precoUnitario.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right w-44 font-bold text-2xl text-gray-900">
                      R$ {(item.precoUnitario * item.quantidade).toFixed(2)}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
            <aside className="w-1/3 bg-yellow-50 p-10 flex flex-col justify-between border-l border-yellow-300">
              <div>
                <p className="text-3xl font-extrabold text-yellow-700 mb-8">
                  Total: R$ {totalPedido.toFixed(2)}
                </p>
              </div>
              <button
                onClick={() => setStep(2)} // <-- agora funciona
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-5 rounded-lg shadow-lg transition"
              >
                Continuar para dados do cliente
              </button>
            </aside>
          </div>
        </div>
      )}
    </div><div className="max-w-full mx-auto h-full flex flex-col">
        {step === 2 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (isClienteValido) setStep(3);
            } }
            className="flex flex-col h-full"
          >
            <h2 className="text-3xl font-semibold mb-10 text-gray-800">
              Dados para entrega
            </h2>

            <div className="flex-grow overflow-auto border border-gray-300 rounded-lg p-12 bg-gray-50 shadow-sm">
              <div className="grid grid-cols-3 gap-12">
                {/* Campo Nome */}
                <div>
                  <label htmlFor="nome" className="block text-gray-700 font-semibold mb-3">
                    Nome completo <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={cliente.nome}
                    onChange={handleClienteChange}
                    required
                    placeholder="Seu nome completo"
                    className="w-full border border-gray-300 rounded-lg px-5 py-4 focus:outline-none focus:ring-4 focus:ring-yellow-400" />
                </div>

                {/* Campo Telefone */}
                <div>
                  <label htmlFor="telefone" className="block text-gray-700 font-semibold mb-3">
                    Telefone <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    id="telefone"
                    name="telefone"
                    value={cliente.telefone}
                    onChange={handleClienteChange}
                    required
                    placeholder="(99) 99999-9999"
                    pattern="\(?\d{2}\)?\s?\d{4,5}-?\d{4}"
                    className="w-full border border-gray-300 rounded-lg px-5 py-4 focus:outline-none focus:ring-4 focus:ring-yellow-400" />
                </div>

                {/* Campo CEP */}
                <div>
                  <label htmlFor="cep" className="block text-gray-700 font-semibold mb-3">
                    CEP <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="cep"
                    name="cep"
                    value={cliente.cep}
                    onChange={handleClienteChange}
                    required
                    placeholder="00000-000"
                    pattern="\d{5}-?\d{3}"
                    className="w-full border border-gray-300 rounded-lg px-5 py-4 focus:outline-none focus:ring-4 focus:ring-yellow-400" />
                </div>

                {/* Campo Endereço */}
                <div>
                  <label htmlFor="endereco" className="block text-gray-700 font-semibold mb-3">
                    Endereço <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="endereco"
                    name="endereco"
                    value={cliente.endereco}
                    onChange={handleClienteChange}
                    required
                    placeholder="Rua, número, etc."
                    className="w-full border border-gray-300 rounded-lg px-5 py-4 focus:outline-none focus:ring-4 focus:ring-yellow-400" />
                </div>

                {/* Campo Complemento */}
                <div>
                  <label htmlFor="complemento" className="block text-gray-700 font-semibold mb-3">
                    Complemento
                  </label>
                  <input
                    type="text"
                    id="complemento"
                    name="complemento"
                    value={cliente.complemento}
                    onChange={handleClienteChange}
                    placeholder="Apartamento, bloco, etc."
                    className="w-full border border-gray-300 rounded-lg px-5 py-4 focus:outline-none focus:ring-4 focus:ring-yellow-400" />
                </div>

                {/* Campo Bairro */}
                <div>
                  <label htmlFor="bairro" className="block text-gray-700 font-semibold mb-3">
                    Bairro <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="bairro"
                    name="bairro"
                    value={cliente.bairro}
                    onChange={handleClienteChange}
                    required
                    placeholder="Bairro"
                    className="w-full border border-gray-300 rounded-lg px-5 py-4 focus:outline-none focus:ring-4 focus:ring-yellow-400" />
                </div>

                {/* Campo Cidade */}
                <div>
                  <label htmlFor="cidade" className="block text-gray-700 font-semibold mb-3">
                    Cidade <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="cidade"
                    name="cidade"
                    value={cliente.cidade}
                    onChange={handleClienteChange}
                    required
                    placeholder="Cidade"
                    className="w-full border border-gray-300 rounded-lg px-5 py-4 focus:outline-none focus:ring-4 focus:ring-yellow-400" />
                </div>
              </div>
            </div>

            <div className="mt-10 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-12 py-5 rounded-lg border-2 border-yellow-500 text-yellow-600 font-bold hover:bg-yellow-50 transition"
              >
                Voltar
              </button>
              <button
                type="submit"
                disabled={!isClienteValido}
                className={`px-12 py-5 rounded-lg font-bold text-white transition ${isClienteValido
                    ? "bg-yellow-500 hover:bg-yellow-600"
                    : "bg-yellow-300 cursor-not-allowed"}`}
              >
                Continuar para pagamento
              </button>
            </div>
          </form>
        )}
      </div></>
    
  );
};

export default Pedido;