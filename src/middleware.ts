import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "session";

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "").split(",").map(o => o.trim());

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const origin = req.headers.get("origin") || "";

  // Handle CORS for API routes
  if (pathname.startsWith("/api")) {
    const isAllowed = allowedOrigins.includes(origin);
    const response = NextResponse.next();

    if (isAllowed) {
      response.headers.set("Access-Control-Allow-Origin", origin);
      response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
      response.headers.set("Access-Control-Allow-Headers", "Content-Type, x-environment, x-api-key");
      response.headers.set("Access-Control-Max-Age", "86400");
    }

    if (req.method === "OPTIONS") {
      return new NextResponse(null, { status: 204, headers: response.headers });
    }

    return response;
  }

  // Auth logic for non-API routes
  const session = req.cookies.get(SESSION_COOKIE);
  const isLoginRoute = pathname === "/login";

  if (!session && !isLoginRoute) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (session && isLoginRoute) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};