import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "./constants/auth";

const PROTECTED_PREFIXES = ["/dashboard", "/payments"];

const isProtected = (pathname: string): boolean =>
  PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

export const proxy = (request: NextRequest): NextResponse => {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const isAuthenticated = Boolean(token);

  if (isProtected(pathname) && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname === "/login" && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/dashboard/:path*", "/payments/:path*", "/login"],
};
