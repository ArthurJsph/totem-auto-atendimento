import { AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Error404() {
const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-red-600 h-2 w-full"></div>
        
        <div className="p-6 sm:p-8">
          <div className="flex flex-col items-center text-center">
            <div className="bg-red-100 p-3 rounded-full mb-4">
              <AlertTriangle className="h-12 w-12 text-red-600" />
            </div>
            
            <h1 className="text-6xl font-bold text-gray-800 mb-2">404</h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Página não encontrada</h2>
            
            <p className="text-gray-500 mb-8">
              A página que você está procurando não existe ou foi movida para outro endereço.
            </p>
            
            <div className="space-y-3 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row">
              <button 
                className="px-6 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                onClick={() => navigate('/')}
              >
                Voltar para a página inicial
              </button>
              
              <button 
                className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                onClick={() => console.log('Reportar problema')}
              >
                Reportar problema
              </button>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <p className="text-sm text-gray-500 text-center">
            Se você acredita que isso é um erro, por favor entre em contato com o suporte.
          </p>
        </div>
      </div>
    </div>
  );
}