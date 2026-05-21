'use client';
import { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PRODUCTS, BRANDS } from '@/data/products';
import { Icon } from '@/components/Icons';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';
import { Suspense } from 'react';

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [filters, setFilters] = useState({
    tier: searchParams.get('tier') ? [searchParams.get('tier')!] : [],
    gender: [] as string[],
    brand: [] as string[],
    priceMax: 300,
  });
  const [sort, setSort] = useState('featured');

  const toggle = (key: string, val: string) => setFilters(f => ({
    ...f,
    [key]: (f as any)[key].includes(val) ? (f as any)[key].filter((x: string) => x !== val) : [...(f as any)[key], val],
  }));
  const clearAll = () => setFilters({ tier: [], gender: [], brand: [], priceMax: 300 });

  const filtered = useMemo(() => {
    let res = PRODUCTS.filter(p => {
      if (filters.tier.length && !filters.tier.includes(p.tier)) return false;
      if (filters.gender.length && !filters.gender.includes(p.gender)) return false;
      if (filters.brand.length && !filters.brand.includes(p.brand)) return false;
      if (p.price > filters.priceMax) return false;
      return true;
    });
    if (sort === 'price-asc') res = [...res].sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') res = [...res].sort((a, b) => b.price - a.price);
    else if (sort === 'name') res = [...res].sort((a, b) => a.name.localeCompare(b.name));
    else res = [...res].sort((a, b) => Number(b.featured) - Number(a.featured));
    return res;
  }, [filters, sort]);

  const activeCount = filters.tier.length + filters.gender.length + filters.brand.length + (filters.priceMax < 300 ? 1 : 0);

  const FilterContent = (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16, borderBottom: '1px solid var(--ink)' }}>
        <div className="eyebrow eyebrow--ink" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <Icon.Filter /> Filters {activeCount > 0 && `(${activeCount})`}
        </div>
        {activeCount > 0 && (
          <button onClick={clearAll} style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', textDecoration: 'underline', color: 'var(--mute)' }}>Clear all</button>
        )}
      </div>
      <FilterGroup title="Tier" items={[['niche','Niche / Luxury','$145+'],['womens',"Women's Designer",'$60–$100'],['mens',"Men's Designer",'$60–$100']]}
        active={filters.tier} onToggle={v => toggle('tier', v)} />
      <FilterGroup title="For" items={[['women','Women'],['men','Men'],['unisex','Unisex']]}
        active={filters.gender} onToggle={v => toggle('gender', v)} />
      <FilterGroup title="House" items={BRANDS.map(b => [b, b])}
        active={filters.brand} onToggle={v => toggle('brand', v)} collapsed />
      <div style={{ marginTop: 28, paddingTop: 24, borderTop: '1px solid var(--line)' }}>
        <div className="eyebrow eyebrow--ink">Price Ceiling</div>
        <input type="range" min="60" max="300" step="5" value={filters.priceMax}
               onChange={e => setFilters(f => ({ ...f, priceMax: +e.target.value }))}
               style={{ width: '100%', marginTop: 14, accentColor: 'var(--ink)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginTop: 6 }}>
          <span>$60</span><span style={{ fontWeight: 500 }}>up to ${filters.priceMax}</span>
        </div>
      </div>
    </>
  );

  return (
    <div className="fade-in">
      {/* ── Shop header ── */}
      <section style={{ background: 'var(--cream-2)', padding: '48px 0 32px' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div className="eyebrow eyebrow--gold">The Shelf</div>
              <h1 style={{ marginTop: 10, fontSize: 'clamp(32px, 5vw, 80px)' }}>Shop <span className="italic">all</span> premium scents.</h1>
              <div style={{ color: 'var(--char)', marginTop: 10, fontSize: 14 }}>
                {filtered.length} of {PRODUCTS.length} fragrances shown
                {filters.tier.includes('niche') && ' · Niche & Luxury shelf'}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Mobile: filter toggle button */}
              <button
                className="mobile-only btn btn--ghost btn--sm"
                onClick={() => setFiltersOpen(true)}
                style={{ alignItems: 'center', gap: 8 }}>
                <Icon.Filter /> Filters {activeCount > 0 && `(${activeCount})`}
              </button>
              <label className="eyebrow" htmlFor="sort" style={{ whiteSpace: 'nowrap' }}>Sort</label>
              <select id="sort" value={sort} onChange={e => setSort(e.target.value)}
                      className="field field--boxed"
                      style={{ padding: '10px 14px', fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', minWidth: 160 }}>
                <option value="featured">Featured</option>
                <option value="price-asc">Price · Low to High</option>
                <option value="price-desc">Price · High to Low</option>
                <option value="name">Name A–Z</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bundle bar ── */}
      <section style={{ background: 'var(--ink)', color: 'var(--cream)', padding: '14px 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'center', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ color: 'var(--gold)', fontSize: 11, letterSpacing: '0.24em', textTransform: 'uppercase' }}>✦ Bundle on</span>
          <span style={{ fontSize: 13 }}><strong>5 designer for $125</strong></span>
          <span style={{ color: 'var(--gold)' }}>·</span>
          <span style={{ fontSize: 13 }}><strong>2 niche for $190</strong></span>
          <a onClick={() => router.push('/bundles')} style={{ color: 'var(--gold)', borderBottom: '1px solid var(--gold)', paddingBottom: 2, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer' }}>Rules</a>
        </div>
      </section>

      {/* ── Products + sidebar ── */}
      <section style={{ padding: '40px 0 80px' }}>
        <div className="container">
          <div className="shop-layout">
            {/* Desktop sidebar */}
            <aside className="shop-sidebar">
              {FilterContent}
            </aside>

            {/* Product grid */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--mute)' }}>
                  <h3>No bottles match those filters.</h3>
                  <button onClick={clearAll} className="btn btn--ghost" style={{ marginTop: 20 }}>Clear filters</button>
                </div>
              ) : (
                <div className="grid-4">
                  {filtered.map(p => <ProductCard key={p.id} p={p} addToCart={addToCart} />)}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Mobile filter panel ── */}
      <>
        {/* Backdrop */}
        {filtersOpen && (
          <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(20,18,12,0.4)', zIndex: 149 }}
            onClick={() => setFiltersOpen(false)}
          />
        )}
        <div className={`mobile-filter-panel ${filtersOpen ? 'open' : ''}`} aria-hidden={!filtersOpen}>
          {/* Panel header */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '16px 20px', borderBottom: '1px solid var(--line)', flexShrink: 0,
          }}>
            <span className="eyebrow eyebrow--ink" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon.Filter /> Filters {activeCount > 0 && `(${activeCount})`}
            </span>
            <button onClick={() => setFiltersOpen(false)} aria-label="Close filters"
                    style={{ minHeight: 44, minWidth: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon.Close />
            </button>
          </div>
          {/* Filter content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px 20px 24px' }}>
            {FilterContent}
          </div>
          {/* Apply button */}
          <div style={{ padding: '16px 20px', borderTop: '1px solid var(--line)', flexShrink: 0 }}>
            <button
              className="btn btn--primary btn--block"
              onClick={() => setFiltersOpen(false)}>
              Show {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            </button>
          </div>
        </div>
      </>
    </div>
  );
}

function FilterGroup({ title, items, active, onToggle, collapsed = false }: {
  title: string; items: string[][]; active: string[]; onToggle: (v: string) => void; collapsed?: boolean;
}) {
  const [open, setOpen] = useState(!collapsed);
  return (
    <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--line-soft)' }}>
      <button onClick={() => setOpen(o => !o)}
              style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', minHeight: 40 }}>
        <span className="eyebrow eyebrow--ink">{title}</span>
        <span style={{ fontSize: 18 }}>{open ? '−' : '+'}</span>
      </button>
      {open && (
        <ul style={{ listStyle: 'none', padding: 0, margin: '12px 0 0', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {items.map(([val, label, hint]) => {
            const checked = active.includes(val);
            return (
              <li key={val}>
                <label style={{ display: 'flex', gap: 10, cursor: 'pointer', alignItems: 'center', fontSize: 14, padding: '8px 0', minHeight: 44 }}>
                  <span style={{ width: 18, height: 18, border: '1px solid var(--ink)', flexShrink: 0, background: checked ? 'var(--ink)' : 'transparent', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cream)' }}>
                    {checked && <Icon.Check width="12" height="12" />}
                  </span>
                  <input type="checkbox" checked={checked} onChange={() => onToggle(val)} style={{ position: 'absolute', opacity: 0, width: 0 }} />
                  <span style={{ flex: 1 }}>{label}</span>
                  {hint && <span style={{ color: 'var(--mute)', fontSize: 11 }}>{hint}</span>}
                </label>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div style={{ padding: 80, textAlign: 'center' }}>Loading...</div>}>
      <ShopContent />
    </Suspense>
  );
}
