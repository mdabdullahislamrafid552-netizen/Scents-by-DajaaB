'use client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { PRODUCTS } from '@/data/products';
import { Icon } from '@/components/Icons';

export default function AboutPage() {
  const router = useRouter();
  const ed = PRODUCTS.find(p => p.slug === 'creed-aventus')!;
  return (
    <div className="fade-in">
      <section style={{ padding: 'clamp(48px, 8vw, 80px) 0 clamp(40px, 6vw, 60px)' }}>
        <div className="container">
          <div className="about-hero-grid">
            <div>
              <div className="kicker-mark">About the House</div>
              <h1 style={{ marginTop: 28 }}>
                A <span className="italic">Memphis</span> shelf, curated by{' '}
                <span style={{ fontFamily: 'var(--script)', color: 'var(--gold-deep)', fontSize: '1.05em' }}>Dajaa.</span>
              </h1>
              <p style={{ marginTop: 28, fontSize: 17, lineHeight: 1.7, color: 'var(--char)', maxWidth: 540 }}>
                Forty-six fragrances. Every one personally vetted, sourced through authorized channels, and kept in a climate-controlled studio off Poplar. No website algorithm picked these bottles. Dajaa did.
              </p>
              <div style={{ display: 'flex', gap: 14, marginTop: 36, flexWrap: 'wrap' }}>
                <a href="tel:9019212322" className="btn btn--primary"><Icon.Phone /> Book a private fitting</a>
                <a href="https://instagram.com" className="btn btn--ghost"><Icon.IG /> @scentsbydajaab</a>
              </div>
            </div>
            <div style={{ position: 'relative', aspectRatio: '4/5', overflow: 'hidden', background: '#0e0e0e' }}>
              <Image
                src={ed.mainImage}
                alt={ed.name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 45vw"
                style={{ objectFit: 'cover', objectPosition: 'center' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.5) 100%)', zIndex: 1 }} />
              <div style={{ position: 'absolute', left: 24, bottom: 24, zIndex: 2, color: 'var(--gold)', fontFamily: 'var(--script)', fontSize: 48, lineHeight: 1 }}>Sd.</div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--ink)', color: 'var(--cream)', padding: '100px 0' }}>
        <div className="container--narrow" style={{ textAlign: 'center' }}>
          <div className="eyebrow" style={{ color: 'var(--gold)' }}>The House Manifesto</div>
          <p style={{ marginTop: 32, fontFamily: 'var(--serif)', fontSize: 'clamp(28px, 3vw, 44px)', lineHeight: 1.25, color: 'var(--cream)' }}>
            <span className="italic" style={{ color: 'var(--gold)' }}>"I started Scents by DajaaB</span> because Memphis deserves a fragrance shelf without the markup, the gatekeeping, or the boring advice.{' '}
            <span className="italic">If you wear my recommendation</span> and three strangers ask what you have on — I did my job."
          </p>
          <div style={{ marginTop: 32, fontFamily: 'var(--script)', fontSize: 56, color: 'var(--gold)' }}>Dajaa</div>
          <div className="eyebrow" style={{ color: 'rgba(250,246,236,0.7)', marginTop: 4 }}>Founder · Curator</div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="kicker-mark">What we stand on</div>
          <h2 style={{ marginTop: 18, maxWidth: 720 }}>Four <span className="italic">non-negotiables.</span></h2>
          <div className="about-pillars-grid" style={{ marginTop: 56 }}>
            {[
              { n: '01', t: 'Authentic only', d: "Every bottle sourced through authorized distributors. Batch codes verified. We don't carry decants, dupes, or grey market." },
              { n: '02', t: 'Hand-curated', d: 'Forty-six bottles, on purpose. Dajaa tests, lives in, and signs off on every fragrance before it joins the shelf.' },
              { n: '03', t: 'Climate-kept', d: 'Bottles stored in a 65°F studio away from light. Fragrance is volatile — we treat it that way.' },
              { n: '04', t: 'Pickup, by design', d: 'No shipping. Pickup means we meet, we fit you, and your bottle leaves with a person — not a courier.' },
            ].map(p => (
              <div key={p.n} style={{ borderTop: '1px solid var(--ink)', paddingTop: 24 }}>
                <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 36, color: 'var(--gold-deep)' }}>{p.n}</div>
                <h4 style={{ fontFamily: 'var(--serif)', fontSize: 28, marginTop: 12 }}>{p.t}</h4>
                <p style={{ marginTop: 12, color: 'var(--char)', fontSize: 14, lineHeight: 1.7 }}>{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--beige)', padding: 'clamp(56px, 8vw, 100px) 0' }}>
        <div className="container">
          <div className="about-studio-grid">
            <div>
              <div className="eyebrow eyebrow--gold">The Studio</div>
              <h2 style={{ marginTop: 16 }}>A back-room boutique, by <span className="italic">appointment.</span></h2>
              <p style={{ marginTop: 24, fontSize: 16, lineHeight: 1.7, color: 'var(--char)', maxWidth: 480 }}>
                Located in Midtown Memphis. Open by appointment only — text 901·921·2322 to book. Walk-ins on Saturday afternoons by chance.
              </p>
              <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <Detail label="Hours" lines={['Sat · 10 AM – 7 PM', 'Sun · 1 PM – 5 PM', 'Weekdays · by appt.']} />
                <Detail label="Reach Out" lines={['901·921·2322 (text first)', 'hello@scentsbydajaab.com', '@scentsbydajaab']} />
              </div>
            </div>
            <div style={{ position: 'relative' }}>
              <div className="bottle-frame" style={{ aspectRatio: '5/4' }}>
                <svg viewBox="0 0 500 400" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                  <defs>
                    <linearGradient id="floor" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#E8DDC2"/><stop offset="100%" stopColor="#C8B484"/>
                    </linearGradient>
                  </defs>
                  <rect width="500" height="400" fill="#F4ECD8"/>
                  <rect y="280" width="500" height="120" fill="url(#floor)"/>
                  {[0,1,2].map(row => (
                    <g key={row}>
                      <rect x="80" y={80 + row*55} width="340" height="2" fill="#8a7244"/>
                      {[0,1,2,3,4,5,6].map(i => (
                        <g key={i} transform={`translate(${100 + i*45}, ${48 + row*55})`}>
                          <rect width="20" height="32" fill={['#3a2418','#7a5530','#c98a3a','#1a1814'][i%4]}/>
                          <rect y="-6" width="20" height="6" fill="#C9A961"/>
                        </g>
                      ))}
                    </g>
                  ))}
                  <g opacity="0.7">
                    <circle cx="150" cy="40" r="8" fill="#C9A961"/><line x1="150" y1="0" x2="150" y2="32" stroke="#8a7244"/>
                    <circle cx="350" cy="50" r="8" fill="#C9A961"/><line x1="350" y1="0" x2="350" y2="42" stroke="#8a7244"/>
                  </g>
                  <rect x="160" y="260" width="180" height="40" fill="#1a1814"/>
                  <text x="250" y="288" textAnchor="middle" fontFamily="'Pinyon Script', cursive" fontSize="36" fill="#C9A961">Sd</text>
                </svg>
              </div>
              <div style={{ position: 'absolute', left: -20, top: -20, background: 'var(--cream)', padding: '16px 20px', border: '1px solid var(--ink)' }}>
                <div className="eyebrow eyebrow--gold">Studio · MEM</div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 22, fontStyle: 'italic' }}>By appointment</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="about-stats-grid">
            {[['46','Premium scents'],['13','Niche & luxury'],['3yr','Curated since'],['1','Owner. That\'s it.']].map(([n,l]) => (
              <div key={l} style={{ borderTop: '1px solid var(--ink)', paddingTop: 24 }}>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 88, lineHeight: 0.9, fontWeight: 500 }}>{n}</div>
                <div className="eyebrow" style={{ marginTop: 12 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--ink)', color: 'var(--cream)', padding: '100px 0', textAlign: 'center' }}>
        <div className="container--narrow">
          <h2 style={{ color: 'var(--cream)' }}>Ready to find <span className="italic" style={{ color: 'var(--gold)' }}>your scent</span>?</h2>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 32 }}>
            <button onClick={() => router.push('/shop')} className="btn btn--gold">Browse all 46 bottles</button>
            <a href="tel:9019212322" className="btn" style={{ border: '1px solid var(--cream)', color: 'var(--cream)' }}><Icon.Phone /> Book a fitting</a>
          </div>
        </div>
      </section>
    </div>
  );
}

function Detail({ label, lines }: { label: string; lines: string[] }) {
  return (
    <div>
      <div className="eyebrow eyebrow--ink">{label}</div>
      <ul style={{ listStyle: 'none', padding: 0, margin: '10px 0 0', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {lines.map(l => <li key={l} style={{ fontSize: 14 }}>{l}</li>)}
      </ul>
    </div>
  );
}
