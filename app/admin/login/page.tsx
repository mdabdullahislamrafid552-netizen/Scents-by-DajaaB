'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      router.push('/admin');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--ink)' }}>
      <div style={{ width: '100%', maxWidth: 380, padding: 32, background: 'var(--cream)', borderRadius: 2 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--serif)', fontSize: 16, letterSpacing: '0.05em', lineHeight: 1, color: 'var(--ink)' }}>Scents by</span>
            <span style={{ fontFamily: 'var(--script)', color: 'var(--gold-deep)', fontSize: 24, lineHeight: 0.8 }}>DajaaB.</span>
          </div>
          <div className="eyebrow" style={{ marginTop: 12, color: 'var(--char)' }}>Studio Admin</div>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {error && (
            <div style={{ padding: 12, background: 'rgba(200,0,0,0.1)', color: '#c00', fontSize: 13, border: '1px solid rgba(200,0,0,0.2)', borderRadius: 2 }}>
              {error}
            </div>
          )}
          
          <div>
            <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6, color: 'var(--char)' }}>Username</label>
            <input 
              type="text" 
              className="field field--boxed" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              required 
            />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6, color: 'var(--char)' }}>Password</label>
            <input 
              type="password" 
              className="field field--boxed" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
          </div>
          
          <button type="submit" className="btn btn--primary" style={{ marginTop: 8 }} disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
