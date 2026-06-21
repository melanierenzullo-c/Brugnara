"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { Locale } from "@/i18n/routing";

/** All product categories with their representative images */
const PRODUCT_CATEGORIES = [
  { slug: "eisenwaren", image: "/images/home/eisenwaren/2.jpg" },
  { slug: "haushaltsartikel", image: "/images/home/haushalt/4.5.jpg" },
  { slug: "oefen-herde", image: "/images/home/herde/1.jpg" },
  { slug: "gartengeraete", image: "/images/home/gartengeraete/1.jpg" },
  { slug: "elektrogeraete", image: "/images/home/elektrogeraete/1.jpg" },
  { slug: "werkzeug", image: "/images/home/werkzeug/4.jpg" },
] as const;

export default function ProdukteOverviewPage() {
  const t = useTranslations("ProductsOverview");
  const tHome = useTranslations("Home");
  const tCat = useTranslations("ProductCategories");
  const locale = useLocale() as Locale;
  const heroRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const alleProdukte = useQuery(api.produkte.listPublic);

  const isSearching = searchQuery.trim().length > 0;

  const suchergebnisse = isSearching && alleProdukte
    ? alleProdukte.filter((p) => {
      const q = searchQuery.trim().toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.nameIt.toLowerCase().includes(q) ||
        p.beschreibung.toLowerCase().includes(q) ||
        p.beschreibungIt.toLowerCase().includes(q) ||
        p.kategorieName.toLowerCase().includes(q) ||
        p.kategorieNameIt.toLowerCase().includes(q)
      );
    })
    : [];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (heroRef.current) {
      const els = heroRef.current.querySelectorAll("[data-animate]");
      if (els.length > 0) {
        gsap.fromTo(
          els,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: "power3.out" }
        );
      }
    }

    if (!isSearching && gridRef.current) {
      const cards = gridRef.current.querySelectorAll("[data-card]");
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          { y: 40, opacity: 0 },
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
  }, [isSearching]);

  return (
    <div className="min-h-screen bg-background">
      {/* ═══ Header ═══ */}
      <section className="relative overflow-hidden bg-[#F6F7FB] pt-1 sm:pt-38 pb-20">
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-foreground sm:text-6xl text-gradient leading-snug">
            {t("heroTitle")}
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            {t("heroSubtitle")}
          </p>
        </div>
      </section>

      {/* ═══ Categories Grid / Search Results ═══ */}
      <section className="relative py-16 sm:py-28 overflow-hidden bg-background">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-2/3 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

        <div className="mx-auto max-w-7xl px-6">
          {/* Search field */}
          <div className="relative max-w-xl mx-auto mb-12">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="pl-10 h-12 rounded-full border-border/60 bg-white/80 backdrop-blur-sm"
            />
          </div>

          {isSearching ? (
            /* ── Search results ── */
            <div>
              {alleProdukte === undefined ? (
                <div className="flex items-center justify-center py-20 text-muted-foreground text-sm gap-2">
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Laden…
                </div>
              ) : suchergebnisse.length === 0 ? (
                <p className="py-20 text-center text-lg text-muted-foreground">
                  {t("searchNoResults")}
                </p>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground text-center mb-8">
                    {t("searchResultsCount", { count: suchergebnisse.length })}
                  </p>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {suchergebnisse.map((produkt) => {
                      const productName = locale === "it" ? produkt.nameIt : produkt.name;
                      const katName = locale === "it" ? produkt.kategorieNameIt : produkt.kategorieName;
                      return (
                        <div
                          key={produkt._id}
                          className="group relative overflow-hidden rounded-[2.5rem] bg-white border border-border/50 p-4 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] hover:border-primary/20"
                        >
                          <div className="relative aspect-square w-full overflow-hidden rounded-[1.8rem] bg-[#F8FAFC]">
                            {produkt.imageUrl ? (
                              <Image
                                src={produkt.imageUrl}
                                alt={productName || "Produktbild"}
                                fill
                                className="object-contain"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-4xl font-black text-primary/10">
                                {productName ? productName.substring(0, 1).toUpperCase() : "P"}
                              </div>
                            )}
                          </div>
                          <div className="px-4 py-8">
                            <span className="inline-block mb-2 text-xs font-bold uppercase tracking-widest text-primary/70">
                              {katName}
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
                </>
              )}
            </div>
          ) : (
            /* ── Normal category grid ── */
            <>
              <div className="text-center mb-16">
                <p className="mb-4 text-xs font-black uppercase tracking-[0.3em] text-primary/80">
                  {t("sectionTitle")}
                </p>
              </div>

              <div
                ref={gridRef}
                className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
              >
                {PRODUCT_CATEGORIES.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={{
                      pathname: "/produkte/[slug]",
                      params: { slug: cat.slug },
                    }}
                    data-card
                    className="group premium-card p-3 no-underline"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1rem]">
                      <Image
                        src={cat.image}
                        alt={tCat(cat.slug)}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    </div>

                    <div className="flex items-center justify-between px-4 py-6">
                      <div className="flex flex-col">
                        <h3 className="text-xl font-bold text-foreground">
                          {tCat(cat.slug)}
                        </h3>
                        <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                          {tHome("entdecken")}
                        </span>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10 text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-white">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
