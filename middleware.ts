import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if admin_auth cookie exists
  const authCookie = request.cookies.get('admin_auth');
  const isAuthenticated = !!authCookie;
  const isLoginPage = pathname === '/admin/login';
  const isAdminPath = pathname.startsWith('/admin');

  // If accessing /admin routes but NOT authenticated and NOT on login page, redirect to login
  if (isAdminPath && !isAuthenticated && !isLoginPage) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // If already authenticated and trying to access login page, redirect to admin dashboard
  if (isLoginPage && isAuthenticated) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

// Match all /admin routes including the root /admin path
export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
