"use client";

import Image from "next/image";

import { Link } from "@/i18n/navigation";
import { use, useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Locale } from "@/i18n/routing";

/**
 * Product detail page – shows all products for a given category slug.
 * Data is fetched in real-time from the Convex database.
 */

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProduktePage({ params }: ProductPageProps) {
  const { slug } = use(params);
  const t = useTranslations("Products");
  const tCat = useTranslations("ProductCategories");
  const locale = useLocale() as Locale;
  const gridRef = useRef<HTMLDivElement>(null);

  /* Fetch category by slug to get its _id and display name */
  const kategorie = useQuery(api.kategorien.getBySlug, { slug });

  /* Fetch all products for this category (skip if kategorie not loaded yet) */
  const produkte = useQuery(
    api.produkte.listByKategorie,
    kategorie ? { kategorieId: kategorie._id } : "skip"
  );

  /* Determine the localised category name */
  const categoryName = kategorie
    ? locale === "it"
      ? kategorie.nameIt
      : kategorie.name
    : tCat(slug);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (gridRef.current) {
      const cards = gridRef.current.querySelectorAll("[data-card]");
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 85%",
            },
          }
        );
      }
    }

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [produkte]);

  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      {/* ═══ Category hero banner ═══ */}
      <section className="relative min-h-[40vh] flex items-center justify-center overflow-hidden bg-background pt-24 pb-16">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 z-0 opacity-[0.03]"  />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-3 text-[12px] font-bold uppercase tracking-widest text-muted-foreground/60">
            <Link href="/" className="transition-colors hover:text-primary">
              {t("breadcrumbHome")}
            </Link>
            <span className="opacity-30">/</span>
            <Link href="/produkte" className="transition-colors hover:text-primary">
              {t("breadcrumbProdukte")}
            </Link>
            <span className="opacity-30">/</span>
            <span className="text-primary">{categoryName}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h1 className="text-4xl sm:text-5xl font-medium text-foreground tracking-tight">
  {categoryName}
</h1>
          </div>
        </div>
      </section>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20 pb-40">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 bg-gradient-to-r from-transparent via-border to-transparent" />
        {produkte === undefined ? (
          /* Loading state */
          <p className="py-20 text-center text-lg text-[#6B7280]">
            {t("loading")}
          </p>
        ) : (
          <div ref={gridRef} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {produkte.map((produkt) => {
              const productName = locale === "it" ? produkt.nameIt : produkt.name;
              return (
                <div
                  key={produkt._id}
                  data-card
                  className="group relative overflow-hidden rounded-[2.5rem] bg-white border border-border/50 p-4 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] hover:border-primary/20"
                >
                  <div className="relative aspect-square w-full overflow-hidden rounded-[1.8rem] bg-[#F8FAFC]">
                    {produkt.imageUrl ? (
                      <Image
                        src={produkt.imageUrl}
                        alt={productName || 'Produktbild'}
                        fill
                        className="object-contain"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-4xl font-black text-primary/10">
                        {productName ? productName.substring(0, 1).toUpperCase() : 'P'}
                      </div>
                    )}
                  </div>
                  <div className="px-4 py-8">
                    <span className="inline-block mb-2 text-xs font-bold uppercase tracking-widest text-primary/70">
                      {categoryName}
                    </span>
                    <h4 className="mb-3 text-xl font-bold text-foreground">
                      {productName}
                    </h4>
                    <p className="text-[15px] leading-relaxed text-muted-foreground font-medium line-clamp-3">
                      {locale === "it" ? produkt.beschreibungIt : produkt.beschreibung}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
