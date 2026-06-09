'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

type Product = any; // Will use proper types later
type Settings = any;

interface StoreData {
  products: Product[];
  settings: Settings | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

const StoreDataContext = createContext<StoreData>({
  products: [],
  settings: null,
  loading: true,
  refresh: async () => {}
});

export const useStoreData = () => useContext(StoreDataContext);

export function StoreDataProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const [pRes, sRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/settings')
      ]);
      const pData = await pRes.json();
      const sData = await sRes.json();
      
      if (!pRes.ok || !pData || pData.length === 0) {
        setProducts(require('../data/products').PRODUCTS);
      } else {
        setProducts(pData);
      }
      
      setSettings(sData || null);
    } catch (e) {
      setProducts(require('../data/products').PRODUCTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <StoreDataContext.Provider value={{ products, settings, loading, refresh }}>
      {children}
    </StoreDataContext.Provider>
  );
}
