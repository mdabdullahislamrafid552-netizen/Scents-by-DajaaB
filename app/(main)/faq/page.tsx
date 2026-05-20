'use client';
import { useState } from 'react';
import { Icon } from '@/components/Icons';

const groups = [
  { title: 'Ordering & Pickup', faqs: [
    ['How does pickup work?', 'Reserve here, Dajaa texts you to confirm within 2 hours, and you choose a pickup window at the Memphis studio. Pay on pickup — cash, Zelle, Apple Pay, or card.'],
    ['Where exactly is the studio?', 'Midtown Memphis. The full address is shared after your reservation is confirmed — we keep it off the public page since we operate by appointment.'],
    ['Do you ship?', 'No. Pickup only, on purpose. It keeps fragrance authentic, keeps prices low, and lets Dajaa fit each customer in person.'],
    ['What if I can\'t pick up the same week?', 'We hold reservations for two weeks. Beyond that, just text 901·921·2322 to extend — no questions asked.'],
  ]},
  { title: 'Bundles', faqs: [
    ['How do the bundles work?', 'Add 5 designer bottles to your bag and the price drops to $125 automatically. Add 2 niche bottles and it drops to $190. No code, no fuss.'],
    ['Can I mix women\'s and men\'s in the designer bundle?', "Yes — any 5 from the Women's Designer + Men's Designer tier qualify. Mix freely."],
    ['Can I stack multiple bundles?', 'Yes. Ten designer bottles = two bundles ($250). Four niche = two bundles ($380). The cart counts them automatically.'],
    ['Can I bundle a designer with a niche?', "No — the bundles only combine within their tier. A niche bottle keeps its individual price unless paired with another niche."],
  ]},
  { title: 'Authenticity', faqs: [
    ['How do I know these are real?', "Every bottle is sourced through authorized distribution and inspected at the studio. Batch codes are visible at pickup. We don't carry decants or grey-market product."],
    ['Do you sell samples?', "Not online — but if you book a private fitting, Dajaa will run you through scents on test strips and skin before you commit."],
    ['What if my bottle has an issue?', "Inspection happens on pickup, in person. If anything looks off, we swap or refund on the spot — that's the upside of pickup-only."],
  ]},
  { title: 'Account & Personal', faqs: [
    ['Do I need an account?', 'No. The only required info is name, phone, and email — enough to text you a pickup window and send a receipt.'],
    ['Will you remember what I bought?', "If you opt into the newsletter, yes — Dajaa keeps a private list of customer preferences for restock alerts and new arrivals."],
  ]},
];

export default function FAQPage() {
  return (
    <div className="fade-in">
      <section style={{ padding: '80px 0 40px' }}>
        <div className="container">
          <div className="kicker-mark">Questions, Answered</div>
          <h1 style={{ marginTop: 24 }}>How <span className="italic">this</span> works.</h1>
          <p style={{ marginTop: 20, fontSize: 17, color: 'var(--char)', maxWidth: 540, lineHeight: 1.7 }}>
            Everything you need to know about reserving, picking up, bundling, and verifying authenticity. Still stuck? Text Dajaa at <strong>901·921·2322</strong>.
          </p>
        </div>
      </section>
      <section style={{ padding: '40px 0 100px' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 64 }}>
          <aside>
            <div className="eyebrow eyebrow--ink" style={{ marginBottom: 12 }}>Topics</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {groups.map(g => (
                <li key={g.title}>
                  <a href={`#${g.title.replace(/\s+/g,'-').toLowerCase()}`}
                     style={{ fontSize: 14, paddingLeft: 16, borderLeft: '1px solid var(--gold)', display: 'block', color: 'var(--char)' }}>{g.title}</a>
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 40, padding: 20, background: 'var(--ink)', color: 'var(--cream)' }}>
              <div className="eyebrow" style={{ color: 'var(--gold)' }}>Still need help?</div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 22, fontStyle: 'italic', marginTop: 6 }}>Text Dajaa</div>
              <a href="tel:9019212322" style={{ color: 'var(--gold)', fontSize: 14, marginTop: 8, display: 'block' }}>901·921·2322</a>
            </div>
          </aside>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 60 }}>
            {groups.map(group => <FAQGroup key={group.title} group={group} />)}
          </div>
        </div>
      </section>
    </div>
  );
}

function FAQGroup({ group }: { group: typeof groups[0] }) {
  return (
    <div id={group.title.replace(/\s+/g,'-').toLowerCase()}>
      <div className="eyebrow eyebrow--gold">{group.title}</div>
      <h2 style={{ marginTop: 12, fontSize: 44 }}><span className="italic">{group.title}.</span></h2>
      <div style={{ marginTop: 24, borderTop: '1px solid var(--ink)' }}>
        {group.faqs.map(([q, a], i) => <FAQItem key={i} q={q} a={a} />)}
      </div>
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid var(--line)' }}>
      <button onClick={() => setOpen(o => !o)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 0', textAlign: 'left' }}>
        <span style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 500, paddingRight: 32 }}>{q}</span>
        <span style={{ width: 32, height: 32, border: '1px solid var(--ink)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {open ? <Icon.Minus /> : <Icon.Plus />}
        </span>
      </button>
      {open && <div style={{ padding: '0 0 28px', color: 'var(--char)', fontSize: 15, lineHeight: 1.7, maxWidth: 720 }}>{a}</div>}
    </div>
  );
}
