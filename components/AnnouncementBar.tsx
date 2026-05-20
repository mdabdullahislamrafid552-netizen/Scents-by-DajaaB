export default function AnnouncementBar() {
  const messages = [
    "BUNDLE · 5 FOR $125 · ANY DESIGNER FRAGRANCES",
    "BUNDLE · 2 FOR $190 · ANY NICHE FRAGRANCES",
    "PICKUP ONLY · MEMPHIS, TN · 901·921·2322",
    "ALL PREMIUM SCENTS · AUTHENTIC · HAND·SELECTED BY DAJAA",
  ];
  const loop = [...messages, ...messages];
  return (
    <div style={{ background: 'var(--ink)', color: 'var(--cream)', padding: '10px 0', overflow: 'hidden', borderBottom: '1px solid #2a2924' }}>
      <div className="marquee" style={{ fontSize: 10, letterSpacing: '0.32em', fontWeight: 500 }}>
        {loop.map((m, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 64 }}>
            <span style={{ color: i % 4 === 0 || i % 4 === 1 ? 'var(--gold)' : 'var(--cream)' }}>{m}</span>
            <span style={{ color: 'var(--gold)' }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
