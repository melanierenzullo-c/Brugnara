"use client";

import { use } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useQuery } from "convex/react";

import { Link } from "@/i18n/navigation";
import { api } from "@/convex/_generated/api";
import type { Locale } from "@/i18n/routing";
import { NewsArticle } from "@/components/news-article";
import { formatNewsDate, newsSlugs, newsText } from "@/lib/news";

export default function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const t = useTranslations("News");
  const locale = useLocale() as Locale;

  /* listPublic ist ohnehin schon geladen/gecacht – keine eigene Query nötig */
  const newsItems = useQuery(api.news.listPublic);
  const item = newsItems?.find((n) => newsSlugs(n).includes(slug));

  const backLink = (
    <Link
      href="/news"
      className="inline-flex items-center gap-2 text-sm font-bold text-primary transition-colors hover:text-primary/70"
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      {t("backToNews")}
    </Link>
  );

  return (
    <div className="min-h-screen bg-white px-5 sm:px-6 pt-32 sm:pt-44 pb-32">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10">{backLink}</div>

        {newsItems === undefined ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground text-sm gap-2">
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            {t("loading")}
          </div>
        ) : !item ? (
          <p className="py-20 text-center text-lg text-muted-foreground">
            {t("notFound")}
          </p>
        ) : (
          <>
            <NewsArticle
              imageUrl={item.imageUrl}
              date={formatNewsDate(item.createdAt, locale)}
              {...newsText(item, locale)}
            />
            
          </>
        )}
      </div>
    </div>
  );
}
