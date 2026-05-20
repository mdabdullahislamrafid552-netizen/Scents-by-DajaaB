export default function PrivacyPage() {
  return (
    <div className="container--narrow section fade-in">
      <div className="kicker-mark">Legal</div>
      <h1 style={{ marginTop: 20 }}>Privacy & <span className="italic">Terms.</span></h1>
      <div style={{ marginTop: 32, fontSize: 15, lineHeight: 1.8, color: 'var(--char)', maxWidth: 720 }}>
        <h3 style={{ marginTop: 32, fontSize: 24 }}>Privacy</h3>
        <p>We collect only what we need to confirm your pickup: name, phone, email, and order details. Phone and email are used to confirm pickup windows and send a receipt. We don't sell or share customer data with third parties. Newsletter is opt-in and unsubscribe-anytime.</p>
        <h3 style={{ marginTop: 32, fontSize: 24 }}>Terms</h3>
        <p>All bottles are sold for pickup at the Memphis studio. Reservations hold inventory for 14 days. Authenticity is guaranteed — every bottle is sourced through authorized distributors and inspected before handoff. If something looks wrong at pickup, we swap or refund on the spot.</p>
        <p style={{ marginTop: 16 }}>Bundle pricing applies automatically when threshold met (5 designer = $125 · 2 niche = $190). Pricing applies in-cart only; bundles cannot be retroactively applied to completed orders.</p>
        <h3 style={{ marginTop: 32, fontSize: 24 }}>Contact</h3>
        <p>Questions? Text Dajaa at <strong>901·921·2322</strong> or email <strong>hello@scentsbydajaab.com</strong>.</p>
      </div>
    </div>
  );
}
