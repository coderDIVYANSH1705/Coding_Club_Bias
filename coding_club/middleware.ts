import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the user has the 'admin_auth' cookie we set during login
  const isAuthenticated = request.cookies.has('admin_auth');
  
  // Check if they are currently trying to access the login page
  const isLoginPage = request.nextUrl.pathname.startsWith('/admin/login');

  // If they are NOT logged in, and they are NOT on the login page...
  if (!isAuthenticated && !isLoginPage) {
    // Kick them back to the login page
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // If they ARE logged in, but they try to go to the login page...
  if (isAuthenticated && isLoginPage) {
    // Send them straight to the dashboard so they don't have to log in twice
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // Otherwise, let them proceed normally
  return NextResponse.next();
}

// This config tells Next.js to ONLY run this bouncer on /admin routes
export const config = {
  matcher: '/admin/:path*',
};