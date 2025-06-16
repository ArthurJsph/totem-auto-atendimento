// src/pages/FAQ.tsx
import React, { useState } from 'react';

// Dados fictícios para as FAQs
const faqData = [
  {
    question: "Como faço para fazer um pedido?",
    answer: "Para fazer um pedido, navegue até a seção 'Cardápio', selecione os produtos desejados e adicione-os ao carrinho. Em seguida, clique no ícone do carrinho e siga as instruções para finalizar a compra."
  },
  {
    question: "Quais são as opções de pagamento?",
    answer: "Atualmente aceitamos pagamentos via Cartão de Crédito (Visa, Mastercard, Elo), Pix e pagamento em dinheiro ou cartão na retirada/entrega (para pedidos locais)."
  },
  {
    question: "Vocês fazem entregas em domicílio?",
    answer: "Sim, fazemos entregas em domicílio dentro de um raio de 5km da nossa cafeteria. O valor da taxa de entrega será calculado na finalização do pedido com base no seu endereço."
  },
  {
    question: "Posso retirar meu pedido na loja?",
    answer: "Sim! Você pode optar por 'Retirar na Loja' durante o checkout. Seu pedido estará pronto para retirada aproximadamente 20 minutos após a confirmação do pagamento, durante nosso horário de funcionamento."
  },
  {
    question: "Qual o horário de funcionamento da cafeteria?",
    answer: "Nosso horário de funcionamento é de Segunda a Sexta, das 08:00 às 18:00. Aos sábados, das 09:00 às 14:00. Não abrimos aos domingos."
  },
  {
    question: "Como posso entrar em contato para suporte?",
    answer: "Você pode nos contatar através do telefone (XX) XXXX-XXXX, pelo e-mail contato@2temposcafe.com, ou visitando nossa página de Contato para outras opções."
  }
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-900 mb-10 text-center">Perguntas Frequentes</h1>

      <div className="max-w-3xl mx-auto">
        {faqData.map((item, index) => (
          <div key={index} className="border-b border-gray-200 py-4">
            <button
              className="flex justify-between items-center w-full text-left font-semibold text-xl text-gray-800 focus:outline-none"
              onClick={() => toggleAccordion(index)}
            >
              {item.question}
              <svg
                className={`w-6 h-6 transform transition-transform duration-300 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === index ? 'max-h-screen opacity-100 mt-2' : 'max-h-0 opacity-0'
              }`}
            >
              <p className="text-gray-600 text-lg">{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;