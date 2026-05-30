'use client';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import AnnouncementBar from './AnnouncementBar';
import { Icon } from './Icons';

interface Props {
  cartCount: number;
  openCart: () => void;
  openSearch: () => void;
}

export default function Header({ cartCount, openCart, openSearch }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const links: [string, string][] = [
    ["/", "Home"], ["/shop", "Shop"], ["/bundles", "Bundles"], ["/about", "About"], ["/faq", "FAQ"],
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const go = (href: string) => {
    router.push(href);
    setMenuOpen(false);
  };

  return (
    <>
      <header className="header">
        <AnnouncementBar />
        <div className="container header-inner">
          {/* Left: desktop nav OR hamburger on mobile */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* Desktop nav */}
            <nav className="desktop-only" style={{ gap: 26 }}>
              {links.map(([href, label]) => (
                <a key={label} onClick={() => router.push(href)}
                   style={{
                     fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 500,
                     cursor: 'pointer', borderBottom: isActive(href) ? '1px solid var(--ink)' : '1px solid transparent',
                     paddingBottom: 4, transition: 'border-color 200ms',
                   }}
                   onMouseEnter={e => (e.currentTarget.style.borderBottomColor = 'var(--gold-deep)')}
                   onMouseLeave={e => (e.currentTarget.style.borderBottomColor = isActive(href) ? 'var(--ink)' : 'transparent')}>
                  {label}
                </a>
              ))}
            </nav>
            {/* Hamburger button (mobile only) */}
            <button
              className="mobile-only"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              style={{ alignItems: 'center', padding: '4px', minHeight: 44, minWidth: 44, justifyContent: 'center' }}>
              <Icon.Menu />
            </button>
          </div>

          {/* Center: logo */}
          <a onClick={() => router.push('/')} style={{ cursor: 'pointer', justifySelf: 'center', display: 'flex', alignItems: 'center' }}>
            <Image src="/logo.png" alt="Scents by DajaaB" width={560} height={180}
              className="site-logo"
              style={{ height: 80, width: 'auto', objectFit: 'contain', display: 'block' }}
              priority />
          </a>

          {/* Right: search, account, cart */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', justifyContent: 'flex-end' }}>
            <button
              onClick={openSearch}
              aria-label="Search"
              className="desktop-only"
              style={{ alignItems: 'center', minHeight: 44, minWidth: 44, justifyContent: 'center' }}>
              <Icon.Search />
            </button>
            <button
              onClick={() => router.push('/admin')}
              aria-label="Account"
              className="desktop-only"
              style={{ alignItems: 'center', minHeight: 44, minWidth: 44, justifyContent: 'center' }}>
              <Icon.User />
            </button>
            <button
              onClick={openCart}
              aria-label={`Cart${cartCount > 0 ? `, ${cartCount} items` : ''}`}
              style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', minHeight: 44, minWidth: 44, justifyContent: 'center' }}>
              <Icon.Bag />
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute', top: 2, right: 2,
                  background: 'var(--gold)', color: 'var(--ink)',
                  fontSize: 10, fontWeight: 600, minWidth: 18, height: 18, borderRadius: 18,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 5px',
                }}>{cartCount}</span>
              )}
            </button>
            {/* Mobile search icon */}
            <button
              onClick={openSearch}
              aria-label="Search"
              className="mobile-only"
              style={{ alignItems: 'center', minHeight: 44, minWidth: 44, justifyContent: 'center' }}>
              <Icon.Search />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile nav backdrop ── */}
      <div
        className={`mobile-nav__backdrop ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* ── Mobile nav drawer ── */}
      <nav className={`mobile-nav ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen}>
        {/* Drawer header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '16px 24px', borderBottom: '1px solid var(--line)',
        }}>
          <Image src="/logo.png" alt="Scents by DajaaB" width={560} height={180}
            style={{ height: 68, width: 'auto', objectFit: 'contain', display: 'block' }} />
          <button onClick={() => setMenuOpen(false)} aria-label="Close menu"
                  style={{ padding: 8, minHeight: 44, minWidth: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon.Close />
          </button>
        </div>

        {/* Nav links */}
        <div style={{ flex: 1, padding: '8px 0' }}>
          {links.map(([href, label]) => (
            <button
              key={label}
              onClick={() => go(href)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                width: '100%', padding: '18px 24px',
                fontFamily: 'var(--serif)', fontSize: 28, fontWeight: 400,
                borderBottom: '1px solid var(--line-soft)',
                color: isActive(href) ? 'var(--gold-deep)' : 'var(--ink)',
                textAlign: 'left',
              }}>
              {label}
              <Icon.Arrow style={{ color: 'var(--gold-deep)', opacity: 0.6 }} />
            </button>
          ))}
        </div>

        {/* Bottom actions */}
        <div style={{ padding: '24px', borderTop: '1px solid var(--line)', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button
            onClick={() => go('/admin')}
            className="btn btn--ghost"
            style={{ width: '100%', justifyContent: 'center' }}>
            <Icon.User /> My Account
          </button>
          <button
            onClick={() => { setMenuOpen(false); openCart(); }}
            className="btn btn--primary"
            style={{ width: '100%', justifyContent: 'center' }}>
            <Icon.Bag /> Bag {cartCount > 0 && `(${cartCount})`}
          </button>
          <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--mute)', marginTop: 8 }}>
            Memphis, TN · Pickup only · 901·921·2322
          </div>
        </div>
      </nav>
    </>
  );
}
