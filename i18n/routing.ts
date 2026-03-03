import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["de", "it"],
  defaultLocale: "de",
  localePrefix: "as-needed",
  pathnames: {
    "/": "/",
    "/produkte/[slug]": {
      de: "/produkte/[slug]",
      it: "/prodotti/[slug]",
    },

    "/impressum": "/impressum",
    "/admin": "/admin",
    "/admin/produkte": {
      de: "/admin/produkte",
      it: "/admin/prodotti",
    },
    "/admin/news": {
      de: "/admin/news",
      it: "/admin/notizie",
    },
  },
});

export type Pathnames = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];
