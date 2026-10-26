import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "co3_session";
const SIGNED_OUT_PAGES = ["/dashboard/login", "/dashboard/forgot-password", "/dashboard/reset-password"];

/** Optimistic gate for the dashboard. Pages and actions still verify the user against the DB. */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLogin = pathname === "/dashboard/login";
  const isPublic = SIGNED_OUT_PAGES.includes(pathname);
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  let valid = false;
  if (token && process.env.AUTH_SECRET) {
    try {
      await jwtVerify(token, new TextEncoder().encode(process.env.AUTH_SECRET));
      valid = true;
    } catch {}
  }
  if (!valid && !isPublic) {
    const url = new URL("/dashboard/login", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  if (valid && isLogin) return NextResponse.redirect(new URL("/dashboard", request.url));
  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

export const config = { matcher: ["/dashboard/:path*"] };
