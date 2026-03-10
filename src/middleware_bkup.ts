// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token') || request.cookies.get('refreshToken');
  const { pathname } = request.nextUrl;

  // Public paths that don't require authentication
  const publicPaths = [
    '/login', 
    '/register', 
    '/', 
    '/about', 
    '/contact',
    '/payment/callback', // Add payment callback
    '/onboarding/tutor/status', // Add status page if it should be public after payment
  ];
  
  // Check if path requires auth
  const requiresAuth = !publicPaths.some(path => pathname.startsWith(path));
  
  if (requiresAuth && !token) {
    // But allow access to onboarding if they have a valid payment reference in query
    if (pathname.startsWith('/onboarding/tutor') && request.nextUrl.searchParams.has('reference')) {
      return NextResponse.next();
    }
    
    // Redirect to login if not authenticated
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};