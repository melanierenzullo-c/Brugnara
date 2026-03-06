import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    "/",
    "/(de|it)/:path*",
    // Alle Routen außer API, Next-Interna und statischen Dateien
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
