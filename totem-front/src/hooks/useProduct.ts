import { useEffect, useState, useCallback, useMemo, useRef } from 'react'; 
import { getAllProducts } from '../service/product'; 
import { Product } from '../service/interfaces'; 
import { useCart, CartItem } from '../context/CartContext'; 

interface UseProductsHook {
  products: Product[];
  loading: boolean;
  categoryFilter: number;
  setCategoryFilter: (categoryId: number) => void;
  filteredProducts: Product[];
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, newQuantity: number) => void;
  getCartTotal: () => number;
  handleUpdateCartItemQuantity: (item: CartItem, delta: number) => void;
  categories: { id: number; label: string }[];
}

export const useProducts = (): UseProductsHook => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<number>(0);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { cartItems, addToCart, removeFromCart, updateQuantity, getCartTotal } = useCart();

  // Adicionando useRef para controlar se o componente já foi montado
  const mounted = useRef(false); 

  useEffect(() => {
    // Verifica se a flag mounted.current é false.
    // Isso garante que a requisição só será feita na primeira montagem real do componente,
    // ignorando a segunda execução do StrictMode.
    if (!mounted.current) {
      mounted.current = true; // Marca como montado após a primeira execução
      
      getAllProducts()
        .then((data) => {
          setProducts(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Erro ao carregar produtos:', error);
          setProducts([]);
          setLoading(false);
        });
    }

    // O retorno do useEffect é para limpeza, se houvesse algo a ser cancelado (ex: abortar requisição)
    // Não é estritamente necessário para este caso simples de fetching.
  }, []); // Array de dependências vazio para rodar apenas uma vez (no StrictMode, duas vezes, mas nosso if impede a segunda)

  const filteredProducts = useMemo(() => {
    return categoryFilter === 0
      ? products
      : products.filter(
          (product) => product.menuCategoryId != null && Number(product.menuCategoryId) === categoryFilter
        );
  }, [products, categoryFilter]);

  const handleUpdateCartItemQuantity = useCallback((item: CartItem, delta: number) => {
    if (typeof item.id === 'number') {
      updateQuantity(item.id, item.quantity + delta);
    }
  }, [updateQuantity]);

  const categories = useMemo(() => [
    { id: 0, label: 'Todos' },
    { id: 1, label: 'Bebidas' },
    { id: 2, label: 'Sobremesas' },
    { id: 3, label: 'Lanches' },
    { id: 4, label: 'Almoço' },
  ], []);

  return {
    products,
    loading,
    categoryFilter,
    setCategoryFilter,
    filteredProducts,
    isCartOpen,
    setIsCartOpen,
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    handleUpdateCartItemQuantity,
    categories,
  };
};