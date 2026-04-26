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
      <div className="mx-auto max-w-sm">
        <h1 className="mb-6 text-3xl font-black text-foreground">Vorschau: {title}</h1>
        {!item ? (
          <p className="text-sm text-muted-foreground">Laden…</p>
        ) : (
          <div className="relative overflow-hidden rounded-[2.5rem] bg-white border border-border/50 p-4 shadow-sm">
            <div className="relative aspect-square w-full overflow-hidden rounded-[1.8rem] bg-[#F8FAFC]">
              {item.imageUrl ? (
                <Image src={item.imageUrl} alt={title} fill className="object-contain" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-4xl font-black text-primary/10">
                  {title.substring(0, 1).toUpperCase()}
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
            </div>
            <div className="px-4 py-8">
              <h4 className="mb-3 text-xl font-bold text-foreground">{title}</h4>
              <p className="text-[15px] leading-relaxed text-muted-foreground font-medium">{description}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
