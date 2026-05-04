import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["de", "it", "en"],
  defaultLocale: "de",
  localePrefix: "as-needed",
  pathnames: {
    "/": "/",
    "/produkte": {
      de: "/produkte",
      it: "/prodotti",
      en: "/products",
    },
    "/produkte/[slug]": {
      de: "/produkte/[slug]",
      it: "/prodotti/[slug]",
      en: "/products/[slug]",
    },

    "/news": {
      de: "/news",
      it: "/novita",
      en: "/news",
    },
    "/cookies": "/cookies",
    "/marken": "/marken",
    "/impressum": "/impressum",
    "/datenschutz": {
      de: "/datenschutz",
      it: "/privacy",
      en: "/privacy",
    },
    "/kontakt": "/kontakt",
    "/login": "/login",
    "/admin": "/admin",
    "/admin/produkte": {
      de: "/admin/produkte",
      it: "/admin/prodotti",
      en: "/admin/products",
    },
    "/admin/news": {
      de: "/admin/news",
      it: "/admin/notizie",
      en: "/admin/news",
    },
    "/admin/mitarbeiter": {
      de: "/admin/mitarbeiter",
      it: "/admin/dipendenti",
      en: "/admin/employees",
    },
    "/admin/aktivitaeten": {
      de: "/admin/aktivitaeten",
      it: "/admin/attivita",
      en: "/admin/activities",
    },
    "/accept-invite": "/accept-invite",
  },
});

export type Pathnames = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];
