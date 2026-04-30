"use client";

import { useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

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

  const title = lang === "de" ? item?.titel : lang === "it" ? item?.titelIt : item?.titelEn;
  const content = lang === "de" ? item?.inhalt : lang === "it" ? item?.inhaltIt : item?.inhaltEn;

  const displayTitle = title ?? "Newsvorschau";
  const displayContent = content ?? "Kein Inhalt vorhanden.";

  return (
    <div className="min-h-screen bg-[#F4F6F9] px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Vorschau</h1>
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

        {!item ? (
          <p className="text-sm text-muted-foreground">Laden…</p>
        ) : (
          <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
            {item.imageUrl ? (
              <div className="relative h-72 w-full bg-slate-50">
                <Image src={item.imageUrl} alt={displayTitle} fill className="object-contain" />
              </div>
            ) : null}
            <div className="p-6">
              <h2 className="mb-4 text-2xl font-bold text-foreground">{displayTitle}</h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{displayContent}</p>
            </div>
          </article>
        )}
      </div>
    </div>
  );
}

