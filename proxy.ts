import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect /it/admin and /en/admin to /admin, reset locale cookie to de
  const nonDeAdmin = pathname.match(/^\/(it|en)(\/admin.*)$/);
  if (nonDeAdmin) {
    const url = request.nextUrl.clone();
    url.pathname = nonDeAdmin[2];
    const response = NextResponse.redirect(url);
    response.cookies.set("NEXT_LOCALE", "de", { path: "/" });
    return response;
  }

  // Run intl middleware normally, then force German locale cookie for /admin
  const response = intlMiddleware(request);
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    response.cookies.set("NEXT_LOCALE", "de", { path: "/" });
  }
  return response;
}

export const config = {
  matcher: [
    "/",
    "/(de|it|en)/:path*",
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
