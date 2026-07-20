import type { MetadataRoute } from "next";
import { fetchQuery } from "convex/nextjs";

import { api } from "@/convex/_generated/api";
import { newsSlug } from "@/lib/news";

const BASE_URL = "https://brugnara.bz.it";

const CATEGORY_SLUGS = [
  "eisenwaren",
  "haushaltsartikel",
  "oefen-herde",
  "gartengeraete",
  "elektrogeraete",
  "werkzeug",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: {
        languages: {
          de: BASE_URL,
          it: `${BASE_URL}/it`,
        },
      },
    },
    {
      url: `${BASE_URL}/produkte`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: {
          de: `${BASE_URL}/produkte`,
          it: `${BASE_URL}/it/prodotti`,
        },
      },
    },
    {
      url: `${BASE_URL}/news`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
      alternates: {
        languages: {
          de: `${BASE_URL}/news`,
          it: `${BASE_URL}/it/novita`,
        },
      },
    },
    {
      url: `${BASE_URL}/kontakt`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: {
        languages: {
          de: `${BASE_URL}/kontakt`,
          it: `${BASE_URL}/it/kontakt`,
        },
      },
    },
    {
      url: `${BASE_URL}/impressum`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
      alternates: {
        languages: {
          de: `${BASE_URL}/impressum`,
          it: `${BASE_URL}/it/impressum`,
        },
      },
    },
    {
      url: `${BASE_URL}/datenschutz`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
      alternates: {
        languages: {
          de: `${BASE_URL}/datenschutz`,
          it: `${BASE_URL}/it/datenschutz`,
        },
      },
    },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = CATEGORY_SLUGS.map((slug) => ({
    url: `${BASE_URL}/produkte/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
    alternates: {
      languages: {
        de: `${BASE_URL}/produkte/${slug}`,
        it: `${BASE_URL}/it/prodotti/${slug}`,
      },
    },
  }));

  /* News-Detailseiten – ohne Convex-Verbindung bleibt die Sitemap statisch */
  let newsRoutes: MetadataRoute.Sitemap = [];
  try {
    const items = await fetchQuery(api.news.listPublic, {});
    newsRoutes = items.map((item) => ({
      url: `${BASE_URL}/news/${newsSlug(item, "de")}`,
      lastModified: new Date(item.createdAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
      alternates: {
        languages: {
          de: `${BASE_URL}/news/${newsSlug(item, "de")}`,
          it: `${BASE_URL}/it/novita/${newsSlug(item, "it")}`,
          en: `${BASE_URL}/en/news/${newsSlug(item, "en")}`,
        },
      },
    }));
  } catch {
    // ponytail: Sitemap ohne Beiträge ausliefern ist besser als ein 500er
  }

  return [...staticRoutes, ...categoryRoutes, ...newsRoutes];
}
