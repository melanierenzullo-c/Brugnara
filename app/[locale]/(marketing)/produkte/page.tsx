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
        className="relative overflow-hidden bg-gradient-to-br from-[#3A537E] via-[#5A759E] to-[#7B97BF] py-20 sm:py-28"
      >
        {/* Dot pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <p
            data-animate
            className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-white/60"
          >
            M. Brugnara GmbH
          </p>
          <h1
            data-animate
            className="mb-6 text-4xl font-bold leading-tight text-white sm:text-5xl"
          >
            {t("heroTitle")}
          </h1>
          <p
            data-animate
            className="mx-auto max-w-2xl text-lg leading-relaxed text-white/70"
          >
            {t("heroSubtitle")}
          </p>
        </div>
      </section>

      {/* ═══ Categories Grid ═══ */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-3 text-center text-sm font-semibold uppercase tracking-[0.15em] text-[#5A759E]">
            {t("sectionTitle")}
          </h2>
          <div className="mx-auto mb-12 h-[3px] w-12 rounded-md bg-[#5A759E]" />

          <div
            ref={gridRef}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {PRODUCT_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={{
                  pathname: "/produkte/[slug]",
                  params: { slug: cat.slug },
                }}
                data-card
                className="group relative overflow-hidden rounded-lg bg-white no-underline shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Category image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={cat.image}
                    alt={tCat(cat.slug)}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>

                {/* Category label */}
                <div className="flex items-center justify-between p-5">
                  <h3 className="text-lg font-bold text-[#1A1A2E]">
                    {tCat(cat.slug)}
                  </h3>
                  <span className="text-[#5A759E] transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
