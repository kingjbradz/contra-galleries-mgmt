import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SESSION_COOKIE_NAME = 'session';

// Apply to all dashboard/admin routes
export function middleware(req: NextRequest) {
  const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;

  // If no session, redirect to login
  if (!sessionCookie) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Optionally, parse and validate JSON session
  try {
    const session = JSON.parse(sessionCookie);
    if (!session.id || !session.username) {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  } catch {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // If session exists and is valid, allow the request
  return NextResponse.next();
}

// Only run middleware on dashboard routes
export const config = {
  matcher: ['/dashboard/:path*'],
};
