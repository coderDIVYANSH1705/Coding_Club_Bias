import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.has('admin_auth');
  const isLoginPage = request.nextUrl.pathname.startsWith('/admin/login');

  // If they are NOT logged in, and they are NOT on the login page...
  if (!isAuthenticated && !isLoginPage) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // If they ARE logged in, but they try to go to the login page...
  if (isAuthenticated && isLoginPage) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

// BULLETPROOF MATCHER
export const config = {
  // Explicitly match exactly /admin AND everything inside it
  matcher: ['/admin', '/admin/:path*'],
};