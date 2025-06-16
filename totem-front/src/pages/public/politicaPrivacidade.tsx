// src/pages/PoliticaPrivacidade.tsx
import React from 'react';

const PoliticaPrivacidade: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-900 mb-10 text-center">Política de Privacidade</h1>

      <div className="max-w-4xl mx-auto text-gray-700 leading-relaxed text-lg space-y-6">
        <p>A privacidade dos nossos visitantes é de extrema importância para nós do 2 Tempos Café. Esta política de privacidade descreve os tipos de informações pessoais que são coletadas e registradas pelo 2 Tempos Café e como as utilizamos.</p>

        <h2 className="text-3xl font-semibold text-gray-800 mt-8 mb-4">Coleta de Informações Pessoais</h2>
        <p>Coletamos informações pessoais que você nos fornece voluntariamente ao se registrar em nosso site, fazer um pedido, assinar nossa newsletter ou preencher um formulário. Essas informações podem incluir seu nome, endereço de e-mail, número de telefone, endereço de entrega e informações de pagamento.</p>
        
        <h2 className="text-3xl font-semibold text-gray-800 mt-8 mb-4">Uso das Informações</h2>
        <p>As informações coletadas são usadas para:</p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>Processar e gerenciar seus pedidos.</li>
          <li>Melhorar nosso atendimento ao cliente.</li>
          <li>Personalizar sua experiência no site.</li>
          <li>Enviar e-mails periódicos com atualizações sobre seu pedido, notícias da cafeteria, promoções, etc.</li>
          <li>Melhorar nossos produtos e serviços.</li>
        </ul>

        <h2 className="text-3xl font-semibold text-gray-800 mt-8 mb-4">Proteção de Dados</h2>
        <p>Implementamos uma variedade de medidas de segurança para manter a segurança de suas informações pessoais quando você faz um pedido ou insere, envia ou acessa suas informações pessoais.</p>
        <p>Usamos um servidor seguro. Todas as informações confidenciais/de crédito fornecidas são transmitidas via tecnologia Secure Socket Layer (SSL) e depois criptografadas em nosso banco de dados de provedores de gateway de pagamento para serem acessíveis apenas por aqueles autorizados com direitos de acesso especiais a esses sistemas, e são obrigados a manter as informações confidenciais.</p>

        <h2 className="text-3xl font-semibold text-gray-800 mt-8 mb-4">Cookies</h2>
        <p>O 2 Tempos Café utiliza cookies para armazenar informações sobre as preferências dos visitantes, registrar informações específicas do usuário sobre quais páginas o usuário acessa ou visita, personalizar o conteúdo da página da web com base no tipo de navegador dos visitantes ou outras informações que o visitante envia através do navegador.</p>

        <h2 className="text-3xl font-semibold text-gray-800 mt-8 mb-4">Consentimento</h2>
        <p>Ao usar nosso site, você concorda com nossa política de privacidade.</p>

        <p>Esta política de privacidade foi atualizada em: 16 de Junho de 2025.</p>
      </div>
    </div>
  );
};

export default PoliticaPrivacidade;