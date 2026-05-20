'use client';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();
  return (
    <div style={{
      minHeight: '100vh', background: 'var(--ink)', color: 'var(--cream)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', padding: '40px 24px',
    }}>
      <div className="eyebrow" style={{ color: 'var(--gold)', marginBottom: 20 }}>✦ 404 · Page Not Found</div>
      <h1 style={{
        fontFamily: 'var(--serif)', fontSize: 'clamp(64px, 14vw, 180px)',
        lineHeight: 0.88, color: 'var(--cream)', letterSpacing: '-0.03em',
      }}>
        <span style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Lost</span><br />
        the scent.
      </h1>
      <p style={{ marginTop: 28, maxWidth: 440, fontSize: 16, lineHeight: 1.65, color: 'rgba(250,246,236,0.7)' }}>
        That page doesn't exist. Head back to the shop — forty-six
        fragrances are waiting.
      </p>
      <div style={{ display: 'flex', gap: 12, marginTop: 36, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={() => router.push('/shop')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '16px 28px', background: 'var(--gold)', color: 'var(--ink)',
            border: '1px solid var(--gold)', fontSize: 12, letterSpacing: '0.22em',
            textTransform: 'uppercase', fontWeight: 500, cursor: 'pointer',
            fontFamily: 'var(--sans)', minHeight: 44,
          }}>
          Shop All 46 →
        </button>
        <button
          onClick={() => router.back()}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '16px 28px', background: 'transparent', color: 'var(--cream)',
            border: '1px solid rgba(250,246,236,0.35)', fontSize: 12, letterSpacing: '0.22em',
            textTransform: 'uppercase', fontWeight: 500, cursor: 'pointer',
            fontFamily: 'var(--sans)', minHeight: 44,
          }}>
          Go Back
        </button>
      </div>
      <div style={{ marginTop: 48, fontSize: 12, color: 'rgba(250,246,236,0.35)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
        Memphis, TN · Pickup Only · 901·921·2322
      </div>
    </div>
  );
}
