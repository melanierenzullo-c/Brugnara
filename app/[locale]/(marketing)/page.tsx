"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const PRODUCT_CATEGORIES = [
  { slug: "eisenwaren", image: "/images/home/eisenwaren/1.jpg" },
  { slug: "haushaltsartikel", image: "/images/home/haushalt/1.jpg" },
  { slug: "oefen-herde", image: "/images/home/herde/1.jpg" },
  { slug: "gartengeraete", image: "/images/home/gartengeraete/1.jpg" },
  { slug: "elektrogeraete", image: "/images/home/elektrogeraete/1.jpg" },
  { slug: "werkzeug", image: "/images/home/werkzeug/1.jpg" },
] as const;

export default function HomePage() {
  const t = useTranslations("Home");
  const tCat = useTranslations("ProductCategories");
  const heroRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Hero entrance
    if (heroRef.current) {
      const els = heroRef.current.querySelectorAll("[data-animate]");
      gsap.fromTo(els, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: "power3.out" });
    }

    // About cards
    if (aboutRef.current) {
      const cards = aboutRef.current.querySelectorAll("[data-card]");
      gsap.fromTo(cards, { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out",
        scrollTrigger: { trigger: aboutRef.current, start: "top 80%" },
      });
    }

    // Product cards
    if (productsRef.current) {
      const cards = productsRef.current.querySelectorAll("[data-card]");
      gsap.fromTo(cards, { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power2.out",
        scrollTrigger: { trigger: productsRef.current, start: "top 80%" },
      });
    }

    return () => { ScrollTrigger.getAll().forEach((st) => st.kill()); };
  }, []);

  return (
    <div>
      {/* ═══ Hero ═══ */}
      <section
        ref={heroRef}
        className="relative overflow-hidden bg-gradient-to-br from-[#3A537E] via-[#5A759E] to-[#7B97BF] py-24 sm:py-32"
      >
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <p data-animate className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-white/60">
            M. Brugnara GmbH — Meran
          </p>
          <h1 data-animate className="mb-6 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            {t("heroTitle")}
          </h1>
          <p data-animate className="mx-auto max-w-2xl text-lg leading-relaxed text-white/70 sm:text-xl">
            {t("heroSubtitle")}
          </p>
          <div data-animate className="mt-8">
            <button
              onClick={() => {
                const el = document.getElementById("produkte-section");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-block cursor-pointer rounded-full border-none bg-white px-8 py-3.5 text-[15px] font-semibold text-[#3A537E] shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
            >
              {t("mehrErfahren")}
            </button>
          </div>
        </div>
      </section>

      {/* ═══ Produkte Grid ═══ */}
      <section id="produkte-section" className="bg-[#F4F6F9] py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-3 text-center text-sm font-semibold uppercase tracking-[0.15em] text-[#5A759E]">
            {t("unsereProdukte")}
          </h2>
          <div className="mx-auto mb-12 h-[3px] w-12 rounded-full bg-[#5A759E]" />
          <div ref={productsRef} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCT_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={{ pathname: "/produkte/[slug]", params: { slug: cat.slug } }}
                data-card
                className="group relative overflow-hidden rounded-2xl bg-white no-underline shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={cat.image}
                    alt={tCat(cat.slug)}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
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

      {/* ═══ Team ═══ */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-3 text-center text-sm font-semibold uppercase tracking-[0.15em] text-[#5A759E]">
            {t("unserTeam")}
          </h2>
          <div className="mx-auto mb-10 h-[3px] w-12 rounded-full bg-[#5A759E]" />
          <div className="overflow-hidden rounded-2xl shadow-lg">
            <Image
              src="/images/home/team.jpg"
              alt={t("unserTeam")}
              width={1200}
              height={600}
              className="block h-auto w-full object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
