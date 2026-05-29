'use client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ProductImage from '@/components/ProductImage';
import { PRODUCTS } from '@/data/products';
import { Icon } from '@/components/Icons';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';

export default function HomeContent() {
  const router = useRouter();
  const { addToCart } = useCart();
  const featured = PRODUCTS.filter(p => p.featured);
  const bestSellers = [...featured, ...PRODUCTS.filter(p => !p.featured).slice(0, Math.max(0, 8 - featured.length))].slice(0, 8);
  const niche = PRODUCTS.filter(p => p.tier === 'niche').slice(0, 4);
  const editorPick = PRODUCTS.find(p => p.slug === 'baccarat-rouge-540')!;

  return (
    <div className="fade-in">
      {/* ── HERO ── */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="container" style={{ paddingTop: 32, paddingBottom: 0 }}>
          <div className="hero-grid">
            {/* Text side */}
            <div>
              <div className="kicker-mark">Memphis · Est. 2024 · Pickup Only</div>
              <h1 style={{ marginTop: 16, fontSize: 'clamp(36px, 6vw, 82px)' }}>
                The shelf of{' '}
                <span style={{ fontFamily: 'var(--script)', color: 'var(--gold-deep)', fontSize: '1.15em', display: 'inline-block', transform: 'translateY(0.06em)' }}>premium</span>{' '}
                <span style={{ fontStyle: 'italic' }}>scents</span> Memphis has been waiting for.
              </h1>
              <p style={{ maxWidth: 460, marginTop: 16, fontSize: 15, lineHeight: 1.6, color: 'var(--char)' }}>
                Forty-six fragrances — hand-selected by Dajaa. Authentic Creed, Maison Francis Kurkdjian,
                Tom Ford, Clive Christian, and the house designers you actually wear. Pickup only, Memphis.
              </p>
              <div className="hero-ctas" style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
                <button className="btn btn--primary" onClick={() => router.push('/shop')}>Shop All 46 <Icon.Arrow /></button>
                <button className="btn btn--ghost" onClick={() => router.push('/bundles')}>5 for $125 · Bundle</button>
              </div>
              <div className="hero-stats" style={{ display: 'flex', gap: 28, marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--line)', flexWrap: 'wrap' }}>
                <Stat n="46" label="Premium scents" />
                <Stat n="13" label="Niche & luxury" />
                <Stat n="$125" label="Any 5 designer" />
                <Stat n="$190" label="Any 2 niche" />
              </div>
            </div>

            {/* Hero image */}
            <div style={{ position: 'relative' }}>
              <div className="hero-image-wrap" style={{ position: 'relative', aspectRatio: '4/5', maxWidth: 460, marginLeft: 'auto', overflow: 'hidden', boxShadow: 'var(--shadow-soft)' }}>
                <Image
                  src={editorPick.mainImage}
                  alt={editorPick.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 45vw"
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(26,26,26,0.2) 0%, transparent 45%, rgba(26,26,26,0.45) 100%)', zIndex: 1 }} />
                <div style={{ position: 'absolute', left: 16, top: 16, zIndex: 2, color: 'var(--gold)', fontSize: 10, letterSpacing: '0.32em', textTransform: 'uppercase' }}>✦ Editor's Pick</div>
                <div style={{ position: 'absolute', right: 16, top: 16, zIndex: 2, color: 'var(--cream)', textAlign: 'right' }}>
                  <div style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold)' }}>This week</div>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: 18, lineHeight: 1.1, marginTop: 4 }}>{editorPick.name}</div>
                </div>
                {/* Spinning badge — hidden on mobile via CSS */}
                <svg viewBox="0 0 200 200" width="96" height="96" className="spin hero-spinner"
                     style={{ position: 'absolute', left: -32, bottom: -32, zIndex: 2 }}>
                  <defs><path id="circleText" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" /></defs>
                  <circle cx="100" cy="100" r="78" fill="none" stroke="rgba(201,169,97,0.6)" strokeWidth="0.5" />
                  <text fontFamily="Inter" fontSize="10" letterSpacing="4" fill="rgba(201,169,97,0.9)">
                    <textPath href="#circleText">✦ ALL PREMIUM SCENTS · MEMPHIS TN · ALL PREMIUM SCENTS · MEMPHIS TN ·</textPath>
                  </text>
                  <text x="100" y="106" textAnchor="middle" fontFamily="'Pinyon Script', cursive" fontSize="36" fill="rgba(201,169,97,0.9)">Sd</text>
                </svg>
                <a onClick={() => router.push(`/product/${editorPick.slug}`)}
                   style={{ position: 'absolute', right: 16, bottom: 16, zIndex: 2, color: 'var(--cream)', borderBottom: '1px solid var(--gold)', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', paddingBottom: 4, cursor: 'pointer' }}>
                  Shop the bottle →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BRAND MARQUEE ── */}
      <section style={{ borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', background: 'var(--cream-2)', padding: '18px 0', overflow: 'hidden', marginTop: 40 }}>
        <div className="marquee" style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 20, color: 'var(--char)' }}>
          {[...Array(2)].flatMap((_, j) =>
            ['Creed','Maison Francis Kurkdjian','Tom Ford','Clive Christian','Initio','Carolina Herrera','Dior','Chanel','Valentino','Versace','YSL','Gucci','Prada']
              .map((b, i) => (
                <span key={`${j}-${i}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 28 }}>
                  <span>{b}</span><span style={{ color: 'var(--gold)' }}>✦</span>
                </span>
              ))
          )}
        </div>
      </section>

      {/* ── BEST SELLERS ── */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div className="eyebrow eyebrow--gold">The Memphis Best Sellers</div>
              <h2 style={{ marginTop: 8, fontSize: 'clamp(28px, 4vw, 52px)' }}>What's <span className="italic">walking</span> out the door.</h2>
            </div>
            <a onClick={() => router.push('/shop')} className="linklink">All 46 fragrances <Icon.Arrow /></a>
          </div>
          <div className="grid-4">
            {bestSellers.map(p => <ProductCard key={p.id} p={p} addToCart={addToCart} />)}
          </div>
        </div>
      </section>

      {/* ── NICHE SPOTLIGHT ── */}
      <section style={{ background: 'var(--ink)', color: 'var(--cream)', padding: '56px 0' }}>
        <div className="container">
          <div className="niche-header" style={{ marginBottom: 32 }}>
            <div>
              <div className="eyebrow" style={{ color: 'var(--gold)' }}>✦ The Niche Shelf</div>
              <h2 style={{ color: 'var(--cream)', marginTop: 10, fontSize: 'clamp(28px, 4vw, 56px)' }}>Thirteen bottles that earn their <span className="italic" style={{ color: 'var(--gold)' }}>price tag.</span></h2>
            </div>
            <div style={{ color: 'rgba(250,246,236,0.7)', fontSize: 14, lineHeight: 1.65 }}>
              Creed. Maison Francis Kurkdjian. Clive Christian. Initio.
              <div style={{ marginTop: 14 }}>
                <button className="btn btn--gold btn--sm" onClick={() => router.push('/shop?tier=niche')}>See all 13 niche <Icon.Arrow /></button>
              </div>
            </div>
          </div>
          <div className="grid-4">
            {niche.map(p => (
              <a key={p.id} onClick={() => router.push(`/product/${p.slug}`)} className="product-card" style={{ color: 'var(--cream)', cursor: 'pointer' }}>
                <div className="product-card__media" style={{ position: 'relative', aspectRatio: '4/5', overflow: 'hidden', background: '#0e0e0e', border: '1px solid rgba(201,169,97,0.25)' }}>
                  <ProductImage
                    src={p.mainImage}
                    alt={p.name}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 50vw, 25vw"
                    dark
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.5) 100%)', zIndex: 1 }} />
                  <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 2 }}>
                    <span style={{ background: 'var(--gold)', color: 'var(--ink)', fontSize: 9, letterSpacing: '0.2em', padding: '4px 8px', textTransform: 'uppercase', fontWeight: 500 }}>Niche</span>
                  </div>
                  <div className="product-card__cta" style={{ zIndex: 2 }}>
                    <button className="btn btn--gold btn--block btn--sm" onClick={e => { e.stopPropagation(); addToCart(p.id); }}>Quick Add — ${p.price}</button>
                  </div>
                </div>
                <div style={{ paddingTop: 12 }}>
                  <div className="eyebrow" style={{ color: 'var(--gold)', fontSize: 10 }}>{p.brand}</div>
                  <div className="product-card__name" style={{ fontFamily: 'var(--serif)', fontSize: 18, marginTop: 4, color: 'var(--cream)', lineHeight: 1.15 }}>{p.name}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                    <span style={{ fontFamily: 'var(--serif)', fontSize: 18, color: 'var(--cream)' }}>${p.price}</span>
                  </div>
                  <button onClick={e => { e.stopPropagation(); addToCart(p.id); }} className="btn"
                          style={{ marginTop: 10, width: '100%', padding: '10px 14px', fontSize: 11, letterSpacing: '0.2em', border: '1px solid var(--gold)', color: 'var(--gold)', background: 'transparent' }}>
                    Add to Cart
                  </button>
                </div>
              </a>
            ))}
          </div>

          {/* Bundle upsell */}
          <div className="niche-bundle-upsell" style={{ marginTop: 36, padding: '20px 28px', border: '1px solid var(--gold)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <div className="eyebrow" style={{ color: 'var(--gold)' }}>Bundle</div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(20px, 3vw, 28px)', color: 'var(--cream)', marginTop: 4 }}>
                Any 2 niche bottles — <span className="italic" style={{ color: 'var(--gold)' }}>$190</span>
              </div>
            </div>
            <button className="btn btn--gold btn--sm" onClick={() => router.push('/bundles')}>Build your bundle <Icon.Arrow /></button>
          </div>
        </div>
      </section>

      {/* ── BUNDLE DEALS BANNER ── */}
      <section style={{ background: 'var(--beige)', padding: '48px 0' }}>
        <div className="container">
          <div className="bundle-grid">
            <BundleBanner kind="designer" count={5} price={125} title="The Designer Five" tag="Save up to $375"
              subtitle="Any 5 from women's + men's designer." picks={['p16','p21','p28','p35','p36']}
              onClick={() => router.push('/bundles')} />
            <BundleBanner kind="niche" count={2} price={190} title="The Niche Pair" tag="Save up to $400"
              subtitle="Any 2 from the niche & luxury shelf." picks={['p01','p11']}
              onClick={() => router.push('/bundles')} dark />
          </div>
          <div style={{ marginTop: 16, textAlign: 'center', color: 'var(--char)' }}>
            <span className="eyebrow">Auto-applied in your bag · Mix tier · Mix gender</span>
          </div>
        </div>
      </section>

      {/* ── FOUNDER ── */}
      <section style={{ background: 'var(--cream-2)', padding: '56px 0' }}>
        <div className="container">
          <div className="founder-grid">
            {/* Images — hidden on mobile via CSS */}
            <div className="founder-image-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden' }}>
                <Image src={PRODUCTS[9].mainImage} alt={PRODUCTS[9].name} fill sizes="20vw" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ position: 'relative', aspectRatio: '1/1', overflow: 'hidden' }}>
                  <Image src={PRODUCTS[2].mainImage} alt={PRODUCTS[2].name} fill sizes="10vw" style={{ objectFit: 'cover' }} />
                </div>
                <div style={{ position: 'relative', aspectRatio: '1/1', overflow: 'hidden' }}>
                  <Image src={PRODUCTS[34].mainImage} alt={PRODUCTS[34].name} fill sizes="10vw" style={{ objectFit: 'cover' }} />
                </div>
              </div>
            </div>
            <div>
              <div className="kicker-mark">Meet Dajaa</div>
              <h2 style={{ marginTop: 12, fontSize: 'clamp(28px, 4vw, 52px)' }}><span className="italic">"I don't carry it </span>if I wouldn't wear it.<span className="italic">"</span></h2>
              <p style={{ marginTop: 16, fontSize: 15, lineHeight: 1.7, color: 'var(--char)', maxWidth: 520 }}>
                Scents by DajaaB started with a bedroom shelf friends kept asking to borrow. Three years later it's forty-six fragrances, hand-sourced from authorized distributors, kept in a climate-controlled Memphis studio.
              </p>
              <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
                <button className="btn btn--ghost btn--sm" onClick={() => router.push('/about')}>Read the story</button>
                <a href="tel:9019212322" className="btn btn--primary btn--sm"><Icon.Phone /> 901·921·2322</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--serif)', fontSize: 28, fontWeight: 500 }}>{n}</div>
      <div className="eyebrow" style={{ marginTop: 4, fontSize: 10 }}>{label}</div>
    </div>
  );
}

function BundleBanner({ kind, count, price, title, tag, subtitle, picks, onClick, dark }: {
  kind: string; count: number; price: number; title: string; tag: string; subtitle: string;
  picks: string[]; onClick: () => void; dark?: boolean;
}) {
  const items = picks.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean) as typeof PRODUCTS;
  return (
    <div style={{
      background: dark ? 'var(--ink)' : 'var(--cream)',
      color: dark ? 'var(--cream)' : 'var(--ink)',
      padding: 24, border: '1px solid var(--ink)',
      display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, alignItems: 'center',
    }} className="bundle-card-inner">
      <div>
        <div style={{ fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: dark ? 'var(--gold)' : 'var(--gold-deep)', fontWeight: 500 }}>
          {kind === 'niche' ? 'Niche Bundle' : 'Designer Bundle'} · {tag}
        </div>
        <h3 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(32px, 4vw, 44px)', lineHeight: 1, marginTop: 6, color: dark ? 'var(--cream)' : 'var(--ink)' }}>
          <span style={{ fontStyle: 'italic' }}>{count}</span> for ${price}
        </h3>
        <div style={{ marginTop: 6, fontSize: 13, color: dark ? 'rgba(250,246,236,0.7)' : 'var(--char)' }}>{subtitle}</div>
        <button onClick={onClick} className={`btn ${dark ? 'btn--gold' : 'btn--primary'} btn--sm`} style={{ marginTop: 16 }}>
          {title} <Icon.Arrow />
        </button>
      </div>
      <div className="bundle-images" style={{ display: 'flex', gap: 6, height: 110 }}>
        {items.map((p, i) => (
          <div key={p.id} style={{ position: 'relative', width: 60, overflow: 'hidden', transform: `rotate(${(i - items.length / 2) * 3}deg)`, border: `1px solid ${dark ? 'rgba(201,169,97,0.3)' : 'rgba(0,0,0,0.1)'}` }}>
            <Image src={p.mainImage} alt={p.name} fill sizes="70px" style={{ objectFit: 'cover', objectPosition: 'center' }} />
          </div>
        ))}
      </div>
    </div>
  );
}
