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
          <article className="overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-xl">
            {item.imageUrl ? (
              <div className="relative aspect-[21/9] w-full bg-slate-50 border-b border-slate-100">
                <Image src={item.imageUrl} alt={displayTitle} fill className="object-cover" />
              </div>
            ) : null}
            <div className="p-10 sm:p-16">
              <div className="mb-6 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">
                <span>Vorschau</span>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <span>{new Date().toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" })}</span>
              </div>
              <h2 className="mb-8 text-4xl sm:text-5xl font-black text-foreground tracking-tight leading-[1.1]">{displayTitle}</h2>
              <div 
                className="prose-content text-lg sm:text-xl max-w-3xl"
                dangerouslySetInnerHTML={{ __html: displayContent }} 
              />
            </div>
          </article>
        )}
      </div>
    </div>
  );
}

