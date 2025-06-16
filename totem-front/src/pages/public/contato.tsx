// src/pages/Contato.tsx
import React, { useState } from 'react';

const Contato: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você faria a integração com um backend real para enviar o e-mail.
    // Para o projeto de faculdade, vamos simular o envio.
    console.log('Dados do formulário enviados:', formData);
    setFormStatus('success');
    setFormData({ name: '', email: '', message: '' }); // Limpa o formulário
    
    // Opcional: esconder a mensagem de sucesso após alguns segundos
    setTimeout(() => {
      setFormStatus('idle');
    }, 5000);
  };

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-900 mb-10 text-center">Entre em Contato</h1>

      <div className="flex flex-col md:flex-row gap-10 max-w-5xl mx-auto">
        {/* Informações de Contato */}
        <div className="md:w-1/2 bg-gray-50 p-8 rounded-lg shadow-md flex flex-col justify-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Nossos Dados</h2>
          <div className="space-y-4 text-lg text-gray-700">
            <p>
              <strong>Endereço:</strong> Rua Fictícia, 123 - Centro<br />
              Cidade Imaginária, BR - CEP: 12345-678
            </p>
            <p>
              <strong>Telefone:</strong> <a href="tel:+55XXYYYY-ZZZZ" className="text-blue-600 hover:underline">(XX) XXXX-XXXX</a>
            </p>
            <p>
              <strong>E-mail:</strong> <a href="mailto:contato@2temposcafe.com" className="text-blue-600 hover:underline">contato@2temposcafe.com</a>
            </p>
            <p>
              <strong>Horário de Atendimento:</strong><br />
              Segunda a Sexta: 08:00 - 18:00<br />
              Sábado: 09:00 - 14:00<br />
              Domingo: Fechado
            </p>
          </div>
          {/* Opcional: Link para o Google Maps */}
          <div className="mt-6">
            <a
              href="https://www.google.com/maps/search/?api=1&query=Rua+Fictícia,+123,+Cidade+Imaginária"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200"
            >
              Ver no Mapa
            </a>
          </div>
        </div>

        {/* Formulário de Contato */}
        <div className="md:w-1/2 bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Envie uma Mensagem</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Nome:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">E-mail:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">Mensagem:</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              ></textarea>
            </div>
            {formStatus === 'success' && (
              <p className="text-green-600 font-semibold text-center">Mensagem enviada com sucesso! Em breve entraremos em contato.</p>
            )}
            {formStatus === 'error' && (
              <p className="text-red-600 font-semibold text-center">Erro ao enviar mensagem. Por favor, tente novamente mais tarde.</p>
            )}
            <button
              type="submit"
              className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Enviar Mensagem
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contato;