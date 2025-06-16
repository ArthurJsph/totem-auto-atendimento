// src/pages/TermosDeUso.tsx
import React from 'react';

const TermosDeUso: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-900 mb-10 text-center">Termos de Uso</h1>

      <div className="max-w-4xl mx-auto text-gray-700 leading-relaxed text-lg space-y-6">
        <p>Bem-vindo(a) ao 2 Tempos Café! Ao acessar e utilizar nosso site, você concorda em cumprir e estar vinculado(a) aos seguintes termos e condições de uso, que, juntamente com nossa política de privacidade, regem o relacionamento do 2 Tempos Café com você em relação a este site. Se você discordar de qualquer parte destes termos e condições, por favor, não utilize nosso site.</p>

        <h2 className="text-3xl font-semibold text-gray-800 mt-8 mb-4">Uso do Site</h2>
        <p>O conteúdo das páginas deste site é para sua informação geral e uso exclusivo. Ele está sujeito a alterações sem aviso prévio. Nem nós nem terceiros fornecemos qualquer garantia ou garantia quanto à precisão, pontualidade, desempenho, integridade ou adequação das informações e materiais encontrados ou oferecidos neste site para qualquer finalidade específica. Você reconhece que tais informações e materiais podem conter imprecisões ou erros e nós expressamente excluímos a responsabilidade por quaisquer imprecisões ou erros na extensão máxima permitida por lei.</p>
        
        <h2 className="text-3xl font-semibold text-gray-800 mt-8 mb-4">Sua Conta</h2>
        <p>Se você criar uma conta em nosso site, você é responsável por manter a confidencialidade de suas informações de conta e senha, incluindo, mas não se limitando à restrição de acesso ao seu computador e/ou conta. Você concorda em aceitar a responsabilidade por todas as atividades que ocorram sob sua conta ou senha. Você não pode atribuir ou transferir sua conta para qualquer outra pessoa ou entidade. Você reconhece que o 2 Tempos Café não é responsável pelo acesso de terceiros à sua conta resultante de roubo ou apropriação indevida de sua conta.</p>

        <h2 className="text-3xl font-semibold text-gray-800 mt-8 mb-4">Pedidos e Pagamento</h2>
        <p>Ao fazer um pedido através do nosso site, você garante que é legalmente capaz de celebrar contratos vinculativos. Todos os pedidos estão sujeitos à disponibilidade e à nossa aceitação. Reservamo-nos o direito de recusar qualquer pedido a nosso critério.</p>
        <p>Todos os preços são cotados em Reais (R$) e incluem impostos, quando aplicáveis. As informações de pagamento fornecidas são criptografadas e tratadas com a máxima segurança.</p>

        <h2 className="text-3xl font-semibold text-gray-800 mt-8 mb-4">Links para Outros Sites</h2>
        <p>Nosso site pode conter links para outros sites de interesse. No entanto, uma vez que você tenha usado esses links para sair do nosso site, observe que não temos controle sobre esse outro site. Portanto, não podemos ser responsáveis pela proteção e privacidade de qualquer informação que você fornecer ao visitar esses sites e tais sites não são regidos por esta declaração de privacidade. Você deve ter cautela e consultar a declaração de privacidade aplicável ao site em questão.</p>

        <h2 className="text-3xl font-semibold text-gray-800 mt-8 mb-4">Alterações nos Termos</h2>
        <p>Reservamo-nos o direito de revisar estes termos de uso a qualquer momento, atualizando esta postagem. Você deve visitar esta página periodicamente para revisar os termos de uso atuais. O uso continuado do site constitui sua aceitação de quaisquer termos revisados.</p>

        <p>Estes termos de uso foram atualizados em: 16 de Junho de 2025.</p>
      </div>
    </div>
  );
};

export default TermosDeUso;