import { useMemo, useCallback } from 'react';
import { useCart } from '../context/CartContext'; 
import { useNavigate } from 'react-router-dom';

interface OrderItem {
  id: number;
  nome: string;
  descricao: string;
  quantidade: number;
  precoUnitario: number;
  imagem: string;
}

interface UseOrderHook {
  pedido: OrderItem[];
  totalPedido: number;
  isCartEmpty: boolean;
  navigateToHome: () => void;
  navigateToPayment: () => void;
}

export const useOrder = (): UseOrderHook => {
  const { cartItems, getCartTotal } = useCart(); 
  const navigate = useNavigate();
  const pedido = useMemo(() => {
    return cartItems.map(item => ({
      id: item.id as number, 
      nome: item.name || 'Produto não encontrado',
      descricao: item.description || '',
      quantidade: item.quantity,
      precoUnitario: item.price || 0,
      imagem: item.imageUrl || '',
    }));
  }, [cartItems]); 

  const totalPedido = useMemo(() => getCartTotal(), [getCartTotal]); 

  const isCartEmpty = pedido.length === 0;

  const navigateToHome = useCallback(() => {
    navigate("/home");
  }, [navigate]);

  const navigateToPayment = useCallback(() => {
    navigate("/pedido/pagamento");
  }, [navigate]);

  return {
    pedido,
    totalPedido,
    isCartEmpty,
    navigateToHome,
    navigateToPayment,
  };
};