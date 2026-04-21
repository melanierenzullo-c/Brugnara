"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

export default function ProduktVorschauPage() {
  const params = useSearchParams();
  const produktId = params.get("id");
  const draftId = params.get("draftId");

  const produkt = useQuery(
    api.produkte.getByIdForAdmin,
    produktId ? { id: produktId as Id<"produkte"> } : "skip"
  );
  const draft = useQuery(
    api.produkte.getDraftByIdForAdmin,
    draftId ? { id: draftId as Id<"produktEntwuerfe"> } : "skip"
  );

  const item = draft ?? produkt;
  const title = item?.name ?? "Produktvorschau";
  const description = item?.beschreibung ?? "Keine Beschreibung vorhanden.";

  return (
    <div className="min-h-screen bg-[#F4F6F9] px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-3xl font-black text-foreground">Vorschau: {title}</h1>
        {!item ? (
          <p className="text-sm text-muted-foreground">Laden…</p>
        ) : (
          <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid gap-6 md:grid-cols-[280px_1fr]">
              <div className="relative aspect-square overflow-hidden rounded-[1.2rem] bg-slate-50">
                {item.imageUrl ? (
                  <Image src={item.imageUrl} alt={title} fill className="object-contain" />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-400">Kein Bild</div>
                )}
              </div>
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary/70">
                  {(item as { kategorieName?: string }).kategorieName ?? "Kategorie"}
                </p>
                <h2 className="mb-3 text-2xl font-bold text-foreground">{title}</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
              </div>
            </div>
          </article>
        )}
      </div>
    </div>
  );
}

