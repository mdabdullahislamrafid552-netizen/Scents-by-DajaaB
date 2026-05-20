'use client';
import { PRODUCTS } from '@/data/products';

export default function Toast({ id, qty }: { id: string; qty: number }) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return null;
  return (
    <div style={{
      position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)',
      background: 'var(--ink)', color: 'var(--cream)', padding: '16px 24px',
      display: 'inline-flex', alignItems: 'center', gap: 14, zIndex: 200,
      boxShadow: '0 30px 60px -20px rgba(0,0,0,0.4)', animation: 'fadeIn 200ms',
    }}>
      <span style={{ width: 36, height: 36, background: 'var(--gold)', color: 'var(--ink)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--script)', fontSize: 22 }}>✓</span>
      <div>
        <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)' }}>Added · ×{qty}</div>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 18 }}>{p.name}</div>
      </div>
    </div>
  );
}
