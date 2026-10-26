import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE } from "./constants/admin";
import { SESSION_COOKIE } from "./constants/auth";

const PROTECTED_PREFIXES = ["/dashboard", "/payments"];
const ADMIN_PROTECTED_PREFIXES = ["/admin/users", "/admin/payments"];

const matchesPrefix = (pathname: string, prefixes: string[]): boolean =>
  prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

export const proxy = (request: NextRequest): NextResponse => {
  const { pathname } = request.nextUrl;

  const isAuthenticated = Boolean(request.cookies.get(SESSION_COOKIE)?.value);

  const isAdminAuthenticated = Boolean(
    request.cookies.get(ADMIN_SESSION_COOKIE)?.value,
  );

  if (
    matchesPrefix(pathname, ADMIN_PROTECTED_PREFIXES) &&
    !isAdminAuthenticated
  ) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (pathname === "/admin" && isAdminAuthenticated) {
    return NextResponse.redirect(new URL("/admin/users", request.url));
  }

  if (matchesPrefix(pathname, PROTECTED_PREFIXES) && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname === "/login" && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/dashboard/:path*", "/payments/:path*", "/login", "/admin/:path*"],
};
