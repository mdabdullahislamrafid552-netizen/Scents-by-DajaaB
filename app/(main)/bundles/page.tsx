'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useStoreData } from '@/context/StoreDataContext';
import { Icon } from '@/components/Icons';
import { useCart } from '@/context/CartContext';

const FALLBACK = '/file.svg';

export default function BundlesPage() {
  const router = useRouter();
  const { addToCart } = useCart();
  const { products: PRODUCTS } = useStoreData();
  const [mode, setMode] = useState<'designer' | 'niche'>('designer');
  const designer = PRODUCTS.filter((p: any) => p.tier !== 'niche');
  const niche = PRODUCTS.filter((p: any) => p.tier === 'niche');
  const pool = mode === 'designer' ? designer : niche;
  const cap = mode === 'designer' ? 5 : 2;
  const price = mode === 'designer' ? 125 : 190;

  const [picks, setPicks] = useState<string[]>([]);
  const togglePick = (id: string) => setPicks(ps => {
    if (ps.includes(id)) return ps.filter(x => x !== id);
    if (ps.length >= cap) return [...ps.slice(1), id];
    return [...ps, id];
  });

  const pickedProducts = picks.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean) as typeof PRODUCTS;
  const orig = pickedProducts.reduce((s, p) => s + p.price, 0);
  const savings = picks.length === cap ? orig - price : 0;

  const addBundle = () => {
    if (picks.length !== cap) return;
    picks.forEach(id => {
      const p = PRODUCTS.find((x: any) => x.id === id);
      const sizes = Array.isArray(p?.sizes) ? p.sizes : (typeof p?.sizes === 'string' ? JSON.parse(p.sizes) : []);
      const size = sizes[0]?.size;
      addToCart(id, 1, size);
    });
    router.push('/checkout');
  };

  return (
    <div className="fade-in">

      {/* ── Hero ── */}
      <section style={{ background: 'var(--ink)', color: 'var(--cream)', padding: 'clamp(48px, 8vw, 80px) 0 clamp(40px, 6vw, 60px)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="eyebrow" style={{ color: 'var(--gold)', marginBottom: 16 }}>✦ Bundle Deals · The Margin Move</div>
          <h1 style={{ color: 'var(--cream)' }}>
            Buy the <span className="italic" style={{ color: 'var(--gold)' }}>shelf.</span><br />Pay <span className="italic">half.</span>
          </h1>
          <p style={{ maxWidth: 580, margin: '24px auto 0', fontSize: 'clamp(14px, 2.5vw, 17px)', lineHeight: 1.65, color: 'rgba(250,246,236,0.8)', padding: '0 8px' }}>
            Two house bundles, designed to let you build a wardrobe. Mix tiers, genders, and scent families however you want — the cart counts and the math just happens.
          </p>
        </div>
      </section>

      {/* ── Bundle selector + builder ── */}
      <section className="section">
        <div className="container">

          {/* Deal cards — stack on mobile */}
          <div className="bundle-deal-cards">
            <DealCard
              active={mode === 'designer'}
              onSelect={() => { setMode('designer'); setPicks([]); }}
              count={5} price={125} title="The Designer Five" tag="Save up to $375"
              subtitle="Pick any 5 from Tom Ford, YSL, Dior, Chanel, Carolina Herrera, Versace, Valentino, Prada, Gucci."
              note="Most popular · Mix women's + men's"
            />
            <DealCard
              active={mode === 'niche'}
              onSelect={() => { setMode('niche'); setPicks([]); }}
              count={2} price={190} title="The Niche Pair" tag="Save up to $400"
              subtitle="Pick any 2 from Creed, Maison Francis Kurkdjian, Clive Christian, Initio."
              note="The flex move" dark
            />
          </div>

          {/* Bundle builder */}
          <div className="bundle-builder">

            {/* Builder header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <div className="eyebrow eyebrow--gold">Bundle Builder · {mode === 'designer' ? '5 for $125' : '2 for $190'}</div>
                <h2 style={{ marginTop: 8, fontSize: 'clamp(28px, 4vw, 44px)' }}>Pick your {cap}.</h2>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="eyebrow">{picks.length} of {cap} selected</div>
                <div className="bundle-progress-bar">
                  <div style={{ position: 'absolute', inset: 0, width: `${(picks.length / cap) * 100}%`, background: 'var(--gold)', transition: 'width 220ms ease' }} />
                </div>
              </div>
            </div>

            {/* Selected slots — real product images */}
            <div className="bundle-slots" style={{ marginTop: 24, minHeight: 'clamp(120px, 20vw, 200px)' }}>
              {Array.from({ length: cap }).map((_, i) => {
                const p = pickedProducts[i];
                return (
                  <div key={i} style={{
                    flex: 1, position: 'relative', overflow: 'hidden',
                    border: p ? '1px solid var(--ink)' : '1px dashed var(--line)',
                    background: p ? (p.tier === 'niche' ? '#0e0e0e' : 'var(--cream-2)') : 'var(--cream)',
                    minWidth: 52, aspectRatio: '3/4',
                  }}>
                    {p ? (
                      <>
                        <Image
                          src={p.main_image || p.mainImage}
                          alt={p.name}
                          fill
                          sizes="(max-width: 768px) 20vw, 140px"
                          style={{ objectFit: 'cover', objectPosition: 'center' }}
                          onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }}
                        />
                        {/* Subtle overlay */}
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.45) 100%)', zIndex: 1 }} />
                        {/* Remove button */}
                        <button
                          onClick={() => togglePick(p.id)}
                          style={{ position: 'absolute', top: 6, right: 6, width: 26, height: 26, background: 'rgba(255,255,255,0.9)', border: '1px solid var(--ink)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', zIndex: 3 }}>
                          <Icon.Close width="12" height="12" />
                        </button>
                        {/* Name label */}
                        <div style={{ position: 'absolute', bottom: 6, left: 4, right: 4, fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'center', zIndex: 2, color: 'var(--cream)', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                      </>
                    ) : (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: 'var(--mute)', gap: 4 }}>
                        <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 'clamp(24px, 4vw, 48px)', color: 'var(--line)' }}>{i + 1}</span>
                        <span style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase' }}>Slot {i + 1}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Price summary — responsive grid */}
            <div className="bundle-summary-row">
              <div>
                <div className="eyebrow">If bought separately</div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(20px, 3vw, 28px)', textDecoration: orig > 0 && picks.length === cap ? 'line-through' : 'none', color: 'var(--mute)', marginTop: 4 }}>
                  ${orig > 0 ? orig.toFixed(0) : '—'}
                </div>
              </div>
              <div>
                <div className="eyebrow eyebrow--gold">Bundle savings</div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(20px, 3vw, 28px)', color: 'var(--gold-deep)', marginTop: 4 }}>−${savings.toFixed(0)}</div>
              </div>
              <div>
                <div className="eyebrow">Your price</div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(32px, 5vw, 44px)', lineHeight: 1, fontWeight: 500, marginTop: 4 }}>
                  ${picks.length === cap ? price : '—'}
                </div>
              </div>
              <button
                onClick={addBundle}
                disabled={picks.length !== cap}
                className="btn btn--primary btn--lg"
                style={{ opacity: picks.length === cap ? 1 : 0.4, cursor: picks.length === cap ? 'pointer' : 'not-allowed' }}>
                Add bundle <Icon.Arrow />
              </button>
            </div>

            {/* Product picker grid — real images */}
            <div style={{ marginTop: 40 }}>
              <div className="eyebrow eyebrow--ink" style={{ marginBottom: 16 }}>
                Choose from {pool.length} {mode === 'designer' ? 'designer' : 'niche'} bottles
              </div>
              <div className="bundle-picker-grid">
                {pool.map(p => {
                  const isPicked = picks.includes(p.id);
                  return (
                    <button key={p.id} onClick={() => togglePick(p.id)} className="product-card" style={{ position: 'relative', textAlign: 'left' }}>
                      <div style={{
                        position: 'relative', aspectRatio: '4/5', overflow: 'hidden',
                        background: p.tier === 'niche' ? '#0e0e0e' : 'var(--cream-2)',
                        border: isPicked ? '2px solid var(--gold)' : '1px solid var(--line-soft)',
                        transition: 'border-color 200ms',
                      }}>
                        <Image
                          src={p.main_image || p.mainImage}
                          alt={`${p.name} by ${p.brand}`}
                          fill
                          loading="lazy"
                          sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 17vw"
                          style={{ objectFit: 'cover', objectPosition: 'center' }}
                          onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }}
                        />
                        {isPicked && (
                          <div style={{ position: 'absolute', top: 8, right: 8, width: 28, height: 28, background: 'var(--gold)', color: 'var(--ink)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
                            <Icon.Check />
                          </div>
                        )}
                        {isPicked && (
                          <div style={{ position: 'absolute', inset: 0, background: 'rgba(201,169,97,0.12)', zIndex: 1 }} />
                        )}
                      </div>
                      <div style={{ paddingTop: 8 }}>
                        <div className="eyebrow" style={{ fontSize: 9, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{p.brand}</div>
                        <div style={{
                          fontFamily: 'var(--serif)', fontSize: 'clamp(12px, 2vw, 16px)', lineHeight: 1.2, marginTop: 2,
                          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden',
                        }}>{p.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--mute)', marginTop: 3 }}>${p.price}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Fine print ── */}
      <section style={{ padding: 'clamp(48px, 8vw, 60px) 0 clamp(60px, 10vw, 100px)' }}>
        <div className="container">
          <h3 style={{ fontSize: 'clamp(24px, 4vw, 36px)', marginBottom: 32 }}>The fine <span className="italic">print.</span></h3>
          <div className="bundle-rules-grid">
            {[
              { t: 'Auto-applied', d: 'Add five designer or two niche to your bag — the discount applies in cart, no code needed.' },
              { t: 'Mix freely', d: "Designer bundle accepts any combination of women's + men's. Niche bundle: any combination of niche bottles." },
              { t: 'Stackable', d: 'Build multiple bundles in one order. Ten designer = two bundles, $250 total. Four niche = two bundles, $380.' },
              { t: 'Pickup only', d: 'All bundle orders are reserved for Memphis pickup. Pay at the studio.' },
              { t: 'Subject to stock', d: "Stock is shown live. If something sells out between cart and pickup, Dajaa will substitute or refund." },
              { t: 'No code, no fuss', d: 'Bundle pricing replaces individual pricing automatically. No coupon to remember.' },
            ].map(rule => (
              <div key={rule.t} style={{ borderTop: '1px solid var(--ink)', paddingTop: 20 }}>
                <h4 style={{ fontFamily: 'var(--serif)', fontSize: 22, fontStyle: 'italic', color: 'var(--gold-deep)' }}>{rule.t}</h4>
                <p style={{ marginTop: 8, color: 'var(--char)', fontSize: 14, lineHeight: 1.6 }}>{rule.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function DealCard({ count, price, title, tag, subtitle, note, dark, active, onSelect }: {
  count: number; price: number; title: string; tag: string; subtitle: string; note: string;
  dark?: boolean; active: boolean; onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className="bundle-deal-card"
      style={{
        textAlign: 'left', width: '100%',
        background: dark ? 'var(--ink)' : 'var(--cream-2)',
        color: dark ? 'var(--cream)' : 'var(--ink)',
        border: active ? '2px solid var(--gold)' : (dark ? '2px solid var(--ink)' : '2px solid transparent'),
        cursor: 'pointer', position: 'relative', transition: 'border-color 200ms',
      }}>
      <div style={{ position: 'absolute', top: 20, right: 20, fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: dark ? 'var(--gold)' : 'var(--gold-deep)', fontWeight: 500 }}>{tag}</div>
      <div className="eyebrow" style={{ color: dark ? 'var(--gold)' : 'var(--gold-deep)', paddingRight: 100 }}>{dark ? 'Niche Bundle' : 'Designer Bundle'}</div>
      <h2 style={{ color: dark ? 'var(--cream)' : 'var(--ink)', fontSize: 'clamp(40px, 8vw, 88px)', lineHeight: 0.9, marginTop: 12 }}>
        <span style={{ fontStyle: 'italic' }}>{count}</span><br />
        for <span style={{ color: dark ? 'var(--gold)' : 'var(--gold-deep)' }}>${price}</span>
      </h2>
      <h3 style={{ marginTop: 24, color: dark ? 'var(--cream)' : 'var(--ink)', fontSize: 'clamp(18px, 3vw, 28px)', fontWeight: 400 }}>{title}</h3>
      <p style={{ marginTop: 8, color: dark ? 'rgba(250,246,236,0.7)' : 'var(--char)', fontSize: 14, lineHeight: 1.6 }}>{subtitle}</p>
      <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span className="eyebrow" style={{ color: dark ? 'var(--gold)' : 'var(--gold-deep)' }}>{note}</span>
      </div>
      <div style={{ marginTop: 28, paddingTop: 20, borderTop: dark ? '1px solid rgba(201,169,97,0.3)' : '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="eyebrow" style={{ color: dark ? 'var(--gold)' : 'var(--ink)' }}>{active ? 'Building below ↓' : 'Build this bundle'}</span>
        <Icon.Arrow />
      </div>
    </button>
  );
}
