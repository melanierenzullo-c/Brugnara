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
        className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-black pt-20 pb-20 sm:pt-32 sm:pb-32"
      >
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/ferramenta.jpg"
            alt="M. Brugnara Storefront"
            fill
            priority
            className="object-cover opacity-60 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80" />
        </div>

        {/* Animated Accents */}
        <div className="absolute inset-0 z-0 opacity-50">
          <div className="absolute -left-[10%] -top-[10%] h-[60%] w-[60%] rounded-full bg-primary/40 blur-[120px] animate-pulse" />
          <div className="absolute -right-[10%] -bottom-[10%] h-[50%] w-[50%] rounded-full bg-secondary/30 blur-[100px] animate-pulse [animation-delay:2s]" />
        </div>

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
          <div data-animate className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 mb-8 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">
              M. Brugnara GmbH — Meran
            </span>
          </div>

          <h1 data-animate className="mb-6 text-5xl font-black tracking-tight text-white sm:text-7xl lg:text-8xl leading-[1.05] drop-shadow-2xl">
            {t("heroTitle")}
          </h1>

          <p data-animate className="mx-auto max-w-2xl text-lg leading-relaxed text-white/80 sm:text-xl font-medium">
            {t("heroSubtitle")}
          </p>
        </div>
      </section>

      {/* ═══ Produkte Grid ═══ */}
      <section id="produkte-section" className="relative bg-[#fafbff] py-24 sm:py-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 bg-gradient-to-r from-transparent via-border to-transparent" />

        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-primary/70">
              {t("unsereProdukte")}
            </h2>
            <h3 className="text-3xl font-black text-foreground sm:text-5xl tracking-tight">
              Qualität für Haus & Handwerk
            </h3>
          </div>

          <div ref={productsRef} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCT_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={{ pathname: "/produkte/[slug]", params: { slug: cat.slug } }}
                data-card
                className="group relative overflow-hidden rounded-[2rem] bg-white border border-border/50 p-3 no-underline transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] hover:border-primary/20"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.5rem]">
                  <Image
                    src={cat.image}
                    alt={tCat(cat.slug)}
                    fill
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
                      {t("entdecken")}
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
        </div>
      </section>

      {/* ═══ Team ═══ */}
      <section className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-primary/70">
                {t("unserTeam")}
              </h2>
              <h3 className="mb-6 text-4xl font-black text-foreground sm:text-5xl tracking-tight">
                Gemeinsam für Ihren Erfolg
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Seit Jahrzehnten stehen wir als Familienbetrieb in Meran für Kompetenz und Leidenschaft. Unser Team berät Sie fachkundig bei all Ihren Projekten.
              </p>

            </div>
            <div className="lg:w-1/2 w-full overflow-hidden rounded-[2.5rem] shadow-2xl premium-shadow">
              <Image
                src="/images/home/team.jpg"
                alt={t("unserTeam")}
                width={1200}
                height={800}
                className="block h-auto w-full object-cover transition-transform duration-1000 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>
    </div >
  );
}
