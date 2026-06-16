import { Icon } from '@/components/Icons';

export const metadata = {
  title: 'Contact - Scents by DajaaB',
};

export default function ContactPage() {
  return (
    <div className="fade-in">
      <section style={{ padding: '80px 0 120px' }}>
        <div className="container--narrow" style={{ maxWidth: 700 }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="eyebrow eyebrow--gold">Get in touch</div>
            <h1 style={{ marginTop: 16, fontSize: 'clamp(40px, 6vw, 80px)' }}>We'd love to <span className="italic">hear from you.</span></h1>
            <p style={{ color: 'var(--char)', marginTop: 24, fontSize: 16, lineHeight: 1.6, maxWidth: 480, margin: '24px auto 0' }}>
              Whether you have a question about a specific fragrance, need help with your pickup reservation, or just want to say hello.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 48 }}>
            
            {/* Contact Details */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24, textAlign: 'center' }}>
              <div style={{ padding: '32px 24px', background: 'var(--cream-2)', border: '1px solid var(--line)' }}>
                <Icon.Phone style={{ color: 'var(--gold)', margin: '0 auto', width: 24, height: 24 }} />
                <h3 style={{ marginTop: 16, fontFamily: 'var(--serif)', fontSize: 20 }}>Text Dajaa</h3>
                <p style={{ color: 'var(--char)', marginTop: 8, fontSize: 14 }}>901·921·2322</p>
              </div>
              <div style={{ padding: '32px 24px', background: 'var(--cream-2)', border: '1px solid var(--line)' }}>
                <Icon.Arrow style={{ color: 'var(--gold)', margin: '0 auto', width: 24, height: 24 }} />
                <h3 style={{ marginTop: 16, fontFamily: 'var(--serif)', fontSize: 20 }}>Email Us</h3>
                <p style={{ color: 'var(--char)', marginTop: 8, fontSize: 14 }}>Dajabell000@icloud.com</p>
              </div>
            </div>

            {/* Formspree Form */}
            <div style={{ background: 'var(--cream)', border: '1px solid var(--line)', padding: '48px 40px' }}>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: 28, marginBottom: 8 }}>Send a message</h2>
              <p style={{ color: 'var(--char)', fontSize: 14, marginBottom: 32 }}>We try to respond to all inquiries within 24 hours.</p>
              
              {/* Note: Update the action URL with your actual Formspree form ID once created. */}
              {/* You can create a form at formspree.io and point it to Dajabell000@icloud.com */}
              <form action="https://formspree.io/f/YOUR_FORMSPREE_ID" method="POST" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                  <label style={{ display: 'block' }}>
                    <span className="label">Your Name <span style={{ color: 'var(--gold-deep)' }}>*</span></span>
                    <input type="text" name="name" required placeholder="Dajaa Bowen" className="field" style={{ fontSize: 16, padding: '12px 0', width: '100%' }} />
                  </label>
                  <label style={{ display: 'block' }}>
                    <span className="label">Email Address <span style={{ color: 'var(--gold-deep)' }}>*</span></span>
                    <input type="email" name="_replyto" required placeholder="you@example.com" className="field" style={{ fontSize: 16, padding: '12px 0', width: '100%' }} />
                  </label>
                </div>

                <label style={{ display: 'block' }}>
                  <span className="label">Subject</span>
                  <input type="text" name="subject" placeholder="Order Inquiry" className="field" style={{ fontSize: 16, padding: '12px 0', width: '100%' }} />
                </label>

                <label style={{ display: 'block' }}>
                  <span className="label">Message <span style={{ color: 'var(--gold-deep)' }}>*</span></span>
                  <textarea name="message" required placeholder="How can we help you?" rows={5} className="field field--boxed" style={{ fontSize: 16, width: '100%', resize: 'vertical' }} />
                </label>

                {/* Anti-spam honeypot field (hidden) */}
                <input type="text" name="_gotcha" style={{ display: 'none' }} />

                <button type="submit" className="btn btn--primary btn--lg" style={{ marginTop: 8, width: '100%' }}>
                  Send Message
                </button>
              </form>
            </div>
            
          </div>
        </div>
      </section>
    </div>
  );
}
