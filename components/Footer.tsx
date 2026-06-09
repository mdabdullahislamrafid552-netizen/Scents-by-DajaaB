'use client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Icon } from './Icons';

export default function Footer() {
  const router = useRouter();
  const cols = [
    { title: "Shop", items: [["/shop","All Fragrances"],["/shop?tier=niche","Niche & Luxury"],["/shop?tier=womens","Women's"],["/shop?tier=mens","Men's"],["/bundles","Bundle Deals"]] },
    { title: "House", items: [["/about","Our Story"],["/about","Memphis Studio"],["/faq","Pickup & FAQ"],["/faq","Returns"]] },
    { title: "Reach Dajaa", items: [["/about","Text 901·921·2322"],["/about","Instagram @scentsbydajaab"],["/about","DM for private appointments"]] },
  ];

  return (
    <footer style={{ background: 'var(--ink)', color: 'var(--cream)', paddingTop: 64 }}>
      <div className="container">
        {/* Logo + tagline */}
        <div style={{ textAlign: 'center', paddingBottom: 48 }}>
          <div className="eyebrow" style={{ color: 'var(--gold)', marginBottom: 24 }}>✦ All Premium Scents ✦</div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--serif)', fontSize: 28, letterSpacing: '0.05em', lineHeight: 1 }}>Scents by</span>
            <span style={{ fontFamily: 'var(--script)', color: 'var(--gold-deep)', fontSize: 48, lineHeight: 0.8, marginLeft: 24 }}>DajaaB.</span>
          </div>
        </div>

        <div style={{ height: 1, background: 'rgba(201,169,97,0.25)' }} />

        {/* Footer grid: newsletter + 3 link columns */}
        <div className="footer-grid">
          {/* Newsletter column */}
          <div>
            <div className="eyebrow" style={{ color: 'var(--gold)', marginBottom: 14 }}>Newsletter</div>
            <h4 style={{ color: 'var(--cream)', fontSize: 22, marginBottom: 14, lineHeight: 1.2 }}>
              First access. New arrivals. Bundle drops.
            </h4>
            <form onSubmit={e => e.preventDefault()}
                  style={{ display: 'flex', borderBottom: '1px solid var(--gold)', paddingBottom: 8, gap: 10 }}>
              <input type="email" placeholder="your@email"
                     style={{ flex: 1, background: 'transparent', border: 0, color: 'var(--cream)', outline: 'none', fontSize: 16, padding: '8px 0' }} />
              <button type="submit" style={{ color: 'var(--gold)', minHeight: 44, minWidth: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon.Arrow />
              </button>
            </form>
            <div style={{ marginTop: 20, color: 'rgba(250,246,236,0.6)', fontSize: 13, lineHeight: 1.7 }}>
              Memphis, Tennessee · Pickup only<br />Open by appointment · 901·921·2322
            </div>
          </div>

          {/* Link columns */}
          {cols.map(col => (
            <div key={col.title}>
              <div className="eyebrow" style={{ color: 'var(--gold)', marginBottom: 14 }}>{col.title}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {col.items.map(([href, label]) => (
                  <li key={label}>
                    <a onClick={() => router.push(href)}
                       style={{ cursor: 'pointer', color: 'rgba(250,246,236,0.85)', fontSize: 14, display: 'block', padding: '2px 0' }}>
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ height: 1, background: 'rgba(201,169,97,0.25)' }} />

        {/* Bottom bar */}
        <div className="footer-bottom"
             style={{ color: 'rgba(250,246,236,0.6)', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
          <div>© 2026 Scents by DajaaB · All rights reserved</div>
          <div className="footer-bottom-links" style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
            <a onClick={() => router.push('/privacy')} style={{ cursor: 'pointer' }}>Privacy</a>
            <a onClick={() => router.push('/privacy')} style={{ cursor: 'pointer' }}>Terms</a>
            <a style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Icon.IG /> @scentsbydajaab
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
