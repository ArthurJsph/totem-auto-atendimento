// src/components/Footer.jsx


export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 px-4 mt-12 relative z-40"> {/* Removido 'fixed bottom-0', adicionei relative e z-index */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center space-y-8 md:space-y-0">

        {/* Coluna 1: Informações de Direitos Autorais e Versão */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left w-full md:w-1/3">
          <p className="text-lg font-semibold mb-2">
            © 2025 2 Tempos Café
          </p>
          <p className="text-sm text-gray-400">
            Todos os direitos reservados.
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Versão 1.0.0
          </p>
        </div>

        {/* Coluna 2: Informações de Contato */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left w-full md:w-1/3">
          <h3 className="text-lg font-semibold mb-2">Contato</h3>
          <p className="text-sm text-gray-400">
            SIA Trecho 5 ED IMPORTE CENTER LT 05 35 LJ 05
             - Guará, Brasília - DF, 71205-050
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Telefone: (61) 98341-4120
          </p>
          <p className="text-sm text-gray-400">
            E-mail: <a href="mailto:contato@2temposcafe.com" className="hover:text-blue-400 transition-colors duration-200">contato@2temposcafe.com</a>
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Horário de Atendimento: <br/>
            Seg - Sex: 07:00 - 17:00
            <br/>
            Sáb: 07:00 - 15:00
          </p>
        </div>

        {/* Coluna 3: Links Úteis / Navegação Adicional */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left w-full md:w-1/3">
          <h3 className="text-lg font-semibold mb-2">Links Úteis</h3>
          <ul className="text-sm space-y-1">
            <li>
              <a href="/faq" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                Perguntas Frequentes
              </a>
            </li>
            <li>
              <a href="/politica-privacidade" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                Política de Privacidade
              </a>
            </li>
            <li>
              <a href="/termos-de-uso" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                Termos de Uso
              </a>
            </li>
            <li>
              <a href="/sobre" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                Sobre Nós
              </a>
            </li>
          </ul>
          {/* Seção de Redes Sociais - ícones (exemplo) */}
          <div className="flex mt-4 space-x-4">
            <a href="https://www.instagram.com/2tempocafe/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-500 transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-instagram"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="https://www.facebook.com/2temposcafe?locale=pt_BR" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}