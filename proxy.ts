import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Protect /admin routes (except /admin/login)
  if (path === '/admin' || (path.startsWith('/admin/') && !path.startsWith('/admin/login'))) {
    const session = request.cookies.get('admin_session');
    
    // If no session cookie, redirect to login
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
