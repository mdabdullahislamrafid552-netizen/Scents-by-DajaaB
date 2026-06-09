'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import { PRODUCTS } from '@/data/products';

interface CartItem { id: string; qty: number; size?: string; }
interface ToastData { id: string; qty: number; size?: string; }

interface CartContextType {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  drawerOpen: boolean;
  setDrawerOpen: (v: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  toast: ToastData | null;
  addToCart: (id: string, qty?: number, size?: string) => void;
  cartCount: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [toast, setToast] = useState<ToastData | null>(null);

  const addToCart = (id: string, qty = 1, size?: string) => {
    setCart(prev => {
      const exists = prev.find(c => c.id === id && c.size === size);
      if (exists) return prev.map(c => (c.id === id && c.size === size) ? { ...c, qty: c.qty + qty } : c);
      return [...prev, { id, qty, size }];
    });
    setDrawerOpen(true);
    setToast({ id, qty, size });
    setTimeout(() => setToast(null), 1800);
  };

  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  return (
    <CartContext.Provider value={{ cart, setCart, drawerOpen, setDrawerOpen, searchOpen, setSearchOpen, toast, addToCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
