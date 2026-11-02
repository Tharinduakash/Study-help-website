import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth/constants";

// A quick redirect for signed-out visitors only. The real check is requireAdmin(),
// which validates the session in the database on every admin page and action.
export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/admin/login" || request.cookies.has(SESSION_COOKIE)) return NextResponse.next();
  return NextResponse.redirect(new URL("/admin/login", request.url));
}

export const config = { matcher: "/admin/:path*" };
