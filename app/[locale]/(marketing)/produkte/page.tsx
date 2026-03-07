"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** All product categories with their representative images */
const PRODUCT_CATEGORIES = [
  { slug: "eisenwaren", image: "/images/home/eisenwaren/1.jpg" },
  { slug: "haushaltsartikel", image: "/images/home/haushalt/1.jpg" },
  { slug: "oefen-herde", image: "/images/home/herde/1.jpg" },
  { slug: "gartengeraete", image: "/images/home/gartengeraete/1.jpg" },
  { slug: "elektrogeraete", image: "/images/home/elektrogeraete/1.jpg" },
  { slug: "werkzeug", image: "/images/home/werkzeug/1.jpg" },
] as const;

/**
 * Product overview page – displays all product categories
 * in a hero + grid layout consistent with the rest of the site.
 */
export default function ProdukteOverviewPage() {
  const t = useTranslations("ProductsOverview");
  const tCat = useTranslations("ProductCategories");
  const heroRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    /* Hero entrance animation */
    if (heroRef.current) {
      const els = heroRef.current.querySelectorAll("[data-animate]");
      gsap.fromTo(
        els,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: "power3.out" }
      );
    }

    /* Category card stagger animation */
    if (gridRef.current) {
      const cards = gridRef.current.querySelectorAll("[data-card]");
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

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      {/* ═══ Hero Banner ═══ */}
      <section
        ref={heroRef}
        className="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-background pt-24 pb-20 sm:pt-32 sm:pb-28"
      >
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 z-0">
          <div className="absolute -left-[5%] -top-[5%] h-[40%] w-[40%] rounded-full bg-primary/10 blur-[100px] animate-pulse" />
          <div className="absolute -right-[5%] -bottom-[5%] h-[30%] w-[30%] rounded-full bg-secondary/20 blur-[80px] animate-pulse [animation-delay:1s]" />
        </div>

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <div data-animate className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 mb-6">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
              M. Brugnara GmbH
            </span>
          </div>
          <h1
            data-animate
            className="mb-6 text-4xl font-black tracking-tight text-foreground sm:text-6xl text-gradient"
          >
            {t("heroTitle")}
          </h1>
          <p
            data-animate
            className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground font-medium"
          >
            {t("heroSubtitle")}
          </p>
        </div>
      </section>

      {/* ═══ Categories Grid ═══ */}
      <section className="relative py-20 sm:py-28 overflow-hidden bg-[#fafbff]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 bg-gradient-to-r from-transparent via-border to-transparent" />

        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-primary/70">
              {t("sectionTitle")}
            </h2>
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
                className="group relative overflow-hidden rounded-[2.5rem] bg-white border border-border/50 p-4 no-underline transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] hover:border-primary/20"
              >
                {/* Category image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.8rem]">
                  <Image
                    src={cat.image}
                    alt={tCat(cat.slug)}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </div>

                {/* Category label */}
                <div className="flex items-center justify-between px-4 py-6">
                  <div className="flex flex-col">
                    <h3 className="text-xl font-bold text-foreground">
                      {tCat(cat.slug)}
                    </h3>
                    <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                      Kollektion ansehen
                    </span>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10 text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-white group-hover:rotate-45">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
