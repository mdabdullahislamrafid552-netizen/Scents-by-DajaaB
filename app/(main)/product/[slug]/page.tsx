'use client';
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { PRODUCTS, TIERS } from '@/data/products';
import { Icon } from '@/components/Icons';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';

const FALLBACK = '/file.svg';

export default function ProductPage() {
  const params   = useParams();
  const router   = useRouter();
  const { addToCart } = useCart();
  const p = PRODUCTS.find(x => x.slug === params.slug);

  if (!p) {
    return (
      <div className="container section" style={{ textAlign: 'center' }}>
        <h2>Bottle not found.</h2>
        <button onClick={() => router.push('/shop')} className="btn btn--ghost" style={{ marginTop: 20 }}>Back to shop</button>
      </div>
    );
  }

  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [openAcc, setOpenAcc] = useState('ingredients');
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});

  const gallery = p.images.length > 0 ? p.images : [p.mainImage];
  const totalImgs = gallery.length;
  const related = PRODUCTS.filter(x => x.id !== p.id && (x.tier === p.tier || x.family === p.family)).slice(0, 4);

  function handleImgError(idx: number) {
    setImgErrors(prev => ({ ...prev, [idx]: true }));
  }
  function prev() { setActiveImage(i => (i - 1 + totalImgs) % totalImgs); }
  function next() { setActiveImage(i => (i + 1) % totalImgs); }

  return (
    <div className="fade-in">
      {/* Breadcrumb */}
      <div className="container" style={{ padding: '20px 32px 0', color: 'var(--mute)', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        <a onClick={() => router.push('/')} style={{ cursor: 'pointer' }}>Home</a>
        <span style={{ margin: '0 8px' }}>/</span>
        <a onClick={() => router.push('/shop')} style={{ cursor: 'pointer' }}>Shop</a>
        <span style={{ margin: '0 8px' }}>/</span>
        <span style={{ color: 'var(--ink)' }}>{p.name}</span>
      </div>

      <section style={{ padding: '24px 0 64px' }}>
        <div className="container">
          <div className="product-detail-grid">

            {/* ── Gallery ── */}
            <div>
              {/* Main image */}
              <div style={{ position: 'relative', aspectRatio: '4/5', overflow: 'hidden', background: 'var(--cream-2)' }}>
                <Image
                  key={gallery[activeImage]}
                  src={imgErrors[activeImage] ? FALLBACK : gallery[activeImage]}
                  alt={`${p.name} by ${p.brand} — view ${activeImage + 1}`}
                  fill priority
                  sizes="(max-width: 768px) 100vw, 55vw"
                  style={{ objectFit: 'cover', objectPosition: 'center', transition: 'opacity 0.3s ease' }}
                  onError={() => handleImgError(activeImage)}
                />
                {p.tier === 'niche' && (
                  <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 2 }}>
                    <span className="chip chip--solid-gold">Niche</span>
                  </div>
                )}
                {totalImgs > 1 && (
                  <div style={{ position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.45)', color: '#fff', fontSize: 11, padding: '4px 10px', letterSpacing: '0.12em', zIndex: 2 }}>
                    {activeImage + 1} / {totalImgs}
                  </div>
                )}
                {totalImgs > 1 && (
                  <>
                    <button onClick={prev}
                      style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 44, height: 44, border: '1px solid rgba(255,255,255,0.6)', color: 'white', background: 'rgba(0,0,0,0.25)', zIndex: 2, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <Icon.ArrowL />
                    </button>
                    <button onClick={next}
                      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', width: 44, height: 44, border: '1px solid rgba(255,255,255,0.6)', color: 'white', background: 'rgba(0,0,0,0.25)', zIndex: 2, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <Icon.Arrow />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail strip */}
              {totalImgs > 1 && (
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(totalImgs, 5)}, 1fr)`, gap: 10, marginTop: 10 }}>
                  {gallery.map((src, i) => (
                    <button key={i} onClick={() => setActiveImage(i)}
                      style={{ position: 'relative', aspectRatio: '1/1', padding: 0, border: i === activeImage ? '2px solid var(--ink)' : '1px solid var(--line)', cursor: 'pointer', overflow: 'hidden', background: 'var(--cream-2)' }}
                      aria-label={`View image ${i + 1}`}>
                      <Image
                        src={imgErrors[i] ? FALLBACK : src}
                        alt={`${p.name} thumbnail ${i + 1}`}
                        fill sizes="15vw"
                        style={{ objectFit: 'cover', objectPosition: 'center' }}
                        onError={() => handleImgError(i)}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Product info ── */}
            <div style={{ paddingTop: 8 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <span className={`chip ${p.tier === 'niche' ? 'chip--solid-gold' : 'chip--solid-ink'}`}>{TIERS[p.tier].label}</span>
                <span className="chip" style={{ color: 'var(--mute)', borderColor: 'var(--line)' }}>{p.gender === 'unisex' ? 'Unisex' : p.gender === 'women' ? 'Women' : 'Men'}</span>
              </div>
              <div className="eyebrow eyebrow--gold" style={{ marginTop: 20 }}>{p.brand}</div>
              <h1 style={{ fontSize: 'clamp(36px, 5vw, 76px)', marginTop: 8, lineHeight: 1 }}>
                {p.name.split(' ').map((w, i, arr) => (
                  <span key={i}>
                    {i === arr.length - 1 ? <span className="italic" style={{ color: 'var(--gold-deep)' }}>{w}</span> : w}
                    {i < arr.length - 1 ? ' ' : ''}
                  </span>
                ))}
              </h1>
              <div style={{ marginTop: 16, fontFamily: 'var(--serif)', fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 500 }}>
                ${p.price.toFixed(2)}
                <span style={{ fontSize: 12, color: 'var(--mute)', marginLeft: 10, fontFamily: 'var(--sans)' }}>per bottle · Pickup Memphis</span>
              </div>
              <p style={{ marginTop: 20, fontSize: 16, lineHeight: 1.65, color: 'var(--char)' }}>{p.desc}</p>

              {/* Scent pyramid */}
              <div style={{ marginTop: 28, padding: '24px 0', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
                <div className="eyebrow eyebrow--gold" style={{ marginBottom: 16 }}>The Scent Pyramid</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', rowGap: 14, columnGap: 20, alignItems: 'start' }}>
                  <PyramidLevel level="Top"   notes={p.notes.top} />
                  <PyramidLevel level="Heart" notes={p.notes.middle} />
                  <PyramidLevel level="Base"  notes={p.notes.base} />
                </div>
              </div>

              {/* Qty + Add to bag */}
              <div style={{ display: 'flex', gap: 12, marginTop: 24, alignItems: 'stretch', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--ink)', flexShrink: 0 }}>
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 48, height: 52, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Icon.Minus /></button>
                  <span style={{ width: 36, textAlign: 'center', fontSize: 15 }}>{qty}</span>
                  <button onClick={() => setQty(q => Math.min(p.stockCount, q + 1))} style={{ width: 48, height: 52, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Icon.Plus /></button>
                </div>
                <button className="btn btn--primary" style={{ flex: 1, minWidth: 160 }} onClick={() => addToCart(p.id, qty)}>
                  Add to Bag — ${(p.price * qty).toFixed(0)} <Icon.Arrow />
                </button>
                <button className="btn btn--ghost" aria-label="Save" style={{ padding: '0 16px' }}><Icon.Heart /></button>
              </div>

              <div style={{ marginTop: 14, display: 'flex', gap: 16, fontSize: 12, color: 'var(--mute)', flexWrap: 'wrap' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon.Check /> {p.stockCount} in stock</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon.Pin /> Pickup only · Memphis</span>
              </div>

              {/* Bundle upsell */}
              <div style={{ marginTop: 20, padding: 18, background: p.tier === 'niche' ? 'var(--ink)' : 'var(--beige)', color: p.tier === 'niche' ? 'var(--cream)' : 'var(--ink)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                  <Icon.Sparkle style={{ color: 'var(--gold)', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 160 }}>
                    <div className="eyebrow" style={{ color: 'var(--gold)' }}>Bundle this bottle</div>
                    <div style={{ fontFamily: 'var(--serif)', fontSize: 18, marginTop: 4 }}>
                      {p.tier === 'niche'
                        ? <>Add <span className="italic">one more niche</span> — $190 for both.</>
                        : <>Add <span className="italic">four more designer</span> — $125 for five.</>
                      }
                    </div>
                  </div>
                  <button onClick={() => router.push(`/shop?tier=${p.tier}`)} className={p.tier === 'niche' ? 'btn btn--gold btn--sm' : 'btn btn--primary btn--sm'}>
                    Browse <Icon.Arrow />
                  </button>
                </div>
              </div>

              {/* Accordions */}
              <div style={{ marginTop: 28, borderTop: '1px solid var(--line)' }}>
                <Accordion title="The Story Behind The Bottle" open={openAcc === 'story'} onToggle={() => setOpenAcc(openAcc === 'story' ? '' : 'story')}>
                  Sourced through Dajaa's authorized network. Each {p.name} ships from {p.brand}'s authentic distribution and is verified at the Memphis studio before listing. Reach out at 901·921·2322 if you'd like batch info before pickup.
                </Accordion>
                <Accordion title="How To Wear It" open={openAcc === 'wear'} onToggle={() => setOpenAcc(openAcc === 'wear' ? '' : 'wear')}>
                  {p.tier === 'niche' ? 'Two sprays. Pulse points. Let it sit five minutes — niche fragrances open with patience.' : "Three sprays. One neck, one chest, one wrist. Don't rub. The dry-down does the work."}
                </Accordion>
                <Accordion title="Pickup & Authenticity" open={openAcc === 'pickup'} onToggle={() => setOpenAcc(openAcc === 'pickup' ? '' : 'pickup')}>
                  Reserve here. Dajaa confirms by text within 2 hours and shares the pickup window. Pay on pickup at the Memphis studio (cash, Zelle, Apple Pay). Every bottle inspected on handoff.
                </Accordion>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related products */}
      <section style={{ background: 'var(--cream-2)', padding: '56px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 48px)' }}>You may also <span className="italic">like.</span></h2>
            <a onClick={() => router.push('/shop')} className="linklink">Shop all <Icon.Arrow /></a>
          </div>
          <div className="grid-4">
            {related.map(rp => <ProductCard key={rp.id} p={rp} addToCart={addToCart} />)}
          </div>
        </div>
      </section>
    </div>
  );
}

function PyramidLevel({ level, notes }: { level: string; notes: string[] }) {
  return (
    <>
      <div className="eyebrow eyebrow--gold" style={{ paddingTop: 4 }}>{level}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {notes.map(n => (
          <span key={n} style={{ padding: '5px 12px', border: '1px solid var(--line)', fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 14, background: 'var(--cream)' }}>{n}</span>
        ))}
      </div>
    </>
  );
}

function Accordion({ title, children, open, onToggle }: { title: string; children: React.ReactNode; open: boolean; onToggle: () => void }) {
  return (
    <div style={{ borderBottom: '1px solid var(--line)' }}>
      <button onClick={onToggle} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 0', textAlign: 'left', minHeight: 56 }}>
        <span style={{ fontFamily: 'var(--serif)', fontSize: 17, fontWeight: 500 }}>{title}</span>
        <span style={{ fontSize: 18, flexShrink: 0, marginLeft: 12 }}>{open ? '−' : '+'}</span>
      </button>
      {open && <div style={{ padding: '0 0 20px', color: 'var(--char)', fontSize: 14, lineHeight: 1.7, maxWidth: 560 }}>{children}</div>}
    </div>
  );
}
