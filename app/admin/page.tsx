'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { PRODUCTS } from '@/data/products';
import { Icon, Monogram } from '@/components/Icons';

const RECENT_ORDERS = [
  { id: 'SBD-4291', customer: 'Imani Lawson',   phone: '901·555·0107', items: 5, total: 125, status: 'ready',     when: '2 hrs ago',  bundle: 'Designer 5' },
  { id: 'SBD-4290', customer: 'Marcus Henley',  phone: '901·555·0143', items: 2, total: 190, status: 'pending',   when: '3 hrs ago',  bundle: 'Niche 2'    },
  { id: 'SBD-4289', customer: 'Jada Carter',    phone: '901·555·0125', items: 1, total: 245, status: 'completed', when: 'Yesterday',  bundle: null         },
  { id: 'SBD-4288', customer: 'Devon Park',     phone: '901·555·0181', items: 3, total: 250, status: 'completed', when: 'Yesterday',  bundle: null         },
  { id: 'SBD-4287', customer: 'Aaliyah Singh',  phone: '901·555·0166', items: 5, total: 125, status: 'completed', when: '2 days ago', bundle: 'Designer 5' },
  { id: 'SBD-4286', customer: 'Camille Brooks', phone: '901·555·0192', items: 1, total: 100, status: 'completed', when: '2 days ago', bundle: null         },
];
const KPIS = [
  { label: 'Revenue · 30d', value: '$8,420', delta: '+24.6%', up: true, sub: 'vs. previous 30d' },
  { label: 'Orders · 30d',  value: '76',     delta: '+18.2%', up: true, sub: '12 pending pickup' },
  { label: 'Avg order',     value: '$110.79', delta: '+5.4%', up: true, sub: 'Bundle attach: 41%' },
  { label: 'Customers',     value: '342',    delta: '+12',    up: true, sub: '9 new this week' },
];
const TOP_PRODUCTS = [
  { id: 'p01', units: 18, revenue: 4410 },
  { id: 'p02', units: 14, revenue: 2590 },
  { id: 'p04', units: 11, revenue: 2475 },
  { id: 'p17', units: 22, revenue: 2200 },
  { id: 'p08', units: 19, revenue: 1615 },
];
const REV_SERIES = [180,220,305,270,340,290,410,350,425,580,510,460,540,620];

export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const tabs: [string, string, React.ReactNode][] = [
    ['dashboard', 'Dashboard', <Icon.Dashboard key="d" />],
    ['orders',    'Orders',    <Icon.Box key="o" />],
    ['products',  'Products',  <Icon.Tag key="p" />],
    ['bundles',   'Marketing', <Icon.Sparkle key="b" />],
    ['customers', 'Customers', <Icon.User key="c" />],
    ['settings',  'Settings',  <Icon.Filter key="s" />],
  ];

  const SidebarContent = (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 24, borderBottom: '1px solid rgba(201,169,97,0.2)' }}>
        <Monogram size={36} />
        <div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 18, color: 'var(--cream)' }}>Scents by DajaaB</div>
          <div className="eyebrow" style={{ color: 'var(--gold)', fontSize: 9 }}>Studio Admin</div>
        </div>
        {/* Close button on mobile */}
        <button onClick={() => setSidebarOpen(false)} className="mobile-only"
                style={{ marginLeft: 'auto', color: 'var(--cream)', minHeight: 44, minWidth: 44, alignItems: 'center', justifyContent: 'center' }}>
          <Icon.Close />
        </button>
      </div>
      <nav style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
        {tabs.map(([k, label, icon]) => (
          <button key={k} onClick={() => { setTab(k); setSidebarOpen(false); }}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 14px', textAlign: 'left', background: tab === k ? 'rgba(201,169,97,0.15)' : 'transparent', color: tab === k ? 'var(--gold)' : 'var(--cream)', borderLeft: tab === k ? '2px solid var(--gold)' : '2px solid transparent', fontSize: 13, letterSpacing: '0.06em', minHeight: 48 }}>
            {icon} {label}
          </button>
        ))}
      </nav>
      <div style={{ marginTop: 'auto', paddingTop: 20, borderTop: '1px solid rgba(201,169,97,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--gold)', color: 'var(--ink)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--script)', fontSize: 22 }}>D</div>
          <div style={{ fontSize: 13 }}>
            <div style={{ color: 'var(--cream)' }}>Dajaa</div>
            <div style={{ color: 'rgba(250,246,236,0.55)', fontSize: 11 }}>Owner</div>
          </div>
        </div>
        <button onClick={() => router.push('/')}
          style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(250,246,236,0.7)', minHeight: 44 }}>
          <Icon.ArrowL /> Back to storefront
        </button>
      </div>
    </>
  );

  return (
    <div className="admin-layout">
      {/* ── Sidebar backdrop (mobile) ── */}
      <div className={`admin-sidebar-backdrop ${sidebarOpen ? 'open' : ''}`}
           onClick={() => setSidebarOpen(false)} />

      {/* ── Sidebar ── */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        {SidebarContent}
      </aside>

      {/* ── Main content ── */}
      <main className="admin-main" style={{ padding: 40, overflow: 'hidden', minWidth: 0 }}>
        {/* Hamburger top bar — only visible below 1024px via .admin-topbar class */}
        <div className="admin-topbar">
          <button onClick={() => setSidebarOpen(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, minHeight: 44 }}>
            <Icon.Menu />
            <span style={{ fontFamily: 'var(--serif)', fontSize: 18 }}>
              {tabs.find(([k]) => k === tab)?.[1] ?? 'Admin'}
            </span>
          </button>
          <Monogram size={28} />
        </div>

        {tab === 'dashboard' && <Dashboard />}
        {tab === 'orders'    && <OrdersPanel />}
        {tab === 'products'  && <ProductsPanel />}
        {tab === 'bundles'   && <MarketingPanel />}
        {tab === 'customers' && <CustomersPanel />}
        {tab === 'settings'  && <SettingsPanel />}
      </main>
    </div>
  );
}

function Dashboard() {
  return (
    <>
      <AdminHeader title="Good morning, Dajaa." subtitle="Here's what's happening at the studio today." />
      <div className="admin-kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 28 }}>
        {KPIS.map(k => <KpiCard key={k.label} {...k} />)}
      </div>
      <div className="admin-chart-grid" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16, marginTop: 16 }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div className="eyebrow eyebrow--gold">Revenue · last 14 days</div>
              <h3 style={{ marginTop: 8, fontSize: 28 }}>$5,720</h3>
              <div style={{ color: 'var(--gold-deep)', fontSize: 13, marginTop: 4 }}>↑ 24.6% vs prior 14d</div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {['7d','14d','30d','90d'].map((r, i) => (
                <button key={r} style={{ fontSize: 11, padding: '6px 10px', letterSpacing: '0.14em', textTransform: 'uppercase', border: i === 1 ? '1px solid var(--ink)' : '1px solid var(--line)', background: i === 1 ? 'var(--ink)' : 'var(--cream)', color: i === 1 ? 'var(--cream)' : 'var(--ink)' }}>{r}</button>
              ))}
            </div>
          </div>
          <Sparkline />
        </Card>
        <Card>
          <div className="eyebrow eyebrow--gold">Bundle attach · 30d</div>
          <h3 style={{ marginTop: 8, fontSize: 28 }}>41%</h3>
          <div style={{ marginTop: 14 }}>
            <BundleBar label="Designer 5 · $125" pct={31} count={24} />
            <BundleBar label="Niche 2 · $190" pct={10} count={8} gold />
            <BundleBar label="Single bottles" pct={59} count={44} muted />
          </div>
        </Card>
      </div>
      <div className="admin-chart-grid" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16, marginTop: 16 }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div className="eyebrow eyebrow--gold">Recent Orders</div>
              <h3 style={{ marginTop: 6, fontSize: 22 }}>6 most recent</h3>
            </div>
          </div>
          <div className="admin-table-wrap">
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20, fontSize: 13, minWidth: 480 }}>
              <thead>
                <tr style={{ textAlign: 'left', color: 'var(--mute)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                  <th style={{ padding: '10px 0' }}>Order</th><th>Customer</th><th>Total</th><th>Status</th><th>When</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_ORDERS.map(o => (
                  <tr key={o.id} style={{ borderTop: '1px solid var(--line-soft)' }}>
                    <td style={{ padding: '12px 0' }}>
                      <div style={{ fontFamily: 'var(--serif)', fontSize: 15 }}>{o.id}</div>
                      {o.bundle && <div style={{ fontSize: 10, color: 'var(--gold-deep)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>✦ {o.bundle}</div>}
                    </td>
                    <td><div style={{ whiteSpace: 'nowrap' }}>{o.customer}</div></td>
                    <td style={{ fontFamily: 'var(--serif)', fontSize: 15 }}>${o.total}</td>
                    <td><StatusPill status={o.status} /></td>
                    <td style={{ color: 'var(--mute)', whiteSpace: 'nowrap' }}>{o.when}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <Card>
          <div className="eyebrow eyebrow--gold">Top Sellers · 30d</div>
          <h3 style={{ marginTop: 6, fontSize: 22 }}>Move the shelf</h3>
          <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {TOP_PRODUCTS.map((t, i) => {
              const p = PRODUCTS.find(x => x.id === t.id);
              if (!p) return null;
              return (
                <div key={t.id} style={{ display: 'grid', gridTemplateColumns: '22px 44px 1fr auto', gap: 10, alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--gold-deep)', fontSize: 16 }}>0{i+1}</span>
                  <div style={{ position: 'relative', width: 44, height: 54, overflow: 'hidden', flexShrink: 0, background: p.tier === 'niche' ? '#0e0e0e' : 'var(--cream-2)' }}>
                    <Image src={p.mainImage} alt={p.name} fill sizes="44px" style={{ objectFit: 'cover', objectPosition: 'center' }} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--serif)', fontSize: 15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--mute)' }}>{t.units} units</div>
                  </div>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: 16 }}>${t.revenue.toLocaleString()}</div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </>
  );
}

function OrdersPanel() {
  const [filter, setFilter] = useState('all');
  const all = [...RECENT_ORDERS,
    { id: 'SBD-4285', customer: 'Tasha Williams', phone: '901·555·0148', items: 2, total: 190, status: 'ready', when: '3 days ago', bundle: 'Niche 2' },
    { id: 'SBD-4284', customer: 'Eric Adams', phone: '901·555·0177', items: 1, total: 75, status: 'completed', when: '4 days ago', bundle: null },
  ];
  const filtered = all.filter(o => filter === 'all' || o.status === filter);
  return (
    <>
      <AdminHeader title="Orders" subtitle="Manage pending, ready, and completed pickups." right={<button className="btn btn--primary btn--sm">Export CSV</button>} />
      <div className="admin-filter-row" style={{ display: 'flex', gap: 8, marginTop: 24, flexWrap: 'wrap' }}>
        {[['all',`All · ${all.length}`],['pending','Pending'],['ready','Ready'],['completed','Completed']].map(([k,l]) => (
          <button key={k} onClick={() => setFilter(k)} style={{ padding: '10px 16px', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', border: filter === k ? '1px solid var(--ink)' : '1px solid var(--line)', background: filter === k ? 'var(--ink)' : 'var(--cream)', color: filter === k ? 'var(--cream)' : 'var(--ink)', minHeight: 44 }}>{l}</button>
        ))}
      </div>
      <Card style={{ marginTop: 20, padding: 0 }}>
        <div className="admin-table-wrap">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 520 }}>
            <thead><tr style={{ textAlign: 'left', color: 'var(--mute)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', background: 'var(--cream-2)' }}>
              {['Order','Customer','Items','Total','Status','When',''].map((h, i) => <th key={i} style={{ padding: i === 0 ? '14px 20px' : '14px 12px', whiteSpace: 'nowrap' }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id} style={{ borderTop: '1px solid var(--line-soft)' }}>
                  <td style={{ padding: '16px 20px' }}><div style={{ fontFamily: 'var(--serif)', fontSize: 16 }}>{o.id}</div>{o.bundle && <div style={{ fontSize: 10, color: 'var(--gold-deep)' }}>✦ {o.bundle}</div>}</td>
                  <td style={{ padding: '16px 12px', whiteSpace: 'nowrap' }}>{o.customer}</td>
                  <td style={{ padding: '16px 12px' }}>{o.items}</td>
                  <td style={{ padding: '16px 12px', fontFamily: 'var(--serif)', fontSize: 16 }}>${o.total}</td>
                  <td style={{ padding: '16px 12px' }}><StatusPill status={o.status} /></td>
                  <td style={{ padding: '16px 12px', color: 'var(--mute)', whiteSpace: 'nowrap' }}>{o.when}</td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}><button style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', borderBottom: '1px solid var(--ink)', paddingBottom: 2, whiteSpace: 'nowrap' }}>Manage</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

function ProductsPanel() {
  return (
    <>
      <AdminHeader title="Products" subtitle={`${PRODUCTS.length} bottles on the shelf`}
        right={<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}><button className="btn btn--ghost btn--sm">Upload CSV</button><button className="btn btn--primary btn--sm"><Icon.Plus /> Add</button></div>} />
      <Card style={{ marginTop: 20, padding: 0 }}>
        <div className="admin-table-wrap">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 600 }}>
            <thead><tr style={{ textAlign: 'left', color: 'var(--mute)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', background: 'var(--cream-2)' }}>
              {['Bottle','Tier','Family','Price','Stock',''].map((h, i) => <th key={i} style={{ padding: i === 0 ? '14px 20px' : '14px 12px' }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {PRODUCTS.map(p => (
                <tr key={p.id} style={{ borderTop: '1px solid var(--line-soft)' }}>
                  <td style={{ padding: '12px 20px' }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <div style={{ position: 'relative', width: 36, height: 44, overflow: 'hidden', flexShrink: 0, background: p.tier === 'niche' ? '#0e0e0e' : 'var(--cream-2)' }}>
                        <Image src={p.mainImage} alt={p.name} fill sizes="36px" style={{ objectFit: 'cover', objectPosition: 'center' }} />
                      </div>
                      <div><div style={{ fontFamily: 'var(--serif)', fontSize: 15, whiteSpace: 'nowrap' }}>{p.name}</div><div style={{ fontSize: 11, color: 'var(--mute)' }}>{p.brand}</div></div>
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}><span className={`chip ${p.tier === 'niche' ? 'chip--solid-gold' : ''}`} style={{ borderColor: p.tier === 'niche' ? 'var(--gold)' : 'var(--line)', color: p.tier === 'niche' ? 'var(--ink)' : 'var(--char)', whiteSpace: 'nowrap' }}>{p.tier === 'niche' ? 'Niche' : p.tier === 'womens' ? "Women's" : "Men's"}</span></td>
                  <td style={{ padding: '12px' }}>{p.family}</td>
                  <td style={{ padding: '12px', fontFamily: 'var(--serif)', fontSize: 15 }}>${p.price}</td>
                  <td style={{ padding: '12px' }}><span style={{ color: p.stockCount < 5 ? 'var(--gold-deep)' : 'var(--char)', fontWeight: 500 }}>{p.stockCount}</span>{p.stockCount < 5 && <span style={{ fontSize: 10, color: 'var(--gold-deep)', marginLeft: 4 }}>· Low</span>}</td>
                  <td style={{ padding: '12px 20px', textAlign: 'right' }}><button style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', borderBottom: '1px solid var(--ink)', paddingBottom: 2 }}>Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

function MarketingPanel() {
  return (
    <>
      <AdminHeader title="Marketing" subtitle="Bundles, discount codes, homepage banners." />
      <div className="admin-marketing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginTop: 24 }}>
        <Card>
          <div className="eyebrow eyebrow--gold">Active Bundle</div>
          <h3 style={{ marginTop: 6, fontSize: 24 }}>5 designer for $125</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 18 }}>
            <Toggle label="Active" on /><Toggle label="Show on homepage" on /><Toggle label="Auto-apply in cart" on /><Toggle label="Allow stacking" on />
          </div>
        </Card>
        <Card style={{ background: 'var(--ink)', color: 'var(--cream)' }}>
          <div className="eyebrow" style={{ color: 'var(--gold)' }}>Active Bundle</div>
          <h3 style={{ marginTop: 6, fontSize: 24, color: 'var(--cream)' }}>2 niche for $190</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 18 }}>
            <Toggle label="Active" on dark /><Toggle label="Show on homepage" on dark /><Toggle label="Auto-apply" on dark /><Toggle label="Allow stacking" on dark />
          </div>
        </Card>
      </div>
    </>
  );
}

function CustomersPanel() {
  const cs = [
    { name: 'Imani Lawson',  email: 'imani.l@gmail.com',      orders: 4, ltv: 510, tier: 'VIP',        last: '2 hrs ago' },
    { name: 'Jada Carter',   email: 'jadacarter@outlook.com',  orders: 6, ltv: 890, tier: 'VIP',        last: 'Yesterday' },
    { name: 'Marcus Henley', email: 'mhenley@gmail.com',       orders: 2, ltv: 315, tier: 'Repeat',     last: '3 hrs ago' },
    { name: 'Devon Park',    email: 'devon.park@me.com',       orders: 3, ltv: 425, tier: 'Repeat',     last: 'Yesterday' },
    { name: 'Aaliyah Singh', email: 'asingh1@gmail.com',       orders: 1, ltv: 125, tier: 'First-time', last: '2 days ago' },
    { name: 'Camille Brooks',email: 'c.brooks@gmail.com',      orders: 5, ltv: 720, tier: 'VIP',        last: '2 days ago' },
    { name: 'Eric Adams',    email: 'eric.adams.tn@gmail.com', orders: 1, ltv: 75,  tier: 'First-time', last: '4 days ago' },
  ];
  return (
    <>
      <AdminHeader title="Customers" subtitle="342 total · 9 new this week" right={<button className="btn btn--primary btn--sm">Export CSV</button>} />
      <Card style={{ marginTop: 20, padding: 0 }}>
        <div className="admin-table-wrap">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 520 }}>
            <thead><tr style={{ textAlign: 'left', color: 'var(--mute)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', background: 'var(--cream-2)' }}>
              {['Customer','Orders','LTV','Tier','Last seen'].map((h, i) => <th key={i} style={{ padding: i === 0 ? '14px 20px' : '14px 12px' }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {cs.map(c => (
                <tr key={c.email} style={{ borderTop: '1px solid var(--line-soft)' }}>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ fontFamily: 'var(--serif)', fontSize: 16 }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--mute)' }}>{c.email}</div>
                  </td>
                  <td style={{ padding: '14px 12px' }}>{c.orders}</td>
                  <td style={{ padding: '14px 12px', fontFamily: 'var(--serif)', fontSize: 15 }}>${c.ltv}</td>
                  <td style={{ padding: '14px 12px' }}><span className={`chip ${c.tier === 'VIP' ? 'chip--solid-gold' : ''}`} style={{ borderColor: c.tier === 'VIP' ? 'var(--gold)' : 'var(--line)' }}>{c.tier}</span></td>
                  <td style={{ padding: '14px 20px 14px 12px', color: 'var(--mute)', whiteSpace: 'nowrap' }}>{c.last}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

function SettingsPanel() {
  return (
    <>
      <AdminHeader title="Settings" subtitle="Studio hours, payment, contact info." />
      <div className="admin-settings-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 24 }}>
        <Card>
          <div className="eyebrow eyebrow--gold">Studio Hours</div>
          <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14 }}>
            {[['Mon','By appointment'],['Tue','By appointment'],['Wed','By appointment'],['Thu','4 PM – 8 PM'],['Fri','4 PM – 8 PM'],['Sat','10 AM – 7 PM'],['Sun','1 PM – 5 PM']].map(([d,h]) => (
              <div key={d} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--line-soft)', padding: '8px 0', gap: 8 }}>
                <span style={{ width: 50, color: 'var(--mute)', flexShrink: 0 }}>{d}</span><span style={{ flex: 1 }}>{h}</span>
                <button style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--mute)', flexShrink: 0 }}>Edit</button>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <div className="eyebrow eyebrow--gold">Contact</div>
          <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[['Public phone','901·921·2322'],['Email','hello@scentsbydajaab.com'],['Instagram','@scentsbydajaab'],['Neighborhood','Midtown · Memphis, TN']].map(([l,v]) => (
              <div key={l}><div className="label">{l}</div><input className="field field--boxed" defaultValue={v} /></div>
            ))}
          </div>
        </Card>
        <Card>
          <div className="eyebrow eyebrow--gold">Payment</div>
          <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Toggle label="Zelle accepted" on /><Toggle label="Cash accepted" on />
            <Toggle label="Apple Pay accepted" on /><Toggle label="Card in-person" on />
            <Toggle label="Online card (Stripe)" />
          </div>
        </Card>
        <Card>
          <div className="eyebrow eyebrow--gold">Email Templates</div>
          <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14 }}>
            {['Order confirmation','Pickup window confirmed','Bottle ready for pickup','Order completed · thank you','Welcome to the list'].map(t => (
              <div key={t} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--line-soft)', padding: '10px 0', gap: 8 }}>
                <span style={{ flex: 1 }}>{t}</span>
                <button style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold-deep)', borderBottom: '1px solid var(--gold-deep)', flexShrink: 0 }}>Edit</button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

// ── Admin primitives ──────────────────────────────────────────────────────────
function AdminHeader({ title, subtitle, right }: { title: string; subtitle: string; right?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', flexWrap: 'wrap', gap: 14 }}>
      <div>
        <h1 className="admin-header-h1" style={{ fontSize: 'clamp(28px, 4vw, 48px)', lineHeight: 1 }}>{title}</h1>
        <div style={{ color: 'var(--mute)', marginTop: 8, fontSize: 14 }}>{subtitle}</div>
      </div>
      {right && <div>{right}</div>}
    </div>
  );
}
function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ background: 'var(--cream)', padding: 24, border: '1px solid var(--line)', ...style }}>{children}</div>;
}
function KpiCard({ label, value, delta, up, sub }: { label: string; value: string; delta: string; up: boolean; sub: string }) {
  return (
    <Card>
      <div className="eyebrow" style={{ fontSize: 9 }}>{label}</div>
      <div style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 500, lineHeight: 1, marginTop: 8 }}>{value}</div>
      <div style={{ marginTop: 8, fontSize: 12, color: up ? 'var(--gold-deep)' : '#a04444' }}>{up ? '↑' : '↓'} {delta}</div>
      <div style={{ fontSize: 11, color: 'var(--mute)', marginTop: 4 }}>{sub}</div>
    </Card>
  );
}
function StatusPill({ status }: { status: string }) {
  const map: Record<string, { c: string; b: string; l: string }> = {
    pending:   { c: 'var(--gold-deep)', b: 'rgba(168,137,63,0.12)', l: 'Pending' },
    ready:     { c: 'var(--ink)',       b: 'var(--gold)',            l: 'Ready' },
    completed: { c: '#3a6a3a',          b: 'rgba(58,106,58,0.12)',   l: 'Done' },
  };
  const s = map[status] || map.pending;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 8px', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: s.c, background: s.b, fontWeight: 500, whiteSpace: 'nowrap' }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.c }} />{s.l}
    </span>
  );
}
function BundleBar({ label, pct, count, gold, muted }: { label: string; pct: number; count: number; gold?: boolean; muted?: boolean }) {
  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
        <span>{label}</span><span style={{ color: 'var(--mute)' }}>{count} · {pct}%</span>
      </div>
      <div style={{ height: 5, background: 'var(--line-soft)', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${pct}%`, background: muted ? 'var(--char)' : gold ? 'var(--gold)' : 'var(--ink)' }} />
      </div>
    </div>
  );
}
function Toggle({ label, on, dark }: { label: string; on?: boolean; dark?: boolean }) {
  const [v, setV] = useState(!!on);
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13, color: dark ? 'var(--cream)' : 'var(--ink)', minHeight: 40 }}>
      <button type="button" onClick={() => setV(!v)} style={{ width: 36, height: 20, borderRadius: 20, background: v ? 'var(--gold)' : (dark ? 'rgba(250,246,236,0.2)' : 'var(--line)'), position: 'relative', transition: 'background 200ms', flexShrink: 0 }}>
        <span style={{ position: 'absolute', top: 2, left: v ? 18 : 2, width: 16, height: 16, borderRadius: '50%', background: 'var(--cream)', transition: 'left 200ms' }} />
      </button>
      {label}
    </label>
  );
}
function Sparkline() {
  const max = Math.max(...REV_SERIES);
  const W = 600, H = 180, P = 20;
  const pts = REV_SERIES.map((v, i) => {
    const x = P + (i / (REV_SERIES.length - 1)) * (W - P * 2);
    const y = H - P - (v / max) * (H - P * 2);
    return `${x},${y}`;
  }).join(' ');
  const area = `${P},${H-P} ${pts} ${W-P},${H-P}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 160, marginTop: 20 }}>
      <defs>
        <linearGradient id="rev-fill" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#C9A961" stopOpacity="0.35" /><stop offset="100%" stopColor="#C9A961" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25,0.5,0.75].map(t => <line key={t} x1={P} x2={W-P} y1={H-P-t*(H-P*2)} y2={H-P-t*(H-P*2)} stroke="#E8DFC8" strokeDasharray="2 4" />)}
      <polygon points={area} fill="url(#rev-fill)" />
      <polyline points={pts} fill="none" stroke="#1A1A1A" strokeWidth="1.5" />
      {REV_SERIES.map((v, i) => {
        const x = P + (i / (REV_SERIES.length - 1)) * (W - P * 2);
        const y = H - P - (v / max) * (H - P * 2);
        return <circle key={i} cx={x} cy={y} r={i === REV_SERIES.length - 1 ? 4 : 2} fill={i === REV_SERIES.length - 1 ? '#C9A961' : '#1A1A1A'} />;
      })}
    </svg>
  );
}
