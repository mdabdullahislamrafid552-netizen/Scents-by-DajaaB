'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { PRODUCTS } from '@/data/products';
import { Icon, Wordmark } from './Icons';
import Bottle from './Bottle';

interface Props { open: boolean; onClose: () => void; }

export default function SearchOverlay({ open, onClose }: Props) {
  const [q, setQ] = useState('');
  const ref = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => { if (open) setTimeout(() => ref.current?.focus(), 50); else setQ(''); }, [open]);

  const ql = q.trim().toLowerCase();
  const results = ql.length > 0
    ? PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(ql) ||
        p.brand.toLowerCase().includes(ql) ||
        p.family.toLowerCase().includes(ql) ||
        [...p.notes.top, ...p.notes.middle, ...p.notes.base].some(n => n.toLowerCase().includes(ql))
      ).slice(0, 8)
    : [];

  const suggested = ['Aventus', 'Baccarat', 'Tom Ford', 'Oud', 'Vanilla', 'Niche', 'Bundles'];

  return (
    <div className={`search-overlay ${open ? 'open' : ''}`}>
      <div className="container" style={{ paddingTop: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Wordmark size={32} />
          <button onClick={onClose}><Icon.Close /></button>
        </div>
        <div style={{ marginTop: 80, maxWidth: 800, margin: '80px auto 0' }}>
          <div className="eyebrow eyebrow--gold" style={{ textAlign: 'center' }}>Search the House</div>
          <div style={{ position: 'relative', marginTop: 16 }}>
            <input ref={ref} value={q} onChange={e => setQ(e.target.value)}
                   placeholder="Try 'Aventus', 'oud', 'vanilla'…"
                   style={{ width: '100%', fontFamily: 'var(--serif)', fontSize: 48, border: 0, borderBottom: '1px solid var(--ink)', padding: '12px 0', outline: 'none', background: 'transparent', textAlign: 'center', color: 'var(--ink)' }} />
            <Icon.Search style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          {ql.length === 0 && (
            <div style={{ marginTop: 40, textAlign: 'center' }}>
              <div className="eyebrow" style={{ marginBottom: 16 }}>Try searching</div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
                {suggested.map(s => (
                  <button key={s} onClick={() => setQ(s)} className="btn btn--ghost btn--sm">{s}</button>
                ))}
              </div>
            </div>
          )}

          {ql.length > 0 && results.length === 0 && (
            <div style={{ marginTop: 40, textAlign: 'center', color: 'var(--mute)' }}>
              No matches in stock. Text Dajaa at <strong>901·921·2322</strong> — she may have it coming.
            </div>
          )}

          {results.length > 0 && (
            <div style={{ marginTop: 40 }}>
              <div className="eyebrow eyebrow--gold" style={{ marginBottom: 16 }}>{results.length} matches</div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {results.map(p => (
                  <a key={p.id} onClick={() => { onClose(); router.push(`/product/${p.slug}`); }}
                     style={{ display: 'grid', gridTemplateColumns: '60px 1fr auto', gap: 16, alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--line-soft)', cursor: 'pointer' }}>
                    <div className="bottle-frame" style={{ width: 60, height: 80 }}>
                      <Bottle {...p.visual} silk={false} />
                    </div>
                    <div>
                      <div className="eyebrow">{p.brand}</div>
                      <div style={{ fontFamily: 'var(--serif)', fontSize: 22 }}>{p.name}</div>
                    </div>
                    <div style={{ fontFamily: 'var(--serif)', fontSize: 22 }}>${p.price}</div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
