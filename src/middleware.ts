import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "session";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = req.cookies.get(SESSION_COOKIE);

  const isLoginRoute = pathname === "/login";

  // Not logged in → block everything except /login
  if (!session && !isLoginRoute) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Logged in → prevent access to /login
  if (session && isLoginRoute) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
      Match all routes except:
      - api routes
      - static files
      - next internals
    */
    "/((?!api|_next|favicon.ico).*)",
  ],
};
