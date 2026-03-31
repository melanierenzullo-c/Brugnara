import type { MetadataRoute } from "next";

const BASE_URL = "https://brugnara.bz.it";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/*", "/api", "/api/*", "/login", "/accept-invite"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
