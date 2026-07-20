import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { fetchQuery } from "convex/nextjs";

import { api } from "@/convex/_generated/api";
import type { Locale } from "@/i18n/routing";
import { excerpt, newsSlugs, newsText } from "@/lib/news";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "News" });

  const basePath = locale === "it" ? "/it/novita" : locale === "en" ? "/en/news" : "/news";
  const url = `https://brugnara.bz.it${basePath}/${slug}`;

  let title = t("metaTitle");
  let description = t("metaDescription");

  try {
    const items = await fetchQuery(api.news.listPublic, {});
    const item = items.find((n) => newsSlugs(n).includes(slug));
    if (item) {
      const text = newsText(item, locale as Locale);
      title = `${text.title} – M. Brugnara GmbH`;
      description = excerpt(text.content, 160);
    }
  } catch {
    // ponytail: Convex nicht erreichbar → generische News-Metadaten reichen
  }

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "article" },
  };
}

export default function NewsDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
