'use client';
import { ReactNode } from 'react';
import { useCart } from '@/context/CartContext';
import Header from './Header';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import SearchOverlay from './SearchOverlay';
import Toast from './Toast';

export default function ShellClient({ children }: { children: ReactNode }) {
  const { drawerOpen, setDrawerOpen, searchOpen, setSearchOpen, toast, cartCount, cart, setCart } = useCart();
  return (
    <>
      <Header cartCount={cartCount} openCart={() => setDrawerOpen(true)} openSearch={() => setSearchOpen(true)} />
      {children}
      <Footer />
      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} cart={cart} setCart={setCart} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      {toast && <Toast id={toast.id} qty={toast.qty} />}
    </>
  );
}
