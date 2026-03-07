import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["de", "it"],
  defaultLocale: "de",
  localePrefix: "as-needed",
  pathnames: {
    "/": "/",
    "/produkte": {
      de: "/produkte",
      it: "/prodotti",
    },
    "/produkte/[slug]": {
      de: "/produkte/[slug]",
      it: "/prodotti/[slug]",
    },

    "/news": {
      de: "/news",
      it: "/novita",
    },
    "/marken": "/marken",
    "/impressum": "/impressum",
    "/login": "/login",
    "/admin": "/admin",
    "/admin/produkte": {
      de: "/admin/produkte",
      it: "/admin/prodotti",
    },
    "/admin/news": {
      de: "/admin/news",
      it: "/admin/notizie",
    },
    "/admin/mitarbeiter": {
      de: "/admin/mitarbeiter",
      it: "/admin/dipendenti",
    },
    "/accept-invite": "/accept-invite",
  },
});

export type Pathnames = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];
