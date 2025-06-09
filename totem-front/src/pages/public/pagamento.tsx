import { useState, useEffect } from 'react';
import { CreditCard, Coffee, Wallet } from 'lucide-react';
import { Link } from "react-router-dom";
import { useCart } from '../../context/CartContext'; // Importe useCart

export default function CafeteriaPayment() {
  const { cartItems, getCartTotal } = useCart(); // Pegar os itens do carrinho e o total

  const [selectedPayment, setSelectedPayment] = useState<'credit' | 'debit' | 'pix' | 'cash' | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cashAmount, setCashAmount] = useState('');
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  // Calcula o total do pedido com base nos itens do carrinho
  const totalPedido = getCartTotal();

  useEffect(() => {
    // Apenas permitir submissão se houver itens no carrinho
    if (cartItems.length === 0) {
      setIsSubmitDisabled(true);
      return;
    }

    if (!selectedPayment) {
      setIsSubmitDisabled(true);
      return;
    }

    if (selectedPayment === 'credit' || selectedPayment === 'debit') {
      setIsSubmitDisabled(!(cardNumber && cardName && cardExpiry && cardCvv));
    } else {
      // Para PIX e Dinheiro, o botão é habilitado se o método estiver selecionado
      setIsSubmitDisabled(false);
    }
  }, [selectedPayment, cardNumber, cardName, cardExpiry, cardCvv, cartItems]); // Adicionado cartItems aqui

  const handlePaymentSubmit = () => {
    // Nesta versão estática, apenas um alerta de sucesso
    alert('Pagamento simulado com sucesso! Seu pedido está a caminho!');
    // Opcional: Limpar o carrinho após a "finalização"
    // clearCart();
    // Opcional: Redirecionar para uma página de confirmação/agradecimento
    // navigate('/confirmacao-pedido');
  };

  return (
    <div className="min-h-screen bg-amber-50 py-8 px-4">
      <div className="max-w-lg mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-amber-800 text-white p-6 text-center">
          <div className="flex justify-center mb-3">
            <Coffee className="w-12 h-12" />
          </div>
          <h1 className="text-2xl font-bold">2 Tempos Café</h1>
          <p className="text-amber-100">Selecione uma forma de pagamento</p>
        </div>

        {/* Payment Options */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[
              { id: 'credit', label: 'Cartão de Crédito' },
              { id: 'debit', label: 'Cartão de Débito' },
              { id: 'pix', label: 'PIX' },
              { id: 'cash', label: 'Dinheiro' },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedPayment(option.id as 'credit' | 'debit' | 'pix' | 'cash')}
                className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                  selectedPayment === option.id
                    ? 'border-amber-600 bg-amber-50'
                    : 'border-gray-200 hover:border-amber-300'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-3">
                  {option.id === 'cash' ? (
                    <Wallet className="w-6 h-6 text-amber-800" />
                  ) : (
                    <CreditCard className="w-6 h-6 text-amber-800" />
                  )}
                </div>
                <span className="font-medium text-gray-800">{option.label}</span>
              </button>
            ))}
          </div>

          {/* Payment Details */}
          {selectedPayment === 'credit' || selectedPayment === 'debit' ? (
            <div className="bg-amber-50 p-4 rounded-lg mb-6">
              <h3 className="font-bold text-amber-900 mb-4">
                {selectedPayment === 'credit' ? 'Dados do Cartão de Crédito' : 'Dados do Cartão de Débito'}
              </h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Número do Cartão</label>
                <input
                  type="text"
                  id="cardNumber" // Adicionado ID para label
                  placeholder="0000 0000 0000 0000"
                  className="w-full p-3 border border-gray-300 rounded-md"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  required // Campos de cartão são obrigatórios
                />
              </div>

              <div className="mb-4"> {/* Agrupado Nome e Validade/CVV para melhor layout */}
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome no Cartão</label>
                <input
                  type="text"
                  id="cardName" // Adicionado ID para label
                  placeholder="Como aparece no cartão"
                  className="w-full p-3 border border-gray-300 rounded-md"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4"> {/* Validade e CVV no mesmo grid para mobile */}
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Validade</label>
                  <input
                    type="text"
                    id="cardExpiry" // Adicionado ID para label
                    placeholder="MM/AA"
                    className="w-full p-3 border border-gray-300 rounded-md"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    required
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                  <input
                    type="text"
                    id="cardCvv" // Adicionado ID para label
                    placeholder="123"
                    className="w-full p-3 border border-gray-300 rounded-md"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    required
                  />
                </div>
              </div>


              {selectedPayment === 'credit' && (
                <div className="mt-4"> {/* Adicionado mt-4 para espaçamento */}
                  <label className="block text-sm font-medium text-gray-700 mb-1">Parcelas</label>
                  <select className="w-full p-3 border border-gray-300 rounded-md bg-white">
                    {/* Exemplo de parcelas, você pode calcular com base no totalPedido */}
                    <option value="1">1x de R$ {totalPedido.toFixed(2)} (sem juros)</option>
                    {totalPedido >= 20 && <option value="2">2x de R$ {(totalPedido / 2).toFixed(2)} (sem juros)</option>}
                    {totalPedido >= 30 && <option value="3">3x de R$ {(totalPedido / 3).toFixed(2)} (sem juros)</option>}
                    {/* Adicione mais opções de parcelamento conforme desejar */}
                  </select>
                </div>
              )}
            </div>
          ) : selectedPayment === 'pix' ? (
            <div className="bg-amber-50 p-4 rounded-lg mb-6 text-center">
              <h3 className="font-bold text-amber-900 mb-4">Pagamento via PIX</h3>
              {/* Removido o QR Code e a imagem base64 */}
              <p className="text-gray-600 mb-4">
                Escaneie o QR Code ou copie a chave Pix para finalizar o pagamento.
              </p>
              <div className="bg-blue-50 p-3 rounded-md border-l-4 border-blue-500 text-left">
                <p className="font-medium">Chave PIX: **cafe@aroma.com.br**</p>
                <button
                  onClick={() => alert('Chave copiada! (simulado)')} // Apenas um alerta
                  className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  Copiar chave
                </button>
              </div>
            </div>
          ) : selectedPayment === 'cash' ? (
            <div className="bg-amber-50 p-4 rounded-lg mb-6">
              <h3 className="font-bold text-amber-900 mb-4">Pagamento em Dinheiro</h3>
              <p className="text-gray-600 mb-4">Você pagará em dinheiro ao retirar seu pedido.</p>
              <div className="mb-4">
                <label htmlFor="cashAmount" className="block text-sm font-medium text-gray-700 mb-1">Valor para Troco (opcional)</label>
                <input
                  type="text"
                  id="cashAmount"
                  placeholder="R$ 0,00"
                  className="w-full p-3 border border-gray-300 rounded-md"
                  value={cashAmount}
                  onChange={(e) => setCashAmount(e.target.value)}
                />
              </div>
            </div>
          ) : null}

          {/* Order Summary - AGORA COM DADOS DO CARRINHO */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-bold text-gray-800 mb-4">Resumo do Pedido</h3>
            {cartItems.length === 0 ? (
              <p className="text-gray-600">Seu carrinho está vazio.</p>
            ) : (
              <>
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between mb-2">
                    <span className="text-gray-600">
                      {item.name} ({item.quantity}x)
                    </span>
                    <span className="text-gray-800">R$ {(item.price || 0 * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t border-gray-200 my-2"></div>
                <div className="flex justify-between font-bold text-lg text-amber-900">
                  <span>Total</span>
                  <span>R$ {totalPedido.toFixed(2)}</span>
                </div>
              </>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-between">
            <Link
              to="/pedido"
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Voltar
            </Link>
            <button
              onClick={handlePaymentSubmit}
              disabled={isSubmitDisabled}
              className={`font-medium py-3 px-6 rounded-lg transition-colors ${
                isSubmitDisabled
                  ? 'bg-amber-300 text-amber-700 cursor-not-allowed'
                  : 'bg-amber-600 hover:bg-amber-700 text-white'
              }`}
            >
              Finalizar Pagamento
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}