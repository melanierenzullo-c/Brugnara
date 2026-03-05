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

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [produkte]);

  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      {/* Category hero banner */}
      <div className="relative flex h-[30vh] items-end overflow-hidden bg-[#3A537E]">
        <div className="absolute inset-0 bg-gradient-to-t from-[#3A537E] to-[#5A759E]" />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-8">
          {/* Breadcrumb */}
          <nav className="mb-3 flex items-center gap-2 text-[14px] text-white/60">
            <Link href="/" className="text-white/60 no-underline transition-colors hover:text-white">
              {t("breadcrumbHome")}
            </Link>
            <span>|</span>
            <Link href="/produkte" className="text-white/60 no-underline transition-colors hover:text-white">
              {t("breadcrumbProdukte")}
            </Link>
            <span>|</span>
            <span className="font-semibold text-white">{categoryName}</span>
          </nav>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            {categoryName}
          </h1>
        </div>
      </div>

      {/* Product grid */}
      <div className="mx-auto max-w-6xl px-6 py-12">
        {produkte === undefined ? (
          /* Loading state */
          <p className="py-20 text-center text-lg text-[#6B7280]">
            {t("loading")}
          </p>
        ) : produkte.length === 0 ? (
          <p className="py-20 text-center text-lg text-[#6B7280]">
            {t("noProducts")}
          </p>
        ) : (
          <div ref={gridRef} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {produkte.map((produkt) => {
              const productName = locale === "it" ? produkt.nameIt : produkt.name;
              return (
                <div
                  key={produkt._id}
                  data-card
                  className="group overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-md bg-[#F0F4F8]">
                    {produkt.imageUrl ? (
                      <Image
                        src={produkt.imageUrl}
                        alt={productName || 'Produktbild'}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-[#A5BDD8] opacity-50">
                        {productName ? productName.substring(0, 1).toUpperCase() : 'P'}
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h4 className="mb-2 text-lg font-bold text-[#1A1A2E]">
                      {productName}
                    </h4>
                    <p className="text-[14px] leading-relaxed text-[#6B7280]">
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
