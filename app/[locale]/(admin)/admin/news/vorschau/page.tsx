"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

export default function NewsVorschauPage() {
  const params = useSearchParams();
  const newsId = params.get("id");
  const draftId = params.get("draftId");

  const news = useQuery(
    api.news.getByIdForAdmin,
    newsId ? { id: newsId as Id<"news"> } : "skip"
  );
  const draft = useQuery(
    api.news.getDraftByIdForAdmin,
    draftId ? { id: draftId as Id<"newsEntwuerfe"> } : "skip"
  );

  const item = draft ?? news;
  const title = item?.titel ?? "Newsvorschau";
  const content = item?.inhalt ?? "Kein Inhalt vorhanden.";

  return (
    <div className="min-h-screen bg-[#F4F6F9] px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-3xl font-black text-foreground">Vorschau: {title}</h1>
        {!item ? (
          <p className="text-sm text-muted-foreground">Laden…</p>
        ) : (
          <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
            {item.imageUrl ? (
              <div className="relative h-72 w-full bg-slate-50">
                <Image src={item.imageUrl} alt={title} fill className="object-contain" />
              </div>
            ) : null}
            <div className="p-6">
              <h2 className="mb-4 text-2xl font-bold text-foreground">{title}</h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{content}</p>
            </div>
          </article>
        )}
      </div>
    </div>
  );
}

