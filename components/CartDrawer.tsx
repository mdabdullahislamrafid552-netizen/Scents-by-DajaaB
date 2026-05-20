'use client';
import { useRouter } from 'next/navigation';
import { PRODUCTS } from '@/data/products';
import { Icon, Monogram } from './Icons';
import Bottle from './Bottle';

interface CartItem { id: string; qty: number; }
interface Props {
  open: boolean;
  onClose: () => void;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

export default function CartDrawer({ open, onClose, cart, setCart }: Props) {
  const router = useRouter();
  const items = cart.map(c => ({ ...c, p: PRODUCTS.find(p => p.id === c.id) })).filter(x => x.p) as { id: string; qty: number; p: typeof PRODUCTS[0] }[];
  const subtotal = items.reduce((s, it) => s + it.p.price * it.qty, 0);
  const count = items.reduce((s, it) => s + it.qty, 0);

  const designerItems = items.filter(it => it.p.tier !== 'niche');
  const designerQty = designerItems.reduce((s, it) => s + it.qty, 0);
  const nicheItems = items.filter(it => it.p.tier === 'niche');
  const nicheQty = nicheItems.reduce((s, it) => s + it.qty, 0);
  const designerBundles = Math.floor(designerQty / 5);
  const nicheBundles = Math.floor(nicheQty / 2);

  let bundleDiscount = 0;
  if (designerBundles > 0) {
    const units: number[] = [];
    designerItems.forEach(it => { for (let i = 0; i < it.qty; i++) units.push(it.p.price); });
    units.sort((a, b) => b - a);
    bundleDiscount += Math.max(0, units.slice(0, designerBundles * 5).reduce((s, v) => s + v, 0) - designerBundles * 125);
  }
  if (nicheBundles > 0) {
    const units: number[] = [];
    nicheItems.forEach(it => { for (let i = 0; i < it.qty; i++) units.push(it.p.price); });
    units.sort((a, b) => b - a);
    bundleDiscount += Math.max(0, units.slice(0, nicheBundles * 2).reduce((s, v) => s + v, 0) - nicheBundles * 190);
  }
  const total = subtotal - bundleDiscount;
  const nextDesignerNeeded = designerQty === 0 ? 5 : (5 - (designerQty % 5)) % 5;
  const nextNicheNeeded = nicheQty === 0 ? 2 : (2 - (nicheQty % 2)) % 2;

  const update = (id: string, delta: number) => {
    setCart(prev => prev.flatMap(c =>
      c.id === id ? (c.qty + delta <= 0 ? [] : [{ ...c, qty: c.qty + delta }]) : [c]
    ));
  };
  const remove = (id: string) => setCart(prev => prev.filter(c => c.id !== id));

  return (
    <>
      <div className={`drawer-backdrop ${open ? 'open' : ''}`} onClick={onClose} />
      <aside className={`drawer ${open ? 'open' : ''}`} aria-hidden={!open}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 28px', borderBottom: '1px solid var(--line)' }}>
          <div>
            <div className="eyebrow eyebrow--gold">Your Bag</div>
            <h3 style={{ fontSize: 24, marginTop: 4 }}>{count} {count === 1 ? 'item' : 'items'}</h3>
          </div>
          <button onClick={onClose} aria-label="Close cart"><Icon.Close /></button>
        </header>

        {items.length > 0 && (nextDesignerNeeded > 0 || nextNicheNeeded > 0) && (
          <div style={{ background: 'var(--beige)', borderBottom: '1px solid var(--line-soft)', padding: '16px 28px' }}>
            {nextDesignerNeeded > 0 && designerQty > 0 && (
              <div style={{ fontSize: 12 }}>
                <strong style={{ color: 'var(--gold-deep)' }}>+{nextDesignerNeeded} more designer</strong>
                {' '}unlocks the <strong>5 for $125</strong> bundle
                <div style={{ height: 3, background: 'var(--cream)', marginTop: 8, position: 'relative', border: '1px solid var(--line)' }}>
                  <div style={{ position: 'absolute', inset: 0, width: `${(designerQty % 5) / 5 * 100}%`, background: 'var(--gold)' }} />
                </div>
              </div>
            )}
            {nextNicheNeeded > 0 && nicheQty > 0 && (
              <div style={{ fontSize: 12, marginTop: 12 }}>
                <strong style={{ color: 'var(--gold-deep)' }}>+{nextNicheNeeded} more niche</strong>
                {' '}unlocks the <strong>2 for $190</strong> bundle
              </div>
            )}
            {(designerBundles > 0 || nicheBundles > 0) && (
              <div style={{ fontSize: 12, color: 'var(--gold-deep)', marginTop: 12, fontWeight: 500 }}>
                ✦ Bundle applied — saving ${bundleDiscount.toFixed(2)}
              </div>
            )}
          </div>
        )}

        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 28px' }}>
          {items.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 16px', color: 'var(--mute)' }}>
              <Monogram size={56} />
              <div style={{ marginTop: 24, fontFamily: 'var(--serif)', fontSize: 22 }}>Your bag is empty.</div>
              <p style={{ fontSize: 13, marginTop: 8 }}>Start with our best sellers or explore the niche shelf.</p>
              <button className="btn btn--primary" style={{ marginTop: 20 }}
                      onClick={() => { onClose(); router.push('/shop'); }}>Browse the Shop</button>
            </div>
          )}
          {items.map(({ p, qty }) => (
            <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '72px 1fr auto', gap: 16, padding: '16px 0', borderBottom: '1px solid var(--line-soft)' }}>
              <div className="bottle-frame" style={{ width: 72, height: 90 }}>
                <Bottle {...p.visual} brand="" silk={false} />
              </div>
              <div>
                <div className="eyebrow" style={{ marginBottom: 4 }}>{p.brand}</div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 500 }}>{p.name}</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 10 }}>
                  <button onClick={() => update(p.id, -1)} style={{ width: 26, height: 26, border: '1px solid var(--line)' }}><Icon.Minus /></button>
                  <span style={{ minWidth: 24, textAlign: 'center', fontSize: 13 }}>{qty}</span>
                  <button onClick={() => update(p.id, +1)} style={{ width: 26, height: 26, border: '1px solid var(--line)' }}><Icon.Plus /></button>
                  <button onClick={() => remove(p.id)} style={{ marginLeft: 12, fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--mute)', textDecoration: 'underline' }}>Remove</button>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 500 }}>${(p.price * qty).toFixed(0)}</div>
                {qty > 1 && <div style={{ fontSize: 11, color: 'var(--mute)' }}>${p.price} ea</div>}
              </div>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <footer style={{ borderTop: '1px solid var(--line)', padding: '24px 28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
              <span style={{ color: 'var(--mute)' }}>Subtotal</span><span>${subtotal.toFixed(2)}</span>
            </div>
            {bundleDiscount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8, color: 'var(--gold-deep)' }}>
                <span>Bundle savings</span><span>−${bundleDiscount.toFixed(2)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 12, borderTop: '1px solid var(--line)' }}>
              <span className="eyebrow">Total · Pickup</span>
              <span style={{ fontFamily: 'var(--serif)', fontSize: 32, fontWeight: 500 }}>${total.toFixed(2)}</span>
            </div>
            <button className="btn btn--primary btn--block" style={{ marginTop: 18 }}
                    onClick={() => { onClose(); router.push('/checkout'); }}>
              Reserve for Pickup <Icon.Arrow />
            </button>
            <div style={{ textAlign: 'center', marginTop: 14, fontSize: 11, color: 'var(--mute)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>
              Pickup in Memphis · No shipping · Pay at pickup
            </div>
          </footer>
        )}
      </aside>
    </>
  );
}
