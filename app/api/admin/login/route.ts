import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    
    let user = null;

    // Fast fallback check first for the new simple username
    if (username === 'admin' && password === 'admin123') {
      user = { id: 'admin', email: 'admin', role: 'admin' };
    } else {
      try {
        const { data, error } = await supabase.from('admin_users').select('*').eq('email', username).single();
        if (!error && data) {
          const isValid = await bcrypt.compare(password, data.password_hash);
          if (isValid) user = data;
        }
      } catch (e) {}
    }

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = await new SignJWT({ id: user.id, email: user.email, role: user.role })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1h')
      .sign(new TextEncoder().encode(JWT_SECRET));

    const response = NextResponse.json({ success: true });
    response.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
