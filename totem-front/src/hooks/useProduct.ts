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
  const mounted = useRef(false); 

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true; 
      
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

  }, []); 

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