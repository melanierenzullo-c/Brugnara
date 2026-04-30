"use client";

import { useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

type Lang = "de" | "it" | "en";

export default function ProduktVorschauPage() {
  const params = useSearchParams();
  const produktId = params.get("id");
  const draftId = params.get("draftId");
  const [lang, setLang] = useState<Lang>("de");

  const produkt = useQuery(
    api.produkte.getByIdForAdmin,
    produktId ? { id: produktId as Id<"produkte"> } : "skip"
  );
  const draft = useQuery(
    api.produkte.getDraftByIdForAdmin,
    draftId ? { id: draftId as Id<"produktEntwuerfe"> } : "skip"
  );

  const item = draft ?? produkt;

  const title = lang === "de" ? item?.name : lang === "it" ? item?.nameIt : item?.nameEn;
  const description = lang === "de" ? item?.beschreibung : lang === "it" ? item?.beschreibungIt : item?.beschreibungEn;

  const displayTitle = title ?? "Produktvorschau";
  const displayDescription = description ?? "Keine Beschreibung vorhanden.";

  return (
    <div className="min-h-screen bg-[#F4F6F9] px-6 py-10">
      <div className="mx-auto max-w-sm">
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
          <div className="relative overflow-hidden rounded-[2.5rem] bg-white border border-border/50 p-4 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)]">
            <div className="relative aspect-square w-full overflow-hidden rounded-[1.8rem] bg-[#F8FAFC]">
              {item.imageUrl ? (
                <Image src={item.imageUrl} alt={displayTitle} fill className="object-contain" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-4xl font-black text-primary/10">
                  {displayTitle.substring(0, 1).toUpperCase()}
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
            </div>
            <div className="px-4 py-8">
              <h4 className="mb-3 text-xl font-bold text-foreground">{displayTitle}</h4>
              <p className="text-[15px] leading-relaxed text-muted-foreground font-medium">{displayDescription}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
