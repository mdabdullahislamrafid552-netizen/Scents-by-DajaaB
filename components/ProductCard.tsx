'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProductImage from '@/components/ProductImage';
import { Product } from '@/data/products';

interface Props {
  p: Product;
  addToCart: (id: string, qty?: number) => void;
}

export default function ProductCard({ p, addToCart }: Props) {
  const router = useRouter();
  const go = () => router.push(`/product/${p.slug}`);

  return (
    <div className="product-card">
      <div onClick={go} className="product-card__media" style={{
        position: 'relative', aspectRatio: '4/5', cursor: 'pointer', overflow: 'hidden',
        background: p.tier === 'niche' ? '#0e0e0e' : 'var(--cream-2)',
      }}>
        <ProductImage
          src={p.mainImage}
          alt={`${p.name} by ${p.brand}`}
          fill
          loading="lazy"
          sizes="(max-width: 768px) 50vw, 25vw"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          dark={p.tier === 'niche'}
        />
        {p.tier === 'niche' && (
          <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 2 }}>
            <span className="chip chip--solid-gold" style={{ fontSize: 9, padding: '4px 8px' }}>Niche</span>
          </div>
        )}
        {!p.inStock && (
          <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 2 }}>
            <span className="chip" style={{ background: 'var(--ink)', color: 'var(--cream)', border: '1px solid var(--ink)' }}>Sold Out</span>
          </div>
        )}
        {p.images.length > 1 && (
          <div style={{ position: 'absolute', bottom: 10, right: 10, zIndex: 2,
            background: 'rgba(0,0,0,0.4)', color: '#fff', fontSize: 9, padding: '3px 7px', letterSpacing: '0.08em' }}>
            1 / {p.images.length}
          </div>
        )}
        <div className="product-card__cta">
          <button className="btn btn--primary btn--block btn--sm"
                  onClick={e => { e.stopPropagation(); addToCart(p.id); }}>
            Quick Add — ${p.price}
          </button>
        </div>
      </div>
      <div onClick={go} style={{ paddingTop: 14, cursor: 'pointer' }}>
        <div className="eyebrow" style={{ fontSize: 10, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{p.brand}</div>
        <div className="product-card__name" style={{
          fontFamily: 'var(--serif)', fontSize: 'clamp(14px, 3.5vw, 20px)', marginTop: 4, lineHeight: 1.2, fontWeight: 500,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden',
        }}>{p.name}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, gap: 8 }}>
          <span style={{ color: 'var(--mute)', fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {p.gender === 'unisex' ? 'Unisex' : p.gender === 'women' ? 'Women' : 'Men'}
          </span>
          <span className="product-card__price" style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(15px, 3vw, 18px)', fontWeight: 500, flexShrink: 0 }}>${p.price}</span>
        </div>
        <button onClick={e => { e.stopPropagation(); addToCart(p.id); }}
                className="btn btn--ghost"
                style={{ marginTop: 12, width: '100%', padding: '10px 14px', fontSize: 11, letterSpacing: '0.2em' }}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}
