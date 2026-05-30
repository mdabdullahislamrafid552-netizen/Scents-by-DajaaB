'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProductImage from '@/components/ProductImage';
import { PRODUCTS } from '@/data/products';
import { Icon } from '@/components/Icons';
import { useCart } from '@/context/CartContext';

const ADDR_KEY  = 'sbd-saved-address';
const ADMIN_KEY = 'sbd-admin-state';

function getPaymentMeta() {
  try {
    const s = JSON.parse(localStorage.getItem(ADMIN_KEY) || '{}');
    return {
      cashAppTag:  s?.settings?.cashAppTag  || '$ScentsByDajaaB',
      paypalEmail: s?.settings?.paypalEmail || 'hello@scentsbydajaab.com',
    };
  } catch { return { cashAppTag:'$ScentsByDajaaB', paypalEmail:'hello@scentsbydajaab.com' }; }
}

type GiftDeliverTo = 'friend' | 'me';

interface FormState {
  name: string; email: string; phone: string;
  address: string; city: string; zip: string;
  window: string; notes: string; payment: string;
  isGift: boolean;
  giftDeliverTo: GiftDeliverTo;
  recipientName: string; recipientPhone: string;
  recipientAddress: string; recipientCity: string; recipientZip: string;
}

const BLANK: FormState = {
  name: '', email: '', phone: '',
  address: '', city: '', zip: '',
  window: 'saturday-pm', notes: '', payment: 'zelle',
  isGift: false, giftDeliverTo: 'friend',
  recipientName: '', recipientPhone: '',
  recipientAddress: '', recipientCity: '', recipientZip: '',
};

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, setCart } = useCart();
  const [step, setStep] = useState(cart.length === 0 ? 'empty' : 'details');
  const [form, setForm] = useState<FormState>(BLANK);
  const [confirmed, setConfirmed] = useState<any>(null);
  const [payMeta, setPayMeta] = useState({ cashAppTag:'$ScentsByDajaaB', paypalEmail:'hello@scentsbydajaab.com' });

  /* load saved address + payment meta on mount */
  useEffect(() => {
    try {
      const saved = localStorage.getItem(ADDR_KEY);
      if (saved) {
        const a = JSON.parse(saved);
        setForm(f => ({ ...f, name: a.name||'', email: a.email||'', phone: a.phone||'', address: a.address||'', city: a.city||'', zip: a.zip||'' }));
      }
    } catch {}
    setPayMeta(getPaymentMeta());
  }, []);

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

  const set = (k: keyof FormState, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    /* persist address for next visit */
    try {
      localStorage.setItem(ADDR_KEY, JSON.stringify({ name: form.name, email: form.email, phone: form.phone, address: form.address, city: form.city, zip: form.zip }));
    } catch {}
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

                {/* ── 01 Your details ── */}
                <CSection title="Your details" num="01">
                  <div className="checkout-form-cols" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                    <Field label="Full name" required value={form.name} onChange={v => set('name', v)} placeholder="Dajaa Bowen" />
                    <Field label="Phone (we text)" required value={form.phone} onChange={v => set('phone', v)} placeholder="901·555·0123" type="tel" />
                  </div>
                  <Field label="Email (order receipt)" required value={form.email} onChange={v => set('email', v)} placeholder="you@example.com" type="email" />
                  <Field label="Street address" value={form.address} onChange={v => set('address', v)} placeholder="123 Poplar Ave" />
                  <div className="checkout-form-cols" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                    <Field label="City" value={form.city} onChange={v => set('city', v)} placeholder="Memphis" />
                    <Field label="ZIP" value={form.zip} onChange={v => set('zip', v)} placeholder="38104" />
                  </div>
                  {form.address && (
                    <p style={{ fontSize: 11, color: 'var(--mute)', marginTop: -8 }}>✓ Address saved for next time</p>
                  )}
                </CSection>

                {/* ── 02 Gift toggle ── */}
                <CSection title="Is this a gift?" num="02">
                  {/* Toggle */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', padding: '16px 20px', border: `1px solid ${form.isGift ? 'var(--gold)' : 'var(--line)'}`, background: form.isGift ? 'rgba(201,169,97,0.06)' : 'transparent', transition: 'all 180ms' }}>
                    <span style={{ width: 42, height: 24, borderRadius: 12, background: form.isGift ? 'var(--gold)' : 'var(--line)', position: 'relative', flexShrink: 0, transition: 'background 200ms' }}>
                      <span style={{ position: 'absolute', top: 3, left: form.isGift ? 21 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 200ms', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                    </span>
                    <input type="checkbox" checked={form.isGift} onChange={e => set('isGift', e.target.checked)} style={{ display: 'none' }} />
                    <div>
                      <div style={{ fontFamily: 'var(--serif)', fontSize: 17, fontWeight: 500 }}>Buying this as a gift for someone else?</div>
                      <div style={{ fontSize: 12, color: 'var(--mute)', marginTop: 2 }}>We'll coordinate pickup details for the recipient</div>
                    </div>
                  </label>

                  {form.isGift && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 4 }}>
                      {/* Deliver-to selector */}
                      <div>
                        <div className="label" style={{ marginBottom: 10 }}>Where should the order go?</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                          {([['friend', '🎁 To my friend', 'Friend picks up or receives the bottle'] as const,
                             ['me',     '👤 To me first',  'I\'ll hand it off myself'] as const]).map(([val, title, sub]) => (
                            <label key={val} style={{ cursor: 'pointer', border: `1px solid ${form.giftDeliverTo === val ? 'var(--gold)' : 'var(--line)'}`, padding: '14px 16px', background: form.giftDeliverTo === val ? 'rgba(201,169,97,0.07)' : 'transparent', transition: 'all 180ms' }}>
                              <input type="radio" name="giftDeliverTo" value={val} checked={form.giftDeliverTo === val} onChange={() => set('giftDeliverTo', val)} style={{ display: 'none' }} />
                              <div style={{ fontFamily: 'var(--serif)', fontSize: 16, fontWeight: 500 }}>{title}</div>
                              <div style={{ fontSize: 11, color: 'var(--mute)', marginTop: 3 }}>{sub}</div>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Recipient details */}
                      <div style={{ padding: '20px', background: 'var(--cream-2)', border: '1px solid var(--line)' }}>
                        <div className="eyebrow eyebrow--gold" style={{ marginBottom: 14 }}>
                          Recipient details {form.giftDeliverTo === 'friend' ? '(required)' : '(optional)'}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                          <div className="checkout-form-cols" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <Field
                              label="Recipient's name"
                              required={form.giftDeliverTo === 'friend'}
                              value={form.recipientName}
                              onChange={v => set('recipientName', v)}
                              placeholder="Friend's full name"
                            />
                            <Field
                              label="Recipient's phone"
                              required={form.giftDeliverTo === 'friend'}
                              value={form.recipientPhone}
                              onChange={v => set('recipientPhone', v)}
                              placeholder="901·555·0000"
                              type="tel"
                            />
                          </div>
                          <Field
                            label="Recipient's address (optional)"
                            value={form.recipientAddress}
                            onChange={v => set('recipientAddress', v)}
                            placeholder="123 Friend St"
                          />
                          <div className="checkout-form-cols" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <Field label="City" value={form.recipientCity} onChange={v => set('recipientCity', v)} placeholder="Memphis" />
                            <Field label="ZIP"  value={form.recipientZip}  onChange={v => set('recipientZip', v)}  placeholder="38104" />
                          </div>
                        </div>
                      </div>

                      {/* Customer's own address — dimmed if delivering to friend */}
                      {form.giftDeliverTo === 'friend' && (
                        <div style={{ padding: '14px 16px', border: '1px dashed var(--line)', background: 'transparent', opacity: 0.6 }}>
                          <div style={{ fontSize: 12, color: 'var(--mute)' }}>
                            <strong>Your address</strong> — on file{form.address ? `: ${form.address}, ${form.city}` : ' (not required for this order)'}.
                            {form.address ? '' : ' Edit above if needed.'}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CSection>

                {/* ── 03 Pickup window ── */}
                <CSection title="Pickup window" num="03">
                  <div className="checkout-window-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {[['saturday-am','Saturday','10 AM – 1 PM'],['saturday-pm','Saturday','3 PM – 7 PM'],['sunday-pm','Sunday','1 PM – 5 PM'],['weekday-eve','Weekday','Eve · text to confirm']].map(([val,day,time]) => (
                      <label key={val} style={{ cursor: 'pointer', border: '1px solid var(--line)', padding: '14px 16px', display: 'block', borderColor: form.window === val ? 'var(--ink)' : 'var(--line)', background: form.window === val ? 'var(--cream-2)' : 'transparent', minHeight: 72 }}>
                        <input type="radio" name="window" value={val} checked={form.window === val} onChange={e => set('window', e.target.value)} style={{ display: 'none' }} />
                        <div className="eyebrow eyebrow--ink">{day}</div>
                        <div style={{ fontFamily: 'var(--serif)', fontSize: 20, marginTop: 4 }}>{time}</div>
                      </label>
                    ))}
                  </div>
                </CSection>

                {/* ── 04 Payment ── */}
                <CSection title="Payment method" num="04">
                  <div className="checkout-payment-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 10 }}>
                    {[
                      ['zelle',   '⚡ Zelle'],
                      ['cash',    '💵 Cash'],
                      ['apple',   ' Apple Pay'],
                      ['cashapp', '💚 Cash App'],
                      ['paypal',  '🔵 PayPal'],
                      ['card',    '💳 Card'],
                    ].map(([val, label]) => (
                      <label key={val} style={{ cursor: 'pointer', padding: '12px 10px', border: form.payment === val ? '1px solid var(--ink)' : '1px solid var(--line)', background: form.payment === val ? 'var(--ink)' : 'transparent', color: form.payment === val ? 'var(--cream)' : 'var(--ink)', fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: 52, transition: 'all 160ms' }}>
                        <input type="radio" name="payment" value={val} checked={form.payment === val} onChange={e => set('payment', e.target.value)} style={{ display: 'none' }} />
                        {label}
                      </label>
                    ))}
                  </div>

                  {/* Cash App info */}
                  {form.payment === 'cashapp' && (
                    <div style={{ marginTop: 14, padding: '14px 16px', background: 'var(--cream-2)', border: '1px solid var(--line)' }}>
                      <div className="eyebrow eyebrow--gold" style={{ marginBottom: 6 }}>Send via Cash App</div>
                      <div style={{ fontFamily: 'var(--serif)', fontSize: 22 }}>{payMeta.cashAppTag}</div>
                      <p style={{ fontSize: 12, color: 'var(--mute)', marginTop: 4 }}>Send payment after your reservation is confirmed. Include your order number in the note.</p>
                    </div>
                  )}

                  {/* PayPal info */}
                  {form.payment === 'paypal' && (
                    <div style={{ marginTop: 14, padding: '14px 16px', background: 'var(--cream-2)', border: '1px solid var(--line)' }}>
                      <div className="eyebrow eyebrow--gold" style={{ marginBottom: 6 }}>Send via PayPal</div>
                      <div style={{ fontFamily: 'var(--serif)', fontSize: 22 }}>{payMeta.paypalEmail}</div>
                      <p style={{ fontSize: 12, color: 'var(--mute)', marginTop: 4 }}>Send as "Friends & Family" after your reservation is confirmed. Include your order number in the note.</p>
                    </div>
                  )}

                  <p style={{ marginTop: 10, fontSize: 12, color: 'var(--mute)' }}>No payment processed online — confirm after Dajaa texts you.</p>
                </CSection>

                {/* ── 05 Notes ── */}
                <CSection title="Anything else?" num="05">
                  <textarea placeholder="Sample requests, gift wrap, special instructions…" rows={3} className="field field--boxed"
                            value={form.notes} onChange={e => set('notes', e.target.value)}
                            style={{ resize: 'vertical' }} />
                </CSection>

                <div className="checkout-submit-row" style={{ display: 'flex', gap: 14, alignItems: 'center', marginTop: 8 }}>
                  <button type="button" onClick={() => router.push('/shop')} className="btn btn--ghost"><Icon.ArrowL /> Keep shopping</button>
                  <button type="submit" className="btn btn--primary btn--lg" style={{ flex: 1 }}
                    disabled={!form.name || !form.email || !form.phone || (form.isGift && form.giftDeliverTo === 'friend' && (!form.recipientName || !form.recipientPhone))}>
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
                        <ProductImage src={p.mainImage} alt={p.name} fill sizes="48px" dark={p.tier === 'niche'} />
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
