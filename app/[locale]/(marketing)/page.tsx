"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import type { Locale } from "@/i18n/routing";

const PRODUCT_CATEGORIES = [
  { slug: "eisenwaren", image: "/images/home/eisenwaren/2.jpg" },
  { slug: "haushaltsartikel", image: "/images/home/haushalt/4.5.jpg" },
  { slug: "oefen-herde", image: "/images/home/herde/1.jpg" },
  { slug: "gartengeraete", image: "/images/home/gartengeraete/1.jpg" },
  { slug: "elektrogeraete", image: "/images/home/elektrogeraete/1.jpg" },
  { slug: "werkzeug", image: "/images/home/werkzeug/4.jpg" },
] as const;

export default function HomePage() {
  const t = useTranslations("Home");
  const tCat = useTranslations("ProductCategories");
  const locale = useLocale() as Locale;
  const newsItems = useQuery(api.news.listPublic);
  const heroRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const newsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Hero entrance
    if (heroRef.current) {
      const els = heroRef.current.querySelectorAll("[data-animate]");
      if (els.length > 0) {
        gsap.fromTo(els, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: "power3.out" });
      }
    }

    // About cards
    if (aboutRef.current) {
      const cards = aboutRef.current.querySelectorAll("[data-card]");
      if (cards.length > 0) {
        gsap.fromTo(cards, { y: 40, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out",
          scrollTrigger: { trigger: aboutRef.current, start: "top 80%" },
        });
      }
    }

    // Product cards
    if (productsRef.current) {
      const cards = productsRef.current.querySelectorAll("[data-card]");
      if (cards.length > 0) {
        gsap.fromTo(cards, { y: 40, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power2.out",
          scrollTrigger: { trigger: productsRef.current, start: "top 80%" },
        });
      }
    }

    // News cards
    if (newsRef.current) {
      const cards = newsRef.current.querySelectorAll("[data-card]");
      if (cards.length > 0) {
        gsap.fromTo(cards, { y: 40, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out",
          scrollTrigger: { trigger: newsRef.current, start: "top 80%" },
        });
      }
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
            alt={t("heroAlt", { fallback: "M. Brugnara Fachgeschäft für Eisenwaren und Haushaltsartikel in Meran" })}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-75 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/80" />
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
            {t("heroBild")}
            </span>
          </div>

          <h1 data-animate className="mb-6 text-4xl font-black tracking-tighter text-white sm:text-6xl lg:text-8xl leading-[1.05] drop-shadow-2xl">
            {t("heroTitle")}
          </h1>

          <p data-animate className="mx-auto max-w-2xl text-lg leading-relaxed text-white/90 sm:text-xl font-medium tracking-wide">
            {t("heroSubtitle")}
          </p>
        </div>
      </section>

      {/* ═══ Produkte Grid ═══ */}
      <section id="produkte-section" className="relative bg-white py-16 sm:py-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 bg-gradient-to-r from-transparent via-border to-transparent" />

        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.3em] text-primary/80">
              {t("unsereProdukte")}
            </p>
            <h2 className="text-4xl font-black text-foreground sm:text-5xl tracking-tighter">
              {t("qualityTitle")}
            </h2>
          </div>

          <div ref={productsRef} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCT_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={{ pathname: "/produkte/[slug]", params: { slug: cat.slug } }}
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

      {/* ═══ News ═══ */}
      {newsItems && newsItems.length > 0 && (
        <section className="bg-[#F6F7FB] py-16 sm:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-16">
              <p className="mb-4 text-xs font-black uppercase tracking-[0.3em] text-primary/80">
                {t("newsSection")}
              </p>
              <h2 className="text-4xl font-black text-foreground sm:text-5xl tracking-tighter">
                {t("newsSectionTitle")}
              </h2>
            </div>

            <div ref={newsRef} className="space-y-6">
              {newsItems.slice(0, 3).map((item) => {
                const title = locale === "it" ? item.titelIt : item.titel;
                const content = locale === "it" ? item.inhaltIt : item.inhalt;
                return (
                  <article
                    key={item._id}
                    data-card
                    className="group premium-card bg-white"
                  >
                    <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="flex flex-col sm:flex-row">
                      {item.imageUrl && (
                        <div className="relative w-full sm:w-64 shrink-0 aspect-[16/10] sm:aspect-auto sm:min-h-[200px] overflow-hidden rounded-t-[1.5rem] sm:rounded-tr-none sm:rounded-l-[1.5rem]">
                          <Image
                            src={item.imageUrl}
                            alt={title}
                            fill
                            sizes="(max-width: 640px) 100vw, 256px"
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        </div>
                      )}
                      <div className="flex-1 p-8">
                        <p className="mb-2 text-xs text-muted-foreground">
                          <time dateTime={new Date(item.createdAt).toISOString()}>
                            {new Date(item.createdAt).toLocaleDateString(locale === "it" ? "it-IT" : "de-DE", {
                              day: "2-digit", month: "long", year: "numeric",
                            })}
                          </time>
                        </p>
                        <h4 className="mb-3 text-xl font-black text-foreground">{title}</h4>
                        <p className="text-[15px] leading-relaxed text-muted-foreground line-clamp-3">{content}</p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/news"
                className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-6 py-3 text-sm font-bold text-primary transition-all hover:bg-primary hover:text-white"
              >
                {t("newsReadMore")}
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══ Team ═══ */}
      <section className="bg-white py-16 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-primary/70">
                {t("unserTeam")}
              </h2>
              <h3 className="mb-6 text-3xl font-black text-foreground sm:text-5xl tracking-tight">
                {t("teamTitle")}
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                {t("teamDescription")}
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
