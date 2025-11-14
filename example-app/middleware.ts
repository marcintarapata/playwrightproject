/**
 * Next.js Middleware
 *
 * Handles route protection and redirects based on authentication state.
 * - Protects /dashboard and /todos routes (requires authentication)
 * - Redirects authenticated users away from /login and /register
 *
 * Note: Uses cookie-based check for Edge runtime compatibility.
 * Full session validation happens in the pages themselves.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication
const protectedRoutes = ["/dashboard", "/todos"];

// Routes that should redirect if already authenticated
const authRoutes = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check for session cookie (Better Auth uses 'better-auth.session_token')
  const sessionToken = request.cookies.get('better-auth.session_token');
  const isAuthenticated = !!sessionToken;

  // Check if route requires authentication
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if it's an auth route (login/register)
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Redirect to login if trying to access protected route without auth
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to dashboard if already authenticated and trying to access auth pages
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (except /api/auth)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api/(?!auth)|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
