"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { NewsArticle } from "@/components/news-article";
import { formatNewsDate, newsText } from "@/lib/news";

type Lang = "de" | "it" | "en";

export default function NewsVorschauPage() {
  const params = useSearchParams();
  const newsId = params.get("id");
  const draftId = params.get("draftId");
  const [lang, setLang] = useState<Lang>("de");

  const news = useQuery(
    api.news.getByIdForAdmin,
    newsId ? { id: newsId as Id<"news"> } : "skip"
  );
  const draft = useQuery(
    api.news.getDraftByIdForAdmin,
    draftId ? { id: draftId as Id<"newsEntwuerfe"> } : "skip"
  );

  const item = draft ?? news;

  const text = item ? newsText(item, lang) : null;

  return (
    <div className="min-h-screen bg-[#F4F6F9] px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <p className="text-xl font-bold text-foreground">Vorschau</p>
          <div className="flex items-center gap-1 rounded-full bg-white border border-border/50 p-1 shadow-sm">
            {(["de", "it", "en"] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`rounded-full px-3 py-1 text-xs font-bold transition-all ${
                  lang === l
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:bg-slate-50"
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {!item || !text ? (
          <p className="text-sm text-muted-foreground">Laden…</p>
        ) : (
          /* weißer Rahmen = die spätere Seite, Inhalt identisch zur Website */
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-10 shadow-sm sm:px-14 sm:py-14">
            <NewsArticle
              imageUrl={item.imageUrl}
              title={text.title || "Newsvorschau"}
              content={text.content || "<p>Kein Inhalt vorhanden.</p>"}
              date={formatNewsDate(item.createdAt, lang)}
              kicker="Vorschau"
            />
          </div>
        )}
      </div>
    </div>
  );
}

