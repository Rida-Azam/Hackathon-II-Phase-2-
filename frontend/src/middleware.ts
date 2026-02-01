import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  console.log(`[Middleware] Checking: ${pathname} | Auth: ${!!token}`);

  // 1. PUBLIC ROUTES (Always allow, NO redirect for logged-in users)
  // This allows debugging login/signup even if already "signed in"
  const isPublicRoute = pathname === '/' || pathname === '/login' || pathname === '/signup';
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // 2. PROTECTED ROUTES (Redirect ONLY if missing token)
  if (!token && pathname.startsWith('/todos')) {
    console.log(`[Middleware] Unauthorized! Redirecting ${pathname} -> /login`);
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Catch everything except static assets and API
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
