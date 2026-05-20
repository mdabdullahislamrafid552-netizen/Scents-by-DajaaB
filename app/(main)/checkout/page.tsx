'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { PRODUCTS } from '@/data/products';
import { Icon } from '@/components/Icons';
import { useCart } from '@/context/CartContext';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, setCart } = useCart();
  const [step, setStep] = useState(cart.length === 0 ? 'empty' : 'details');
  const [form, setForm] = useState({ name: '', email: '', phone: '', window: 'saturday-pm', notes: '', payment: 'zelle' });
  const [confirmed, setConfirmed] = useState<any>(null);

  const items = cart.map(c => ({ ...c, p: PRODUCTS.find(p => p.id === c.id) })).filter(x => x.p) as { id: string; qty: number; p: typeof PRODUCTS[0] }[];
  const subtotal = items.reduce((s, it) => s + it.p.price * it.qty, 0);

  const designerItems = items.filter(it => it.p.tier !== 'niche');
  const designerQty = designerItems.reduce((s, it) => s + it.qty, 0);
  const nicheItems = items.filter(it => it.p.tier === 'niche');
  const nicheQty = nicheItems.reduce((s, it) => s + it.qty, 0);
  const designerBundles = Math.floor(designerQty / 5);
  const nicheBundles = Math.floor(nicheQty / 2);
  let bundleDiscount = 0;
  if (designerBundles > 0) {
    const units: number[] = []; designerItems.forEach(it => { for (let i = 0; i < it.qty; i++) units.push(it.p.price); });
    units.sort((a, b) => b - a);
    bundleDiscount += Math.max(0, units.slice(0, designerBundles * 5).reduce((s, v) => s + v, 0) - designerBundles * 125);
  }
  if (nicheBundles > 0) {
    const units: number[] = []; nicheItems.forEach(it => { for (let i = 0; i < it.qty; i++) units.push(it.p.price); });
    units.sort((a, b) => b - a);
    bundleDiscount += Math.max(0, units.slice(0, nicheBundles * 2).reduce((s, v) => s + v, 0) - nicheBundles * 190);
  }
  const total = subtotal - bundleDiscount;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const orderNum = 'SBD-' + Math.floor(Math.random() * 9000 + 1000);
    setConfirmed({ num: orderNum, ...form, items: [...items], subtotal, bundleDiscount, total });
    setCart([]);
    setStep('done');
  };

  if (step === 'empty' || (items.length === 0 && step !== 'done')) {
    return (
      <div className="container section" style={{ textAlign: 'center', padding: '80px 32px' }}>
        <div className="eyebrow eyebrow--gold">Checkout</div>
        <h1 style={{ marginTop: 16, fontSize: 'clamp(36px, 6vw, 80px)' }}>Your bag is <span className="italic">empty.</span></h1>
        <p style={{ color: 'var(--mute)', marginTop: 12 }}>Add a few bottles before checking out.</p>
        <button onClick={() => router.push('/shop')} className="btn btn--primary" style={{ marginTop: 24, width: '100%', maxWidth: 320 }}>Back to the shop</button>
      </div>
    );
  }

  if (step === 'done' && confirmed) return <Confirmation order={confirmed} onContinue={() => router.push('/shop')} />;

  return (
    <div className="fade-in">
      <section style={{ padding: '36px 0 80px' }}>
        <div className="container">
          {/* On mobile: order summary appears ABOVE the form (via CSS order: -1 on the aside) */}
          <div className="checkout-grid">
            {/* ── Form ── */}
            <div>
              <div className="eyebrow eyebrow--gold">Reserve for Pickup</div>
              <h1 style={{ marginTop: 10, fontSize: 'clamp(32px, 5vw, 72px)' }}>Tell Dajaa <span className="italic">who's coming.</span></h1>
              <p style={{ color: 'var(--char)', marginTop: 14, maxWidth: 540, fontSize: 15 }}>
                We hold your bottles for 48 hours. Dajaa will confirm by text within 2 hours and share the studio address + pickup window. Pay on pickup — cash, Zelle, or Apple Pay.
              </p>
              <form onSubmit={submit} style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 24 }}>
                <CSection title="Your details" num="01">
                  <div className="checkout-form-cols" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                    <Field label="Full name" required value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="Dajaa Bowen" />
                    <Field label="Phone (we text)" required value={form.phone} onChange={v => setForm(f => ({ ...f, phone: v }))} placeholder="901·555·0123" type="tel" />
                  </div>
                  <Field label="Email (order receipt)" required value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} placeholder="you@example.com" type="email" />
                </CSection>

                <CSection title="Pickup window" num="02">
                  <div className="checkout-window-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {[['saturday-am','Saturday','10 AM – 1 PM'],['saturday-pm','Saturday','3 PM – 7 PM'],['sunday-pm','Sunday','1 PM – 5 PM'],['weekday-eve','Weekday','Eve · text to confirm']].map(([val,day,time]) => (
                      <label key={val} style={{ cursor: 'pointer', border: '1px solid var(--line)', padding: '14px 16px', display: 'block', borderColor: form.window === val ? 'var(--ink)' : 'var(--line)', background: form.window === val ? 'var(--cream-2)' : 'transparent', minHeight: 72 }}>
                        <input type="radio" name="window" value={val} checked={form.window === val} onChange={e => setForm(f => ({ ...f, window: e.target.value }))} style={{ display: 'none' }} />
                        <div className="eyebrow eyebrow--ink">{day}</div>
                        <div style={{ fontFamily: 'var(--serif)', fontSize: 20, marginTop: 4 }}>{time}</div>
                      </label>
                    ))}
                  </div>
                </CSection>

                <CSection title="Payment method" num="03">
                  <div className="checkout-payment-row" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {[['zelle','Zelle'],['cash','Cash'],['apple','Apple Pay'],['card','Card']].map(([val, label]) => (
                      <label key={val} style={{ cursor: 'pointer', padding: '12px 16px', border: form.payment === val ? '1px solid var(--ink)' : '1px solid var(--line)', background: form.payment === val ? 'var(--ink)' : 'transparent', color: form.payment === val ? 'var(--cream)' : 'var(--ink)', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, flex: '1 1 100px' }}>
                        <input type="radio" name="payment" value={val} checked={form.payment === val} onChange={e => setForm(f => ({ ...f, payment: e.target.value }))} style={{ display: 'none' }} />
                        {label}
                      </label>
                    ))}
                  </div>
                  <p style={{ marginTop: 10, fontSize: 12, color: 'var(--mute)' }}>No payment processed online — confirm at pickup.</p>
                </CSection>

                <CSection title="Anything else?" num="04">
                  <textarea placeholder="Allergies, sample requests, gift wrap, who you're shopping for…" rows={3} className="field field--boxed"
                            value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                            style={{ resize: 'vertical' }} />
                </CSection>

                <div className="checkout-submit-row" style={{ display: 'flex', gap: 14, alignItems: 'center', marginTop: 8 }}>
                  <button type="button" onClick={() => router.push('/shop')} className="btn btn--ghost"><Icon.ArrowL /> Keep shopping</button>
                  <button type="submit" className="btn btn--primary btn--lg" style={{ flex: 1 }} disabled={!form.name || !form.email || !form.phone}>
                    Reserve · ${total.toFixed(0)} <Icon.Arrow />
                  </button>
                </div>
              </form>
            </div>

            {/* ── Order summary (sticky on desktop, above form on mobile) ── */}
            <aside className="checkout-aside" style={{ position: 'sticky', top: 100, alignSelf: 'start' }}>
              <div style={{ background: 'var(--cream-2)', padding: '24px 24px', border: '1px solid var(--line)' }}>
                <div className="eyebrow eyebrow--gold">Order summary</div>
                <h3 style={{ marginTop: 8, fontSize: 'clamp(20px, 3vw, 28px)' }}>{items.length} {items.length === 1 ? 'bottle' : 'bottles'}</h3>
                <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column' }}>
                  {items.map(({ p, qty }) => (
                    <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '48px 1fr auto', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--line-soft)' }}>
                      <div style={{ position: 'relative', width: 48, height: 60, overflow: 'hidden', flexShrink: 0, background: p.tier === 'niche' ? '#0e0e0e' : 'var(--cream-2)' }}>
                        <Image src={p.mainImage} alt={p.name} fill sizes="48px" style={{ objectFit: 'cover', objectPosition: 'center' }} />
                      </div>
                      <div>
                        <div className="eyebrow" style={{ fontSize: 10 }}>{p.brand} · ×{qty}</div>
                        <div style={{ fontFamily: 'var(--serif)', fontSize: 15 }}>{p.name}</div>
                      </div>
                      <div style={{ fontFamily: 'var(--serif)', fontSize: 16, fontWeight: 500 }}>${(p.price * qty).toFixed(0)}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--mute)' }}>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                  {bundleDiscount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--gold-deep)' }}><span>✦ Bundle savings</span><span>−${bundleDiscount.toFixed(2)}</span></div>}
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--mute)' }}><span>Shipping</span><span style={{ fontStyle: 'italic' }}>Pickup only</span></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--line)' }}>
                  <span className="eyebrow eyebrow--ink">Total at pickup</span>
                  <span style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 500 }}>${total.toFixed(2)}</span>
                </div>
              </div>
              <div style={{ marginTop: 12, padding: '16px 20px', background: 'var(--ink)', color: 'var(--cream)', display: 'flex', gap: 12, alignItems: 'center' }}>
                <Icon.Phone style={{ color: 'var(--gold)', flexShrink: 0 }} />
                <div>
                  <div className="eyebrow" style={{ color: 'var(--gold)' }}>Questions?</div>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: 20, color: 'var(--cream)' }}>Text Dajaa · 901·921·2322</div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}

function CSection({ title, num, children }: { title: string; num: string; children: React.ReactNode }) {
  return (
    <div style={{ borderTop: '1px solid var(--ink)', paddingTop: 24 }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'baseline', marginBottom: 20 }}>
        <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 24, color: 'var(--gold-deep)' }}>{num}.</span>
        <h3 style={{ fontSize: 'clamp(20px, 3vw, 26px)' }}>{title}</h3>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>{children}</div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = 'text', required }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; required?: boolean;
}) {
  return (
    <label style={{ display: 'block' }}>
      <span className="label">{label}{required && <span style={{ color: 'var(--gold-deep)' }}> *</span>}</span>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required={required} className="field"
             style={{ fontSize: 16, padding: '12px 0' }} />
    </label>
  );
}

function Confirmation({ order, onContinue }: { order: any; onContinue: () => void }) {
  return (
    <div className="fade-in" style={{ padding: '48px 0 96px', background: 'var(--cream-2)', minHeight: '60vh' }}>
      <div className="container--narrow" style={{ textAlign: 'center', maxWidth: 600 }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--gold)', color: 'var(--ink)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon.Check width="28" height="28" />
        </div>
        <div className="eyebrow eyebrow--gold" style={{ marginTop: 24 }}>Order received · #{order.num}</div>
        <h1 style={{ marginTop: 10, fontSize: 'clamp(32px, 6vw, 72px)' }}>You're <span className="italic">on the list</span>, {order.name.split(' ')[0] || 'friend'}.</h1>
        <p style={{ color: 'var(--char)', marginTop: 14, fontSize: 16, lineHeight: 1.65 }}>
          Dajaa will text <strong>{order.phone}</strong> within 2 hours to confirm the studio address and your pickup window.
        </p>
        <div style={{ margin: '36px auto 0', background: 'var(--cream)', padding: '24px', border: '1px solid var(--line)', textAlign: 'left' }}>
          <div className="eyebrow eyebrow--ink">Order #{order.num}</div>
          {order.items.map(({ p, qty }: any) => (
            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--line-soft)', gap: 12 }}>
              <span style={{ fontSize: 14 }}>{p.brand} · {p.name} ×{qty}</span>
              <span style={{ fontFamily: 'var(--serif)', flexShrink: 0 }}>${(p.price * qty).toFixed(0)}</span>
            </div>
          ))}
          {order.bundleDiscount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', color: 'var(--gold-deep)' }}>
              <span>Bundle savings</span><span>−${order.bundleDiscount.toFixed(0)}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0 0', borderTop: '1px solid var(--ink)', marginTop: 10 }}>
            <span style={{ fontFamily: 'var(--serif)', fontSize: 20 }}>Total at pickup</span>
            <span style={{ fontFamily: 'var(--serif)', fontSize: 24, fontWeight: 500 }}>${order.total.toFixed(0)}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 32, flexWrap: 'wrap' }}>
          <button className="btn btn--primary" style={{ flex: '1 1 160px' }} onClick={onContinue}>Keep shopping</button>
          <a href="https://instagram.com" className="btn btn--ghost" style={{ flex: '1 1 160px', justifyContent: 'center' }}><Icon.IG /> Follow us</a>
        </div>
      </div>
    </div>
  );
}
