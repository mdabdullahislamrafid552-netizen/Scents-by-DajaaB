'use client';
import { useState, useReducer, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ProductImage from '@/components/ProductImage';
import { PRODUCTS as STATIC_PRODUCTS, Product, BRANDS } from '@/data/products';
import { Icon } from '@/components/Icons';

/* ═══════════════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════════════ */
type OrderStatus = 'pending' | 'ready' | 'completed' | 'cancelled';
type CustomerTier = 'VIP' | 'Repeat' | 'First-time';

interface AdminOrder {
  id: string; customer: string; phone: string; email: string;
  items: number; total: number; status: OrderStatus;
  when: string; bundle: string | null; notes: string;
}
interface AdminCustomer {
  id: string; name: string; email: string; phone: string;
  orders: number; ltv: number; tier: CustomerTier; last: string;
}
interface StoreHour { day: string; hours: string; }
interface StoreSettings {
  phone: string; email: string; instagram: string; neighborhood: string;
  announcement: string; announcementActive: boolean;
  hours: StoreHour[];
  paymentZelle: boolean; paymentCash: boolean; paymentApple: boolean;
  paymentCard: boolean; paymentStripe: boolean;
  paymentCashApp: boolean; cashAppTag: string;
  paymentPaypal: boolean; paypalEmail: string;
  gift_charge: number;
}
interface AdminState {
  products: Product[];
  orders: AdminOrder[];
  customers: AdminCustomer[];
  settings: StoreSettings;
  designerBundleActive: boolean; designerBundlePrice: number;
  nicheBundleActive: boolean; nicheBundlePrice: number;
  showBundleOnHomepage: boolean; autoApplyBundle: boolean; allowStacking: boolean;
}

/* ═══════════════════════════════════════════════════════════════
   INITIAL DATA
═══════════════════════════════════════════════════════════════ */
const INITIAL_ORDERS: AdminOrder[] = [
  { id:'SBD-4291', customer:'Imani Lawson',   phone:'901·555·0107', email:'imani.l@gmail.com',      items:5, total:125, status:'ready',     when:'2 hrs ago',  bundle:'Designer 5', notes:'' },
  { id:'SBD-4290', customer:'Marcus Henley',  phone:'901·555·0143', email:'mhenley@gmail.com',       items:2, total:190, status:'pending',   when:'3 hrs ago',  bundle:'Niche 2',    notes:'Gift wrap please' },
  { id:'SBD-4289', customer:'Jada Carter',    phone:'901·555·0125', email:'jadacarter@outlook.com',  items:1, total:245, status:'completed', when:'Yesterday',  bundle:null,          notes:'' },
  { id:'SBD-4288', customer:'Devon Park',     phone:'901·555·0181', email:'devon.park@me.com',       items:3, total:250, status:'completed', when:'Yesterday',  bundle:null,          notes:'' },
  { id:'SBD-4287', customer:'Aaliyah Singh',  phone:'901·555·0166', email:'asingh1@gmail.com',       items:5, total:125, status:'completed', when:'2 days ago', bundle:'Designer 5', notes:'' },
  { id:'SBD-4286', customer:'Camille Brooks', phone:'901·555·0192', email:'c.brooks@gmail.com',      items:1, total:100, status:'completed', when:'2 days ago', bundle:null,          notes:'' },
  { id:'SBD-4285', customer:'Tasha Williams', phone:'901·555·0148', email:'tasha.w@gmail.com',       items:2, total:190, status:'ready',     when:'3 days ago', bundle:'Niche 2',    notes:'' },
  { id:'SBD-4284', customer:'Eric Adams',     phone:'901·555·0177', email:'eric.adams.tn@gmail.com', items:1, total:75,  status:'completed', when:'4 days ago', bundle:null,          notes:'' },
];
const INITIAL_CUSTOMERS: AdminCustomer[] = [
  { id:'c1', name:'Imani Lawson',   email:'imani.l@gmail.com',      phone:'901·555·0107', orders:4, ltv:510, tier:'VIP',        last:'2 hrs ago' },
  { id:'c2', name:'Jada Carter',    email:'jadacarter@outlook.com',  phone:'901·555·0125', orders:6, ltv:890, tier:'VIP',        last:'Yesterday' },
  { id:'c3', name:'Marcus Henley',  email:'mhenley@gmail.com',       phone:'901·555·0143', orders:2, ltv:315, tier:'Repeat',     last:'3 hrs ago' },
  { id:'c4', name:'Devon Park',     email:'devon.park@me.com',       phone:'901·555·0181', orders:3, ltv:425, tier:'Repeat',     last:'Yesterday' },
  { id:'c5', name:'Aaliyah Singh',  email:'asingh1@gmail.com',       phone:'901·555·0166', orders:1, ltv:125, tier:'First-time', last:'2 days ago' },
  { id:'c6', name:'Camille Brooks', email:'c.brooks@gmail.com',      phone:'901·555·0192', orders:5, ltv:720, tier:'VIP',        last:'2 days ago' },
  { id:'c7', name:'Eric Adams',     email:'eric.adams.tn@gmail.com', phone:'901·555·0177', orders:1, ltv:75,  tier:'First-time', last:'4 days ago' },
  { id:'c8', name:'Tasha Williams', email:'tasha.w@gmail.com',       phone:'901·555·0148', orders:2, ltv:315, tier:'Repeat',     last:'3 days ago' },
];
const INITIAL_SETTINGS: StoreSettings = {
  phone:'901·921·2322', email:'hello@scentsbydajaab.com',
  instagram:'@scentsbydajaab', neighborhood:'Midtown · Memphis, TN',
  announcement:'✦ Memphis Pickup Only · Text 901·921·2322 to reserve your bottle',
  announcementActive: true,
  hours:[
    {day:'Mon',hours:'By appointment'},{day:'Tue',hours:'By appointment'},
    {day:'Wed',hours:'By appointment'},{day:'Thu',hours:'4 PM – 8 PM'},
    {day:'Fri',hours:'4 PM – 8 PM'},{day:'Sat',hours:'10 AM – 7 PM'},
    {day:'Sun',hours:'1 PM – 5 PM'},
  ],
  paymentZelle:true, paymentCash:true, paymentApple:true, paymentCard:true, paymentStripe:false,
  paymentCashApp:true, cashAppTag:'$ScentsByDajaaB',
  paymentPaypal:true, paypalEmail:'hello@scentsbydajaab.com',
  gift_charge: 10,
};
const INITIAL_STATE: AdminState = {
  products: STATIC_PRODUCTS,
  orders: INITIAL_ORDERS,
  customers: INITIAL_CUSTOMERS,
  settings: INITIAL_SETTINGS,
  designerBundleActive:true, designerBundlePrice:125,
  nicheBundleActive:true, nicheBundlePrice:190,
  showBundleOnHomepage:true, autoApplyBundle:true, allowStacking:true,
};
const REV_SERIES = [180,220,305,270,340,290,410,350,425,580,510,460,540,620];

/* ═══════════════════════════════════════════════════════════════
   REDUCER
═══════════════════════════════════════════════════════════════ */
type AdminAction =
  | { type:'ADD_PRODUCT'; product:Product }
  | { type:'EDIT_PRODUCT'; id:string; updates:Partial<Product> }
  | { type:'DELETE_PRODUCT'; id:string }
  | { type:'TOGGLE_STOCK'; id:string }
  | { type:'UPDATE_ORDER'; id:string; status:OrderStatus }
  | { type:'DELETE_ORDER'; id:string }
  | { type:'UPDATE_SETTINGS'; updates:Partial<StoreSettings> }
  | { type:'PATCH_BUNDLE'; updates:Partial<AdminState> }
  | { type:'LOAD'; state:AdminState };

function adminReducer(state:AdminState, action:AdminAction): AdminState {
  switch (action.type) {
    case 'ADD_PRODUCT':    return { ...state, products:[action.product,...state.products] };
    case 'EDIT_PRODUCT':   return { ...state, products:state.products.map(p=>p.id===action.id?{...p,...action.updates}:p) };
    case 'DELETE_PRODUCT': return { ...state, products:state.products.filter(p=>p.id!==action.id) };
    case 'TOGGLE_STOCK':   return { ...state, products:state.products.map(p=>p.id===action.id?{...p,inStock:!p.inStock}:p) };
    case 'UPDATE_ORDER':   return { ...state, orders:state.orders.map(o=>o.id===action.id?{...o,status:action.status}:o) };
    case 'DELETE_ORDER':   return { ...state, orders:state.orders.filter(o=>o.id!==action.id) };
    case 'UPDATE_SETTINGS':return { ...state, settings:{...state.settings,...action.updates} };
    case 'PATCH_BUNDLE':   return { ...state, ...action.updates };
    case 'LOAD':           return action.state;
    default:               return state;
  }
}

/* ═══════════════════════════════════════════════════════════════
   TOAST
═══════════════════════════════════════════════════════════════ */
interface ToastMsg { id:number; msg:string; type:'success'|'error'|'info'; }
function useToast() {
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const show = useCallback((msg:string, type:'success'|'error'|'info'='success') => {
    const id = Date.now();
    setToasts(t=>[...t,{id,msg,type}]);
    setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),3200);
  },[]);
  return { toasts, show };
}
function ToastStack({ toasts }:{ toasts:ToastMsg[] }) {
  return (
    <div style={{ position:'fixed', bottom:32, right:32, zIndex:9999, display:'flex', flexDirection:'column', gap:10, alignItems:'flex-end' }}>
      {toasts.map(t=>(
        <div key={t.id} style={{
          background: t.type==='error'?'#8B2020':t.type==='info'?'var(--ink)':'#1a1a1a',
          color:'var(--cream)', padding:'14px 20px', display:'flex', alignItems:'center',
          gap:12, boxShadow:'0 20px 40px -16px rgba(0,0,0,0.4)',
          animation:'fadeIn 200ms', minWidth:240, maxWidth:340,
        }}>
          <span style={{ color:t.type==='error'?'#ff8080':'var(--gold)', fontSize:16 }}>
            {t.type==='error'?'✕':t.type==='info'?'ℹ':'✓'}
          </span>
          <span style={{ fontSize:13, flex:1 }}>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CONFIRM DIALOG
═══════════════════════════════════════════════════════════════ */
function ConfirmDialog({ msg, onConfirm, onCancel }:{ msg:string; onConfirm:()=>void; onCancel:()=>void }) {
  return (
    <div style={{ position:'fixed',inset:0,background:'rgba(20,18,12,0.55)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:24 }}>
      <div style={{ background:'var(--cream)',padding:36,maxWidth:420,width:'100%',border:'1px solid var(--ink)' }}>
        <h3 style={{ fontSize:22 }}>Are you sure?</h3>
        <p style={{ marginTop:12,color:'var(--char)',fontSize:14,lineHeight:1.6 }}>{msg}</p>
        <div style={{ display:'flex',gap:12,marginTop:24 }}>
          <button className="btn btn--ghost" style={{ flex:1 }} onClick={onCancel}>Cancel</button>
          <button className="btn btn--primary" style={{ flex:1,background:'#8B2020',borderColor:'#8B2020' }} onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PRODUCT MODAL
═══════════════════════════════════════════════════════════════ */
const BLANK_PRODUCT: Omit<Product,'images'|'mainImage'|'image'|'visual'|'notes'|'blurb'> = {
  id:'', slug:'', name:'', brand:'', tier:'womens', gender:'women',
  price:75, featured:false, inStock:true, stockCount:10, family:'Floral',
  desc:'',
};
function ProductModal({ product, onSave, onClose, mode }:{
  product?: Product; onSave:(p:Product)=>void; onClose:()=>void; mode:'add'|'edit';
}) {
  const [form, setForm] = useState<Partial<Product>>(product ?? {
    ...BLANK_PRODUCT,
    images:[], mainImage:'', image:'',
    visual:{ shape:'column', liquid:'#c9a961', cap:'gold', label:'' },
    notes:{ top:[], middle:[], base:[] },
    blurb:'',
  });
  const set = (k:string, v:unknown) => setForm(f=>({...f,[k]:v}));

  const handleSave = () => {
    if (!form.name?.trim() || !form.brand?.trim()) { alert('Name and Brand are required.'); return; }
    const slug = form.slug?.trim() || (form.name||'').toLowerCase().replace(/[^a-z0-9]+/g,'-');
    const id = form.id?.trim() || `p${Date.now()}`;
    // mainImage stays as-is (data URL or path); empty string → placeholder on storefront
    const imgPath = form.mainImage?.trim() || '';
    onSave({
      ...form as Product,
      id, slug,
      mainImage: imgPath, image: imgPath,
      images: form.images?.length ? form.images : (imgPath ? [imgPath] : []),
      visual: form.visual ?? { shape:'column', liquid:'#c9a961', cap:'gold', label:form.name??'' },
      notes: form.notes ?? { top:[], middle:[], base:[] },
      blurb: form.blurb ?? '',
    });
  };

  return (
    <div style={{ position:'fixed',inset:0,background:'rgba(20,18,12,0.55)',zIndex:1000,display:'flex',alignItems:'flex-start',justifyContent:'center',padding:'24px 16px',overflowY:'auto' }}>
      <div style={{ background:'var(--cream)',width:'100%',maxWidth:680,border:'1px solid var(--ink)',marginTop:20,marginBottom:20 }}>
        {/* Modal header */}
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',padding:'20px 28px',borderBottom:'1px solid var(--line)' }}>
          <h3 style={{ fontSize:22 }}>{mode==='add'?'Add New Product':'Edit Product'}</h3>
          <button onClick={onClose} style={{ minHeight:44,minWidth:44,display:'flex',alignItems:'center',justifyContent:'center' }}><Icon.Close /></button>
        </div>
        {/* Form */}
        <div style={{ padding:'24px 28px',display:'flex',flexDirection:'column',gap:20 }}>
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:16 }}>
            <MField label="Product Name *" value={form.name??''} onChange={v=>set('name',v)} placeholder="Baccarat Rouge 540" />
            <MField label="Brand / House *" value={form.brand??''} onChange={v=>set('brand',v)} placeholder="Maison Francis Kurkdjian" />
          </div>
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:16 }}>
            <div>
              <label className="label">Tier</label>
              <select className="field field--boxed" value={form.tier??'womens'} onChange={e=>set('tier',e.target.value)} style={{ fontSize:14 }}>
                <option value="niche">Niche / Luxury</option>
                <option value="womens">Women&apos;s Designer</option>
                <option value="mens">Men&apos;s Designer</option>
              </select>
            </div>
            <div>
              <label className="label">Gender</label>
              <select className="field field--boxed" value={form.gender??'women'} onChange={e=>set('gender',e.target.value)} style={{ fontSize:14 }}>
                <option value="women">Women</option>
                <option value="men">Men</option>
                <option value="unisex">Unisex</option>
              </select>
            </div>
          </div>
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:16 }}>
            <MField label="Default Price ($)" value={String(form.price??75)} onChange={v=>set('price',Number(v)||0)} type="number" placeholder="75" />
            <MField label="Stock Count" value={String(form.stockCount??10)} onChange={v=>set('stockCount',Number(v)||0)} type="number" placeholder="10" />
            <MField label="Slug (URL)" value={form.slug??''} onChange={v=>set('slug',v)} placeholder="auto-generated" />
          </div>
          {/* Sizes & Pricing */}
          <div style={{ border: '1px solid var(--line)', padding: 16, background: 'var(--cream-2)' }}>
            <label className="eyebrow eyebrow--gold" style={{ marginBottom: 12, display: 'block' }}>Sizes & Pricing</label>
            {(typeof form.sizes === 'string' ? JSON.parse(form.sizes || '[]') : (form.sizes || [])).map((s:any, i:number) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                <input className="field field--boxed" style={{ flex: 1, fontSize: 13 }} placeholder="Size (e.g. 50ml)" value={s.size} onChange={e => {
                  const arr = [...(typeof form.sizes === 'string' ? JSON.parse(form.sizes || '[]') : (form.sizes || []))];
                  arr[i].size = e.target.value;
                  set('sizes', JSON.stringify(arr));
                }} />
                <input className="field field--boxed" style={{ width: 100, fontSize: 13 }} placeholder="Price ($)" type="number" value={s.price} onChange={e => {
                  const arr = [...(typeof form.sizes === 'string' ? JSON.parse(form.sizes || '[]') : (form.sizes || []))];
                  arr[i].price = Number(e.target.value) || 0;
                  set('sizes', JSON.stringify(arr));
                }} />
                <button type="button" className="btn btn--ghost" style={{ padding: '0 12px' }} onClick={() => {
                  const arr = [...(typeof form.sizes === 'string' ? JSON.parse(form.sizes || '[]') : (form.sizes || []))];
                  arr.splice(i, 1);
                  set('sizes', JSON.stringify(arr));
                }}><Icon.Close /></button>
              </div>
            ))}
            <button type="button" className="btn btn--primary btn--sm" style={{ marginTop: 8 }} onClick={() => {
              const arr = [...(typeof form.sizes === 'string' ? JSON.parse(form.sizes || '[]') : (form.sizes || []))];
              arr.push({ size: '', price: 0 });
              set('sizes', JSON.stringify(arr));
            }}><Icon.Plus /> Add another size</button>
          </div>
          <ImageUploadZone
            images={form.images ?? []}
            mainImage={form.mainImage ?? ''}
            onChange={(main, imgs) => { set('mainImage', main); set('images', imgs); }}
          />
          <div>
            <label className="label">Description</label>
            <textarea className="field field--boxed" rows={3} value={form.desc??''} onChange={e=>set('desc',e.target.value)}
              style={{ resize:'vertical',fontSize:14 }} placeholder="A one-sentence editorial description of this fragrance..." />
          </div>
          <div style={{ display:'flex',gap:20,flexWrap:'wrap' }}>
            <label style={{ display:'flex',alignItems:'center',gap:8,cursor:'pointer',fontSize:14,minHeight:40 }}>
              <input type="checkbox" checked={!!form.inStock} onChange={e=>set('inStock',e.target.checked)} style={{ width:16,height:16 }} />
              In Stock
            </label>
            <label style={{ display:'flex',alignItems:'center',gap:8,cursor:'pointer',fontSize:14,minHeight:40 }}>
              <input type="checkbox" checked={!!form.featured} onChange={e=>set('featured',e.target.checked)} style={{ width:16,height:16 }} />
              Featured (shows in Best Sellers)
            </label>
          </div>
        </div>
        {/* Footer */}
        <div style={{ padding:'16px 28px',borderTop:'1px solid var(--line)',display:'flex',gap:12,justifyContent:'flex-end' }}>
          <button className="btn btn--ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn--primary" onClick={handleSave}>{mode==='add'?'Add Product':'Save Changes'}</button>
        </div>
      </div>
    </div>
  );
}
function MField({ label,value,onChange,placeholder,type='text' }:{ label:string;value:string;onChange:(v:string)=>void;placeholder?:string;type?:string }) {
  return (
    <label style={{ display:'block' }}>
      <span className="label">{label}</span>
      <input type={type} className="field field--boxed" value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{ fontSize:14 }} />
    </label>
  );
}

/* ─── drag-and-drop image upload zone ─── */
function ImageUploadZone({ images, mainImage, onChange }:{
  images: string[]; mainImage: string;
  onChange:(main:string, imgs:string[])=>void;
}) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const readFiles = async (files: FileList | File[]) => {
    const newUrls: string[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue;
      const url = await new Promise<string>(res => {
        const r = new FileReader();
        r.onload = e => res(e.target!.result as string);
        r.readAsDataURL(file);
      });
      newUrls.push(url);
    }
    const updated = [...images, ...newUrls];
    onChange(updated[0] ?? '', updated);
  };

  const remove = (i: number) => {
    const next = images.filter((_,idx) => idx !== i);
    onChange(next[0] ?? '', next);
  };

  const setMain = (i: number) => {
    const next = [...images];
    const [picked] = next.splice(i, 1);
    next.unshift(picked);
    onChange(next[0], next);
  };

  return (
    <div>
      <span className="label">Product Images</span>
      {/* Drop zone */}
      <div
        onDrop={e => { e.preventDefault(); setDragging(false); readFiles(e.dataTransfer.files); }}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onClick={() => inputRef.current?.click()}
        style={{
          marginTop:6, border:`2px dashed ${dragging?'var(--gold)':'var(--line)'}`,
          background: dragging?'rgba(201,169,97,0.07)':'var(--cream-2)',
          padding:'24px 16px', textAlign:'center', cursor:'pointer',
          transition:'all 180ms', borderRadius:2,
        }}
      >
        <input ref={inputRef} type="file" multiple accept="image/*" style={{ display:'none' }}
          onChange={e => e.target.files && readFiles(e.target.files)} />
        <div style={{ fontSize:13, color: dragging?'var(--gold-deep)':'var(--mute)' }}>
          {dragging ? '✦ Drop to add' : '↑ Drag images here · or click to browse'}
        </div>
        <div style={{ fontSize:11, color:'var(--mute)', marginTop:4 }}>JPG · PNG · WEBP · multiple OK</div>
      </div>

      {/* Thumbnails */}
      {images.length > 0 ? (
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginTop:10 }}>
          {images.map((src, i) => (
            <div key={i} style={{ position:'relative', width:64, height:80, border: i===0?'2px solid var(--gold)':'1px solid var(--line)', overflow:'hidden', flexShrink:0 }}>
              <img src={src} alt={`img ${i+1}`} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
              {i === 0 && (
                <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'var(--gold)', color:'var(--ink)', fontSize:8, textAlign:'center', letterSpacing:'0.1em', padding:'2px 0' }}>MAIN</div>
              )}
              {i > 0 && (
                <button onClick={e=>{ e.stopPropagation(); setMain(i); }}
                  title="Set as main" style={{ position:'absolute', bottom:0, left:0, right:0, background:'rgba(0,0,0,0.55)', color:'#fff', fontSize:8, padding:'3px 0', cursor:'pointer', letterSpacing:'0.08em' }}>
                  SET MAIN
                </button>
              )}
              <button onClick={e=>{ e.stopPropagation(); remove(i); }}
                style={{ position:'absolute', top:-1, right:-1, width:18, height:18, borderRadius:'50%', background:'var(--ink)', color:'var(--cream)', fontSize:11, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', lineHeight:1 }}>
                ×
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ marginTop:8, fontSize:12, color:'var(--mute)', fontStyle:'italic' }}>
          No images yet — storefront will show a branded placeholder until you add one.
        </p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════ */
export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [state, dispatch] = useReducer(adminReducer, INITIAL_STATE);
  const { toasts, show: toast } = useToast();
  const [confirm, setConfirm] = useState<{msg:string;onConfirm:()=>void}|null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [pRes, oRes, cRes, sRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/orders'),
          fetch('/api/customers'),
          fetch('/api/settings')
        ]);
        const pData = pRes.ok ? await pRes.json() : [];
        const oData = oRes.ok ? await oRes.json() : [];
        const cData = cRes.ok ? await cRes.json() : [];
        const sData = sRes.ok ? await sRes.json() : null;
        
        dispatch({ 
          type: 'LOAD', 
          state: {
            ...INITIAL_STATE,
            products: pData.length ? pData : INITIAL_STATE.products,
            orders: oData.length ? oData : INITIAL_STATE.orders,
            customers: cData.length ? cData : INITIAL_STATE.customers,
            settings: sData ? sData : INITIAL_STATE.settings,
          } 
        });
      } catch (e) {
        console.error('Failed to load admin data', e);
      }
    }
    loadData();
  }, []);

  const customDispatch = async (action: AdminAction) => {
    dispatch(action);
    try {
      if (action.type === 'UPDATE_SETTINGS') {
        await fetch('/api/settings', { method: 'PUT', body: JSON.stringify(action.updates) });
      } else if (action.type === 'UPDATE_ORDER') {
        await fetch('/api/orders', { method: 'PUT', body: JSON.stringify({ id: action.id, status: action.status }) });
      } else if (action.type === 'ADD_PRODUCT' || action.type === 'EDIT_PRODUCT') {
        const product = action.type === 'ADD_PRODUCT' ? action.product : state.products.find(p => p.id === action.id);
        if (product) await fetch('/api/products', { method: 'POST', body: JSON.stringify(action.type === 'EDIT_PRODUCT' ? { ...product, ...action.updates } : product) });
      } else if (action.type === 'TOGGLE_STOCK') {
        const product = state.products.find(p => p.id === action.id);
        if (product) await fetch('/api/products', { method: 'POST', body: JSON.stringify({ ...product, inStock: !product.inStock }) });
      } else if (action.type === 'DELETE_PRODUCT') {
        await fetch(`/api/products?id=${action.id}`, { method: 'DELETE' });
      } else if (action.type === 'DELETE_ORDER') {
        await fetch(`/api/orders?id=${action.id}`, { method: 'DELETE' });
      }
    } catch (e) {
      console.error('API error:', e);
    }
  };

  const tabs:[string,string,React.ReactNode][] = [
    ['dashboard','Dashboard',<Icon.Dashboard key="d"/>],
    ['orders','Orders',<Icon.Box key="o"/>],
    ['products','Products',<Icon.Tag key="p"/>],
    ['bundles','Marketing',<Icon.Sparkle key="b"/>],
    ['customers','Customers',<Icon.User key="c"/>],
    ['settings','Settings',<Icon.Filter key="s"/>],
  ];

  const SidebarContent = (
    <>
      <div style={{ display:'flex',alignItems:'center',gap:12,paddingBottom:24,borderBottom:'1px solid rgba(201,169,97,0.2)' }}>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ fontFamily: 'var(--serif)', fontSize: 16, letterSpacing: '0.05em', lineHeight: 1 }}>Scents by</span>
            <span style={{ fontFamily: 'var(--script)', color: 'var(--gold-deep)', fontSize: 24, lineHeight: 0.8, marginLeft: 12 }}>DajaaB.</span>
          </div>
          <div className="eyebrow" style={{ color:'var(--gold)',fontSize:9,marginTop:4 }}>Studio Admin</div>
        </div>
        <button onClick={()=>setSidebarOpen(false)} className="admin-topbar-close"
                style={{ marginLeft:'auto',color:'var(--cream)',minHeight:44,minWidth:44,display:'flex',alignItems:'center',justifyContent:'center' }}>
          <Icon.Close/>
        </button>
      </div>
      <nav style={{ marginTop:24,display:'flex',flexDirection:'column',gap:4,flex:1 }}>
        {tabs.map(([k,label,icon])=>(
          <button key={k} onClick={()=>{ setTab(k); setSidebarOpen(false); }}
            style={{ display:'flex',alignItems:'center',gap:12,padding:'14px',textAlign:'left',
              background:tab===k?'rgba(201,169,97,0.15)':'transparent',
              color:tab===k?'var(--gold)':'var(--cream)',
              borderLeft:tab===k?'2px solid var(--gold)':'2px solid transparent',
              fontSize:13,letterSpacing:'0.06em',minHeight:48 }}>
            {icon} {label}
          </button>
        ))}
      </nav>
      <div style={{ marginTop:'auto',paddingTop:20,borderTop:'1px solid rgba(201,169,97,0.2)' }}>
        <div style={{ display:'flex',alignItems:'center',gap:10 }}>
          <div style={{ width:36,height:36,borderRadius:'50%',background:'var(--gold)',color:'var(--ink)',display:'inline-flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--script)',fontSize:22 }}>D</div>
          <div style={{ fontSize:13 }}>
            <div style={{ color:'var(--cream)' }}>Dajaa</div>
            <div style={{ color:'rgba(250,246,236,0.55)',fontSize:11 }}>Owner</div>
          </div>
        </div>
        <button onClick={()=>router.push('/')}
          style={{ marginTop:14,display:'flex',alignItems:'center',gap:8,fontSize:11,letterSpacing:'0.16em',textTransform:'uppercase',color:'rgba(250,246,236,0.7)',minHeight:44 }}>
          <Icon.ArrowL/> Back to storefront
        </button>
      </div>
    </>
  );

  const sharedProps = { state, dispatch: customDispatch, toast, setConfirm };

  return (
    <div className="admin-layout">
      <div className={`admin-sidebar-backdrop ${sidebarOpen?'open':''}`} onClick={()=>setSidebarOpen(false)}/>
      <aside className={`admin-sidebar ${sidebarOpen?'open':''}`}>{SidebarContent}</aside>
      <main className="admin-main" style={{ padding:40,overflow:'hidden',minWidth:0 }}>
        <div className="admin-topbar">
          <button onClick={()=>setSidebarOpen(true)} style={{ display:'flex',alignItems:'center',gap:10,minHeight:44 }}>
            <Icon.Menu/>
            <span style={{ fontFamily:'var(--serif)',fontSize:18 }}>{tabs.find(([k])=>k===tab)?.[1]??'Admin'}</span>
          </button>
          <Image src="/logo.png" alt="Scents by DajaaB" width={560} height={180}
            style={{ height:34, width:'auto', objectFit:'contain' }} />
        </div>
        {tab==='dashboard' && <Dashboard {...sharedProps}/>}
        {tab==='orders'    && <OrdersPanel {...sharedProps}/>}
        {tab==='products'  && <ProductsPanel {...sharedProps}/>}
        {tab==='bundles'   && <MarketingPanel {...sharedProps}/>}
        {tab==='customers' && <CustomersPanel {...sharedProps}/>}
        {tab==='settings'  && <SettingsPanel {...sharedProps}/>}
      </main>
      <ToastStack toasts={toasts}/>
      {confirm && <ConfirmDialog msg={confirm.msg} onConfirm={()=>{ confirm.onConfirm(); setConfirm(null); }} onCancel={()=>setConfirm(null)}/>}
    </div>
  );
}

/* ─── Shared panel props ── */
interface PanelProps {
  state:AdminState;
  dispatch:(a:AdminAction)=>void;
  toast:(msg:string,type?:'success'|'error'|'info')=>void;
  setConfirm:(c:{msg:string;onConfirm:()=>void}|null)=>void;
}

/* ═══════════════════════════════════════════════════════════════
   DASHBOARD
═══════════════════════════════════════════════════════════════ */
function Dashboard({ state }:PanelProps) {
  const revenue = state.orders.filter(o=>o.status==='completed').reduce((s,o)=>s+o.total,0);
  const totalOrders = state.orders.length;
  const pending = state.orders.filter(o=>o.status==='pending').length;
  const avgOrder = totalOrders>0 ? (state.orders.reduce((s,o)=>s+o.total,0)/totalOrders) : 0;
  const kpis = [
    { label:'Revenue (all time)',  value:`$${revenue.toLocaleString()}`,     delta:'+24.6%', up:true, sub:'vs. previous 30d' },
    { label:'Total Orders',        value:String(totalOrders),                delta:'+18.2%', up:true, sub:`${pending} pending pickup` },
    { label:'Avg order',           value:`$${avgOrder.toFixed(2)}`,          delta:'+5.4%',  up:true, sub:'Bundle attach: 41%' },
    { label:'Products on shelf',   value:String(state.products.length),      delta:'',       up:true, sub:`${state.products.filter(p=>p.inStock).length} in stock` },
  ];
  const recent = [...state.orders].sort((a,b)=>b.id.localeCompare(a.id)).slice(0,6);
  const TOP_IDS = ['p01','p02','p04','p17','p08'];
  const topProducts = TOP_IDS.map(id=>state.products.find(p=>p.id===id)).filter(Boolean) as Product[];

  return (
    <>
      <AdminHeader title="Good morning, Dajaa." subtitle="Here's what's happening at the studio today."/>
      <div className="admin-kpi-grid" style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginTop:28 }}>
        {kpis.map(k=><KpiCard key={k.label} {...k}/>)}
      </div>
      <div className="admin-chart-grid" style={{ display:'grid',gridTemplateColumns:'1.4fr 1fr',gap:16,marginTop:16 }}>
        <Card>
          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'start',flexWrap:'wrap',gap:12 }}>
            <div>
              <div className="eyebrow eyebrow--gold">Revenue · last 14 days</div>
              <h3 style={{ marginTop:8,fontSize:28 }}>$5,720</h3>
              <div style={{ color:'var(--gold-deep)',fontSize:13,marginTop:4 }}>↑ 24.6% vs prior 14d</div>
            </div>
            <div style={{ display:'flex',gap:6,flexWrap:'wrap' }}>
              {['7d','14d','30d','90d'].map((r,i)=>(
                <button key={r} style={{ fontSize:11,padding:'6px 10px',letterSpacing:'0.14em',textTransform:'uppercase',border:i===1?'1px solid var(--ink)':'1px solid var(--line)',background:i===1?'var(--ink)':'var(--cream)',color:i===1?'var(--cream)':'var(--ink)' }}>{r}</button>
              ))}
            </div>
          </div>
          <Sparkline/>
        </Card>
        <Card>
          <div className="eyebrow eyebrow--gold">Bundle attach · 30d</div>
          <h3 style={{ marginTop:8,fontSize:28 }}>41%</h3>
          <div style={{ marginTop:14 }}>
            <BundleBar label="Designer 5 · $125" pct={31} count={24}/>
            <BundleBar label="Niche 2 · $190" pct={10} count={8} gold/>
            <BundleBar label="Single bottles" pct={59} count={44} muted/>
          </div>
        </Card>
      </div>
      <div className="admin-chart-grid" style={{ display:'grid',gridTemplateColumns:'1.4fr 1fr',gap:16,marginTop:16 }}>
        <Card>
          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:12 }}>
            <div>
              <div className="eyebrow eyebrow--gold">Recent Orders</div>
              <h3 style={{ marginTop:6,fontSize:22 }}>{recent.length} most recent</h3>
            </div>
          </div>
          <div className="admin-table-wrap">
            <table style={{ width:'100%',borderCollapse:'collapse',marginTop:20,fontSize:13,minWidth:480 }}>
              <thead>
                <tr style={{ textAlign:'left',color:'var(--mute)',fontSize:10,letterSpacing:'0.18em',textTransform:'uppercase' }}>
                  <th style={{ padding:'10px 0' }}>Order</th><th>Customer</th><th>Total</th><th>Status</th><th>When</th>
                </tr>
              </thead>
              <tbody>
                {recent.map(o=>(
                  <tr key={o.id} style={{ borderTop:'1px solid var(--line-soft)' }}>
                    <td style={{ padding:'12px 0' }}>
                      <div style={{ fontFamily:'var(--serif)',fontSize:15 }}>{o.id}</div>
                      {o.bundle&&<div style={{ fontSize:10,color:'var(--gold-deep)',letterSpacing:'0.14em',textTransform:'uppercase' }}>✦ {o.bundle}</div>}
                    </td>
                    <td><div style={{ whiteSpace:'nowrap' }}>{o.customer}</div></td>
                    <td style={{ fontFamily:'var(--serif)',fontSize:15 }}>${o.total}</td>
                    <td><StatusPill status={o.status}/></td>
                    <td style={{ color:'var(--mute)',whiteSpace:'nowrap' }}>{o.when}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <Card>
          <div className="eyebrow eyebrow--gold">Top Sellers · 30d</div>
          <h3 style={{ marginTop:6,fontSize:22 }}>Move the shelf</h3>
          <div style={{ marginTop:18,display:'flex',flexDirection:'column',gap:12 }}>
            {topProducts.map((p,i)=>(
              <div key={p.id} style={{ display:'grid',gridTemplateColumns:'22px 44px 1fr auto',gap:10,alignItems:'center' }}>
                <span style={{ fontFamily:'var(--serif)',fontStyle:'italic',color:'var(--gold-deep)',fontSize:16 }}>0{i+1}</span>
                <div style={{ position:'relative',width:44,height:54,overflow:'hidden',flexShrink:0,background:p.tier==='niche'?'#0e0e0e':'var(--cream-2)' }}>
                  <ProductImage src={p.mainImage} alt={p.name} fill sizes="44px" dark={p.tier==='niche'} />
                </div>
                <div style={{ minWidth:0 }}>
                  <div style={{ fontFamily:'var(--serif)',fontSize:15,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }}>{p.name}</div>
                  <div style={{ fontSize:11,color:'var(--mute)' }}>{p.brand}</div>
                </div>
                <div style={{ fontFamily:'var(--serif)',fontSize:16 }}>${p.price}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ORDERS
═══════════════════════════════════════════════════════════════ */
function OrdersPanel({ state, dispatch, toast, setConfirm }:PanelProps) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const filtered = state.orders.filter(o=>{
    if (filter!=='all' && o.status!==filter) return false;
    if (search && !o.customer.toLowerCase().includes(search.toLowerCase()) && !o.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  const nextStatus: Record<OrderStatus,OrderStatus|null> = { pending:'ready', ready:'completed', completed:null, cancelled:null };
  const nextLabel: Record<OrderStatus,string|null> = { pending:'Mark Ready', ready:'Mark Done', completed:null, cancelled:null };

  return (
    <>
      <AdminHeader title="Orders" subtitle="Manage pending, ready, and completed pickups."
        right={<button className="btn btn--primary btn--sm" onClick={()=>toast('CSV export coming soon','info')}>Export CSV</button>}/>
      {/* Search */}
      <div style={{ marginTop:20 }}>
        <input className="field field--boxed" placeholder="Search by customer name or order ID…"
          value={search} onChange={e=>setSearch(e.target.value)}
          style={{ maxWidth:360,fontSize:14 }}/>
      </div>
      <div className="admin-filter-row" style={{ display:'flex',gap:8,marginTop:16,flexWrap:'wrap' }}>
        {[['all',`All · ${state.orders.length}`],['pending','Pending'],['ready','Ready'],['completed','Completed'],['cancelled','Cancelled']].map(([k,l])=>(
          <button key={k} onClick={()=>setFilter(k)}
            style={{ padding:'10px 16px',fontSize:11,letterSpacing:'0.16em',textTransform:'uppercase',
              border:filter===k?'1px solid var(--ink)':'1px solid var(--line)',
              background:filter===k?'var(--ink)':'var(--cream)',
              color:filter===k?'var(--cream)':'var(--ink)',minHeight:44 }}>{l}</button>
        ))}
      </div>
      <Card style={{ marginTop:20,padding:0 }}>
        <div className="admin-table-wrap">
          <table style={{ width:'100%',borderCollapse:'collapse',fontSize:13,minWidth:580 }}>
            <thead><tr style={{ textAlign:'left',color:'var(--mute)',fontSize:10,letterSpacing:'0.18em',textTransform:'uppercase',background:'var(--cream-2)' }}>
              {['Order','Customer','Phone','Items','Total','Status','Action',''].map((h,i)=>(
                <th key={i} style={{ padding:i===0?'14px 20px':'14px 10px',whiteSpace:'nowrap' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.length===0&&(
                <tr><td colSpan={8} style={{ padding:'40px 20px',textAlign:'center',color:'var(--mute)' }}>No orders match.</td></tr>
              )}
              {filtered.map(o=>{
                const ns = nextStatus[o.status];
                const nl = nextLabel[o.status];
                return (
                  <tr key={o.id} style={{ borderTop:'1px solid var(--line-soft)' }}>
                    <td style={{ padding:'14px 20px' }}>
                      <div style={{ fontFamily:'var(--serif)',fontSize:16 }}>{o.id}</div>
                      {o.bundle&&<div style={{ fontSize:10,color:'var(--gold-deep)' }}>✦ {o.bundle}</div>}
                    </td>
                    <td style={{ padding:'14px 10px',whiteSpace:'nowrap' }}>
                      <div>{o.customer}</div>
                      {o.notes&&<div style={{ fontSize:10,color:'var(--mute)',maxWidth:140,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>📝 {o.notes}</div>}
                    </td>
                    <td style={{ padding:'14px 10px',whiteSpace:'nowrap',color:'var(--mute)',fontSize:12 }}>{o.phone}</td>
                    <td style={{ padding:'14px 10px' }}>{o.items}</td>
                    <td style={{ padding:'14px 10px',fontFamily:'var(--serif)',fontSize:16 }}>${o.total}</td>
                    <td style={{ padding:'14px 10px' }}><StatusPill status={o.status}/></td>
                    <td style={{ padding:'14px 10px', display: 'flex', gap: 6 }}>
                      {nl&&ns&&(
                        <button onClick={()=>{ dispatch({type:'UPDATE_ORDER',id:o.id,status:ns}); toast(`${o.id} → ${ns}`); }}
                          style={{ fontSize:11,letterSpacing:'0.12em',textTransform:'uppercase',border:'1px solid var(--ink)',padding:'6px 10px',whiteSpace:'nowrap',background:'var(--ink)',color:'var(--cream)',minHeight:36 }}>
                          {nl}
                        </button>
                      )}
                      {o.status !== 'completed' && o.status !== 'cancelled' && (
                        <button onClick={()=>{ setConfirm({ msg:`Cancel order ${o.id}?`, onConfirm:()=>{ dispatch({type:'UPDATE_ORDER',id:o.id,status:'cancelled'}); toast(`Order ${o.id} cancelled`,'info'); }}) }}
                          style={{ fontSize:11,letterSpacing:'0.12em',textTransform:'uppercase',border:'1px solid var(--line)',padding:'6px 10px',whiteSpace:'nowrap',background:'var(--cream)',color:'var(--ink)',minHeight:36 }}>
                          Cancel
                        </button>
                      )}
                    </td>
                    <td style={{ padding:'14px 20px',textAlign:'right' }}>
                      <button onClick={()=>setConfirm({ msg:`Delete order ${o.id} for ${o.customer}? This cannot be undone.`, onConfirm:()=>{ dispatch({type:'DELETE_ORDER',id:o.id}); toast(`Order ${o.id} deleted`,'info'); }})}
                        style={{ fontSize:11,color:'var(--mute)',padding:'4px',minHeight:36,minWidth:36,display:'inline-flex',alignItems:'center',justifyContent:'center' }}>
                        <Icon.Close width="12" height="12"/>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PRODUCTS
═══════════════════════════════════════════════════════════════ */
function ProductsPanel({ state, dispatch, toast, setConfirm }:PanelProps) {
  const [modal, setModal] = useState<{mode:'add'|'edit';product?:Product}|null>(null);
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('all');

  const visible = state.products.filter(p=>{
    if (tierFilter!=='all' && p.tier!==tierFilter) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.brand.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <>
      <AdminHeader title="Products" subtitle={`${state.products.length} bottles on the shelf · ${state.products.filter(p=>p.inStock).length} in stock`}
        right={
          <div style={{ display:'flex',gap:8,flexWrap:'wrap' }}>
            <button className="btn btn--ghost btn--sm" onClick={()=>toast('CSV upload coming soon','info')}>Upload CSV</button>
            <button className="btn btn--primary btn--sm" onClick={()=>setModal({mode:'add'})}><Icon.Plus/> Add Product</button>
          </div>
        }/>
      {/* Filters row */}
      <div style={{ display:'flex',gap:12,marginTop:20,flexWrap:'wrap',alignItems:'center' }}>
        <input className="field field--boxed" placeholder="Search by name or brand…"
          value={search} onChange={e=>setSearch(e.target.value)}
          style={{ maxWidth:280,fontSize:14 }}/>
        <div style={{ display:'flex',gap:6,flexWrap:'wrap' }}>
          {[['all','All'],['niche','Niche'],['womens',"Women's"],['mens',"Men's"]].map(([k,l])=>(
            <button key={k} onClick={()=>setTierFilter(k)}
              style={{ padding:'8px 14px',fontSize:11,letterSpacing:'0.14em',textTransform:'uppercase',
                border:tierFilter===k?'1px solid var(--ink)':'1px solid var(--line)',
                background:tierFilter===k?'var(--ink)':'var(--cream)',
                color:tierFilter===k?'var(--cream)':'var(--ink)',minHeight:40 }}>{l}</button>
          ))}
        </div>
      </div>
      <Card style={{ marginTop:20,padding:0 }}>
        <div className="admin-table-wrap">
          <table style={{ width:'100%',borderCollapse:'collapse',fontSize:13,minWidth:640 }}>
            <thead><tr style={{ textAlign:'left',color:'var(--mute)',fontSize:10,letterSpacing:'0.18em',textTransform:'uppercase',background:'var(--cream-2)' }}>
              {['Product','Tier','Family','Price','Stock','Status',''].map((h,i)=>(
                <th key={i} style={{ padding:i===0?'14px 20px':'14px 10px' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {visible.length===0&&(
                <tr><td colSpan={7} style={{ padding:'40px 20px',textAlign:'center',color:'var(--mute)' }}>No products match.</td></tr>
              )}
              {visible.map(p=>(
                <tr key={p.id} style={{ borderTop:'1px solid var(--line-soft)' }}>
                  <td style={{ padding:'12px 20px' }}>
                    <div style={{ display:'flex',gap:10,alignItems:'center' }}>
                      <div style={{ position:'relative',width:36,height:44,overflow:'hidden',flexShrink:0,background:p.tier==='niche'?'#0e0e0e':'var(--cream-2)' }}>
                        <ProductImage src={p.mainImage} alt={p.name} fill sizes="36px" dark={p.tier==='niche'} />
                      </div>
                      <div>
                        <div style={{ fontFamily:'var(--serif)',fontSize:15,whiteSpace:'nowrap' }}>{p.name}</div>
                        <div style={{ fontSize:11,color:'var(--mute)' }}>{p.brand}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding:'12px 10px' }}>
                    <span className={`chip ${p.tier==='niche'?'chip--solid-gold':''}`}
                      style={{ borderColor:p.tier==='niche'?'var(--gold)':'var(--line)',color:p.tier==='niche'?'var(--ink)':'var(--char)',whiteSpace:'nowrap' }}>
                      {p.tier==='niche'?'Niche':p.tier==='womens'?"Women's":"Men's"}
                    </span>
                  </td>
                  <td style={{ padding:'12px 10px' }}>{p.family}</td>
                  <td style={{ padding:'12px 10px',fontFamily:'var(--serif)',fontSize:15 }}>${p.price}</td>
                  <td style={{ padding:'12px 10px' }}>
                    <span style={{ color:p.stockCount<5?'var(--gold-deep)':'var(--char)',fontWeight:500 }}>{p.stockCount}</span>
                    {p.stockCount<5&&<span style={{ fontSize:10,color:'var(--gold-deep)',marginLeft:4 }}>· Low</span>}
                  </td>
                  <td style={{ padding:'12px 10px' }}>
                    <button onClick={()=>{ dispatch({type:'TOGGLE_STOCK',id:p.id}); toast(p.inStock?`${p.name} marked out of stock`:`${p.name} back in stock`); }}
                      style={{ display:'inline-flex',alignItems:'center',gap:5,fontSize:10,padding:'4px 8px',letterSpacing:'0.14em',textTransform:'uppercase',
                        border:'1px solid var(--line)',background:p.inStock?'rgba(58,106,58,0.1)':'rgba(168,137,63,0.1)',
                        color:p.inStock?'#3a6a3a':'var(--gold-deep)',cursor:'pointer',whiteSpace:'nowrap' }}>
                      <span style={{ width:6,height:6,borderRadius:'50%',background:p.inStock?'#3a6a3a':'var(--gold-deep)',flexShrink:0 }}/>
                      {p.inStock?'In Stock':'Out of Stock'}
                    </button>
                  </td>
                  <td style={{ padding:'12px 20px' }}>
                    <div style={{ display:'flex',gap:8,alignItems:'center' }}>
                      <button onClick={()=>setModal({mode:'edit',product:p})}
                        style={{ fontSize:11,letterSpacing:'0.14em',textTransform:'uppercase',borderBottom:'1px solid var(--ink)',paddingBottom:2 }}>Edit</button>
                      <button onClick={()=>setConfirm({ msg:`Delete "${p.name}" by ${p.brand}? It will be removed from the shelf.`, onConfirm:()=>{ dispatch({type:'DELETE_PRODUCT',id:p.id}); toast(`${p.name} removed from shelf`,'info'); }})}
                        style={{ fontSize:11,color:'var(--mute)',minHeight:32,minWidth:32,display:'inline-flex',alignItems:'center',justifyContent:'center' }}>
                        <Icon.Close width="11" height="11"/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      {modal&&(
        <ProductModal
          mode={modal.mode}
          product={modal.product}
          onClose={()=>setModal(null)}
          onSave={p=>{
            if (modal.mode==='add') { dispatch({type:'ADD_PRODUCT',product:p}); toast(`${p.name} added to shelf`); }
            else { dispatch({type:'EDIT_PRODUCT',id:p.id,updates:p}); toast(`${p.name} updated`); }
            setModal(null);
          }}
        />
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CUSTOMERS
═══════════════════════════════════════════════════════════════ */
function CustomersPanel({ state, toast }:PanelProps) {
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const visible = state.customers.filter(c=>{
    if (tierFilter!=='all' && c.tier!==tierFilter) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  const totalLTV = state.customers.reduce((s,c)=>s+c.ltv,0);

  return (
    <>
      <AdminHeader title="Customers" subtitle={`${state.customers.length} total · $${totalLTV.toLocaleString()} LTV`}
        right={<button className="btn btn--primary btn--sm" onClick={()=>toast('CSV export coming soon','info')}>Export CSV</button>}/>
      <div style={{ display:'flex',gap:12,marginTop:20,flexWrap:'wrap',alignItems:'center' }}>
        <input className="field field--boxed" placeholder="Search by name or email…"
          value={search} onChange={e=>setSearch(e.target.value)} style={{ maxWidth:300,fontSize:14 }}/>
        <div style={{ display:'flex',gap:6,flexWrap:'wrap' }}>
          {[['all','All'],['VIP','VIP'],['Repeat','Repeat'],['First-time','First-time']].map(([k,l])=>(
            <button key={k} onClick={()=>setTierFilter(k)}
              style={{ padding:'8px 14px',fontSize:11,letterSpacing:'0.14em',textTransform:'uppercase',
                border:tierFilter===k?'1px solid var(--ink)':'1px solid var(--line)',
                background:tierFilter===k?'var(--ink)':'var(--cream)',
                color:tierFilter===k?'var(--cream)':'var(--ink)',minHeight:40 }}>{l}</button>
          ))}
        </div>
      </div>
      <Card style={{ marginTop:20,padding:0 }}>
        <div className="admin-table-wrap">
          <table style={{ width:'100%',borderCollapse:'collapse',fontSize:13,minWidth:520 }}>
            <thead><tr style={{ textAlign:'left',color:'var(--mute)',fontSize:10,letterSpacing:'0.18em',textTransform:'uppercase',background:'var(--cream-2)' }}>
              {['Customer','Orders','LTV','Tier','Last seen',''].map((h,i)=>(
                <th key={i} style={{ padding:i===0?'14px 20px':'14px 12px' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {visible.length===0&&(
                <tr><td colSpan={6} style={{ padding:'40px 20px',textAlign:'center',color:'var(--mute)' }}>No customers match.</td></tr>
              )}
              {visible.map(c=>(
                <tr key={c.id} style={{ borderTop:'1px solid var(--line-soft)' }}>
                  <td style={{ padding:'14px 20px' }}>
                    <div style={{ fontFamily:'var(--serif)',fontSize:16 }}>{c.name}</div>
                    <div style={{ fontSize:11,color:'var(--mute)' }}>{c.email}</div>
                  </td>
                  <td style={{ padding:'14px 12px' }}>{c.orders}</td>
                  <td style={{ padding:'14px 12px',fontFamily:'var(--serif)',fontSize:15 }}>${c.ltv}</td>
                  <td style={{ padding:'14px 12px' }}>
                    <span className={`chip ${c.tier==='VIP'?'chip--solid-gold':''}`} style={{ borderColor:c.tier==='VIP'?'var(--gold)':'var(--line)' }}>{c.tier}</span>
                  </td>
                  <td style={{ padding:'14px 12px',color:'var(--mute)',whiteSpace:'nowrap' }}>{c.last}</td>
                  <td style={{ padding:'14px 20px',textAlign:'right' }}>
                    <button onClick={()=>toast(`Text ${c.name}: ${c.phone}`,'info')}
                      style={{ fontSize:11,letterSpacing:'0.14em',textTransform:'uppercase',borderBottom:'1px solid var(--line)',paddingBottom:2,color:'var(--mute)' }}>
                      Contact
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MARKETING
═══════════════════════════════════════════════════════════════ */
function MarketingPanel({ state, dispatch, toast }:PanelProps) {
  const [designerPrice, setDesignerPrice] = useState(String(state.designerBundlePrice));
  const [nichePrice, setNichePrice] = useState(String(state.nicheBundlePrice));
  const [announcement, setAnnouncement] = useState(state.settings.announcement);

  const saveBundles = () => {
    dispatch({ type:'PATCH_BUNDLE', updates:{ designerBundlePrice:Number(designerPrice)||125, nicheBundlePrice:Number(nichePrice)||190 } });
    toast('Bundle pricing saved');
  };
  const saveAnnouncement = () => {
    dispatch({ type:'UPDATE_SETTINGS', updates:{ announcement } });
    toast('Announcement bar updated');
  };

  return (
    <>
      <AdminHeader title="Marketing" subtitle="Bundles, announcement bar, and promotions."/>
      <div className="admin-marketing-grid" style={{ display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:16,marginTop:24 }}>
        {/* Designer bundle */}
        <Card>
          <div className="eyebrow eyebrow--gold">Designer Bundle</div>
          <h3 style={{ marginTop:6,fontSize:24 }}>5 designer for ${state.designerBundlePrice}</h3>
          <div style={{ marginTop:18,display:'flex',flexDirection:'column',gap:14 }}>
            <Toggle label="Active" on={state.designerBundleActive} onChange={v=>{ dispatch({type:'PATCH_BUNDLE',updates:{designerBundleActive:v}}); toast(v?'Designer bundle ON':'Designer bundle OFF'); }}/>
            <Toggle label="Show on homepage" on={state.showBundleOnHomepage} onChange={v=>{ dispatch({type:'PATCH_BUNDLE',updates:{showBundleOnHomepage:v}}); toast('Homepage visibility updated'); }}/>
            <Toggle label="Auto-apply in cart" on={state.autoApplyBundle} onChange={v=>{ dispatch({type:'PATCH_BUNDLE',updates:{autoApplyBundle:v}}); toast('Auto-apply updated'); }}/>
            <Toggle label="Allow stacking" on={state.allowStacking} onChange={v=>{ dispatch({type:'PATCH_BUNDLE',updates:{allowStacking:v}}); toast('Stacking updated'); }}/>
            <div style={{ marginTop:8 }}>
              <label className="label">Bundle price ($)</label>
              <div style={{ display:'flex',gap:8,alignItems:'center' }}>
                <input type="number" className="field field--boxed" value={designerPrice} onChange={e=>setDesignerPrice(e.target.value)} style={{ maxWidth:100,fontSize:14 }}/>
                <button className="btn btn--primary btn--sm" onClick={saveBundles}>Save</button>
              </div>
            </div>
          </div>
        </Card>
        {/* Niche bundle */}
        <Card style={{ background:'var(--ink)',color:'var(--cream)' }}>
          <div className="eyebrow" style={{ color:'var(--gold)' }}>Niche Bundle</div>
          <h3 style={{ marginTop:6,fontSize:24,color:'var(--cream)' }}>2 niche for ${state.nicheBundlePrice}</h3>
          <div style={{ marginTop:18,display:'flex',flexDirection:'column',gap:14 }}>
            <Toggle label="Active" on={state.nicheBundleActive} onChange={v=>{ dispatch({type:'PATCH_BUNDLE',updates:{nicheBundleActive:v}}); toast(v?'Niche bundle ON':'Niche bundle OFF'); }} dark/>
            <Toggle label="Show on homepage" on={state.showBundleOnHomepage} onChange={v=>{ dispatch({type:'PATCH_BUNDLE',updates:{showBundleOnHomepage:v}}); toast('Updated'); }} dark/>
            <Toggle label="Auto-apply" on={state.autoApplyBundle} onChange={v=>{ dispatch({type:'PATCH_BUNDLE',updates:{autoApplyBundle:v}}); toast('Updated'); }} dark/>
            <Toggle label="Allow stacking" on={state.allowStacking} onChange={v=>{ dispatch({type:'PATCH_BUNDLE',updates:{allowStacking:v}}); toast('Updated'); }} dark/>
            <div style={{ marginTop:8 }}>
              <label className="label" style={{ color:'rgba(250,246,236,0.7)' }}>Bundle price ($)</label>
              <div style={{ display:'flex',gap:8,alignItems:'center' }}>
                <input type="number" className="field field--boxed" value={nichePrice} onChange={e=>setNichePrice(e.target.value)}
                  style={{ maxWidth:100,fontSize:14,background:'rgba(250,246,236,0.1)',color:'var(--cream)',borderColor:'rgba(201,169,97,0.4)' }}/>
                <button className="btn btn--gold btn--sm" onClick={saveBundles}>Save</button>
              </div>
            </div>
          </div>
        </Card>
      </div>
      {/* Announcement bar */}
      <Card style={{ marginTop:16 }}>
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:12 }}>
          <div>
            <div className="eyebrow eyebrow--gold">Announcement Bar</div>
            <h3 style={{ marginTop:6,fontSize:22 }}>Top of every page</h3>
          </div>
          <Toggle label="Bar active" on={state.settings.announcementActive}
            onChange={v=>{ dispatch({type:'UPDATE_SETTINGS',updates:{announcementActive:v}}); toast(v?'Announcement bar ON':'Announcement bar OFF'); }}/>
        </div>
        <div style={{ marginTop:16,display:'flex',gap:10,alignItems:'flex-start',flexWrap:'wrap' }}>
          <input className="field field--boxed" value={announcement} onChange={e=>setAnnouncement(e.target.value)}
            style={{ flex:1,minWidth:240,fontSize:14 }}/>
          <button className="btn btn--primary btn--sm" style={{ flexShrink:0 }} onClick={saveAnnouncement}>Save</button>
        </div>
        <p style={{ marginTop:10,fontSize:12,color:'var(--mute)' }}>Current: &ldquo;{state.settings.announcement}&rdquo;</p>
      </Card>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SETTINGS
═══════════════════════════════════════════════════════════════ */
function SettingsPanel({ state, dispatch, toast }:PanelProps) {
  const s = state.settings;
  const [phone, setPhone] = useState(s.phone);
  const [email, setEmail] = useState(s.email);
  const [instagram, setInstagram] = useState(s.instagram);
  const [neighborhood, setNeighborhood] = useState(s.neighborhood);
  const [hours, setHours] = useState<StoreHour[]>(s.hours.map(h=>({...h})));
  // keep cashAppTag / paypalEmail in sync if settings change externally
  void s.cashAppTag; void s.paypalEmail;

  const saveContact = () => {
    dispatch({ type:'UPDATE_SETTINGS', updates:{ phone,email,instagram,neighborhood } });
    toast('Contact info saved');
  };
  const saveHours = () => {
    dispatch({ type:'UPDATE_SETTINGS', updates:{ hours } });
    toast('Pickup hours saved');
  };
  const updateHour = (i:number, val:string) => setHours(prev=>prev.map((h,idx)=>idx===i?{...h,hours:val}:h));

  return (
    <>
      <AdminHeader title="Settings" subtitle="Pickup hours, payment, contact info."/>
      <div className="admin-settings-grid" style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginTop:24 }}>
        {/* Pickup and Drop-In Hours */}
        <Card>
          <div className="eyebrow eyebrow--gold">Pickup and Drop-In Hours</div>
          <div style={{ marginTop:18,display:'flex',flexDirection:'column',gap:4 }}>
            {hours.map((h,i)=>(
              <div key={h.day} style={{ display:'flex',alignItems:'center',gap:8,borderBottom:'1px solid var(--line-soft)',padding:'6px 0' }}>
                <span style={{ width:40,color:'var(--mute)',fontSize:13,flexShrink:0 }}>{h.day}</span>
                <input className="field" value={h.hours} onChange={e=>updateHour(i,e.target.value)}
                  style={{ flex:1,fontSize:13,padding:'4px 0' }}/>
              </div>
            ))}
          </div>
          <button className="btn btn--primary btn--sm" style={{ marginTop:16,width:'100%' }} onClick={saveHours}>Save Hours</button>
        </Card>
        {/* Contact */}
        <Card>
          <div className="eyebrow eyebrow--gold">Contact Info</div>
          <div style={{ marginTop:18,display:'flex',flexDirection:'column',gap:14 }}>
            <SField label="Public phone" value={phone} onChange={setPhone}/>
            <SField label="Email" value={email} onChange={setEmail}/>
            <SField label="Instagram" value={instagram} onChange={setInstagram}/>
            <SField label="Neighborhood" value={neighborhood} onChange={setNeighborhood}/>
          </div>
          <button className="btn btn--primary btn--sm" style={{ marginTop:16,width:'100%' }} onClick={saveContact}>Save Contact</button>
        </Card>
        {/* Payment */}
        <Card style={{ gridColumn:'1 / -1' }}>
          <div className="eyebrow eyebrow--gold">Payment Methods</div>
          <div style={{ marginTop:18,display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:20 }}>
            {/* Standard toggles */}
            <div style={{ display:'flex',flexDirection:'column',gap:12 }}>
              <Toggle label="Zelle" on={s.paymentZelle} onChange={v=>{ dispatch({type:'UPDATE_SETTINGS',updates:{paymentZelle:v}}); toast('Payment updated'); }}/>
              <Toggle label="Cash (pickup)" on={s.paymentCash} onChange={v=>{ dispatch({type:'UPDATE_SETTINGS',updates:{paymentCash:v}}); toast('Payment updated'); }}/>
              <Toggle label="Apple Pay" on={s.paymentApple} onChange={v=>{ dispatch({type:'UPDATE_SETTINGS',updates:{paymentApple:v}}); toast('Payment updated'); }}/>
              <Toggle label="Card in-person" on={s.paymentCard} onChange={v=>{ dispatch({type:'UPDATE_SETTINGS',updates:{paymentCard:v}}); toast('Payment updated'); }}/>
            </div>
            {/* Cash App */}
            <div style={{ padding:'16px',border:'1px solid var(--line)',background:'var(--cream-2)' }}>
              <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12 }}>
                <span style={{ fontWeight:500,fontSize:14 }}>💚 Cash App</span>
                <Toggle label="" on={s.paymentCashApp} onChange={v=>{ dispatch({type:'UPDATE_SETTINGS',updates:{paymentCashApp:v}}); toast('Cash App '+(v?'enabled':'disabled')); }}/>
              </div>
              <CashAppPayPalField label="$Cashtag" value={s.cashAppTag} onSave={v=>{ dispatch({type:'UPDATE_SETTINGS',updates:{cashAppTag:v}}); toast('Cashtag saved'); }}/>
            </div>
            {/* PayPal */}
            <div style={{ padding:'16px',border:'1px solid var(--line)',background:'var(--cream-2)' }}>
              <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12 }}>
                <span style={{ fontWeight:500,fontSize:14 }}>🔵 PayPal</span>
                <Toggle label="" on={s.paymentPaypal} onChange={v=>{ dispatch({type:'UPDATE_SETTINGS',updates:{paymentPaypal:v}}); toast('PayPal '+(v?'enabled':'disabled')); }}/>
              </div>
              <CashAppPayPalField label="PayPal email" value={s.paypalEmail} onSave={v=>{ dispatch({type:'UPDATE_SETTINGS',updates:{paypalEmail:v}}); toast('PayPal email saved'); }}/>
            </div>
          </div>
        </Card>
        {/* Gift Options */}
        <Card style={{ gridColumn:'1 / -1' }}>
          <div className="eyebrow eyebrow--gold">Gift Options</div>
          <div style={{ marginTop:18 }}>
            <CashAppPayPalField label="Gift Service Charge ($)" value={s.gift_charge?.toString() || '10'} onSave={v=>{ 
              dispatch({type:'UPDATE_SETTINGS',updates:{gift_charge: Number(v)}}); 
              toast('Gift charge saved'); 
            }}/>
          </div>
        </Card>
      </div>
    </>
  );
}
function CashAppPayPalField({ label,value,onSave }:{ label:string;value:string;onSave:(v:string)=>void }) {
  const [v,setV] = useState(value);
  return (
    <div>
      <label className="label" style={{ marginBottom:4 }}>{label}</label>
      <div style={{ display:'flex',gap:8 }}>
        <input className="field field--boxed" value={v} onChange={e=>setV(e.target.value)}
          style={{ flex:1,fontSize:13,padding:'8px 10px' }} placeholder={label}/>
        <button className="btn btn--primary btn--sm" onClick={()=>onSave(v)}>Save</button>
      </div>
    </div>
  );
}
function SField({ label,value,onChange }:{ label:string;value:string;onChange:(v:string)=>void }) {
  return (
    <div>
      <label className="label">{label}</label>
      <input className="field field--boxed" value={value} onChange={e=>onChange(e.target.value)} style={{ fontSize:14 }}/>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SHARED PRIMITIVES
═══════════════════════════════════════════════════════════════ */
function AdminHeader({ title, subtitle, right }:{ title:string; subtitle:string; right?:React.ReactNode }) {
  return (
    <div style={{ display:'flex',justifyContent:'space-between',alignItems:'end',flexWrap:'wrap',gap:14 }}>
      <div>
        <h1 className="admin-header-h1" style={{ fontSize:'clamp(28px,4vw,48px)',lineHeight:1 }}>{title}</h1>
        <div style={{ color:'var(--mute)',marginTop:8,fontSize:14 }}>{subtitle}</div>
      </div>
      {right&&<div>{right}</div>}
    </div>
  );
}
function Card({ children, style }:{ children:React.ReactNode; style?:React.CSSProperties }) {
  return <div style={{ background:'var(--cream)',padding:24,border:'1px solid var(--line)',...style }}>{children}</div>;
}
function KpiCard({ label,value,delta,up,sub }:{ label:string;value:string;delta:string;up:boolean;sub:string }) {
  return (
    <Card>
      <div className="eyebrow" style={{ fontSize:9 }}>{label}</div>
      <div style={{ fontFamily:'var(--serif)',fontSize:'clamp(28px,3vw,40px)',fontWeight:500,lineHeight:1,marginTop:8 }}>{value}</div>
      {delta&&<div style={{ marginTop:8,fontSize:12,color:up?'var(--gold-deep)':'#a04444' }}>{up?'↑':'↓'} {delta}</div>}
      <div style={{ fontSize:11,color:'var(--mute)',marginTop:4 }}>{sub}</div>
    </Card>
  );
}
function StatusPill({ status }:{ status:string }) {
  const map:Record<string,{c:string;b:string;l:string}> = {
    pending:   { c:'var(--gold-deep)', b:'rgba(168,137,63,0.12)', l:'Pending' },
    ready:     { c:'var(--ink)',       b:'var(--gold)',            l:'Ready' },
    completed: { c:'#3a6a3a',          b:'rgba(58,106,58,0.12)',   l:'Done' },
    cancelled: { c:'#8B2020',          b:'rgba(139,32,32,0.1)',    l:'Cancelled' },
  };
  const s = map[status] ?? map.pending;
  return (
    <span style={{ display:'inline-flex',alignItems:'center',gap:5,padding:'4px 8px',fontSize:10,letterSpacing:'0.14em',textTransform:'uppercase',color:s.c,background:s.b,fontWeight:500,whiteSpace:'nowrap' }}>
      <span style={{ width:5,height:5,borderRadius:'50%',background:s.c }}/>{s.l}
    </span>
  );
}
function BundleBar({ label,pct,count,gold,muted }:{ label:string;pct:number;count:number;gold?:boolean;muted?:boolean }) {
  return (
    <div style={{ marginTop:10 }}>
      <div style={{ display:'flex',justifyContent:'space-between',fontSize:12,marginBottom:5 }}>
        <span>{label}</span><span style={{ color:'var(--mute)' }}>{count} · {pct}%</span>
      </div>
      <div style={{ height:5,background:'var(--line-soft)',position:'relative' }}>
        <div style={{ position:'absolute',inset:0,width:`${pct}%`,background:muted?'var(--char)':gold?'var(--gold)':'var(--ink)' }}/>
      </div>
    </div>
  );
}
function Toggle({ label,on,onChange,dark }:{ label:string;on?:boolean;onChange?:(v:boolean)=>void;dark?:boolean }) {
  const [v,setV] = useState(!!on);
  const handle = () => { const next=!v; setV(next); onChange?.(next); };
  return (
    <label style={{ display:'flex',alignItems:'center',gap:10,cursor:'pointer',fontSize:13,color:dark?'var(--cream)':'var(--ink)',minHeight:40 }}>
      <button type="button" onClick={handle}
        style={{ width:36,height:20,borderRadius:20,background:v?'var(--gold)':(dark?'rgba(250,246,236,0.2)':'var(--line)'),position:'relative',transition:'background 200ms',flexShrink:0 }}>
        <span style={{ position:'absolute',top:2,left:v?18:2,width:16,height:16,borderRadius:'50%',background:'var(--cream)',transition:'left 200ms' }}/>
      </button>
      {label}
    </label>
  );
}
function Sparkline() {
  const max = Math.max(...REV_SERIES);
  const W=600,H=180,P=20;
  const pts = REV_SERIES.map((v,i)=>{
    const x=P+(i/(REV_SERIES.length-1))*(W-P*2);
    const y=H-P-(v/max)*(H-P*2);
    return `${x},${y}`;
  }).join(' ');
  const area=`${P},${H-P} ${pts} ${W-P},${H-P}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width:'100%',height:160,marginTop:20 }}>
      <defs>
        <linearGradient id="rev-fill" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#C9A961" stopOpacity="0.35"/><stop offset="100%" stopColor="#C9A961" stopOpacity="0"/>
        </linearGradient>
      </defs>
      {[0.25,0.5,0.75].map(t=><line key={t} x1={P} x2={W-P} y1={H-P-t*(H-P*2)} y2={H-P-t*(H-P*2)} stroke="#E8DFC8" strokeDasharray="2 4"/>)}
      <polygon points={area} fill="url(#rev-fill)"/>
      <polyline points={pts} fill="none" stroke="#1A1A1A" strokeWidth="1.5"/>
      {REV_SERIES.map((v,i)=>{
        const x=P+(i/(REV_SERIES.length-1))*(W-P*2);
        const y=H-P-(v/max)*(H-P*2);
        return <circle key={i} cx={x} cy={y} r={i===REV_SERIES.length-1?4:2} fill={i===REV_SERIES.length-1?'#C9A961':'#1A1A1A'}/>;
      })}
    </svg>
  );
}
