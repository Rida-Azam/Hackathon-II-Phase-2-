import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  console.log(`[Middleware] ${pathname} | Token exists: ${!!token}`);

  // 1. Protected routes check
  const isProtectedRoute = pathname.startsWith('/todos');
  const isAuthRoute = pathname === '/login' || pathname === '/signup';

  // If trying to access /todos without a cookie, redirect to /login
  if (isProtectedRoute && !token) {
    console.log("[Middleware] No token, redirecting to /login");
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If trying to access auth pages with a valid cookie, redirect to /todos
  if (isAuthRoute && token) {
    console.log(`[Middleware] Token exists, redirecting from ${pathname} to /todos`);
    return NextResponse.redirect(new URL('/todos', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/todos/:path*', '/login', '/signup'],
};
