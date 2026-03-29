"use client";

import { useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useQuery } from "convex/react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { api } from "@/convex/_generated/api";
import type { Locale } from "@/i18n/routing";

export default function NewsPage() {
  const t = useTranslations("News");
  const locale = useLocale() as Locale;
  const newsItems = useQuery(api.news.listPublic);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (headerRef.current) {
      const els = headerRef.current.querySelectorAll("[data-animate]");
      if (els.length > 0) {
        gsap.fromTo(els, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power3.out" });
      }
    }

    if (gridRef.current) {
      const cards = gridRef.current.querySelectorAll("[data-card]");
      if (cards.length > 0) {
        gsap.fromTo(cards, { y: 40, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out",
          scrollTrigger: { trigger: gridRef.current, start: "top 85%" },
        });
      }
    }

    return () => { ScrollTrigger.getAll().forEach((st) => st.kill()); };
  }, [newsItems]);

  return (
    <div className="min-h-screen bg-background">
      {/* ═══ Header ═══ */}
      <section ref={headerRef} className="relative overflow-hidden bg-background pt-32 pb-20">
        <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <div data-animate className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 mb-6">
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary">{t("badge")}</span>
          </div>
          <h1 data-animate className="mb-6 text-4xl font-black tracking-tighter text-foreground sm:text-6xl text-gradient">
            {t("title")}
          </h1>
          <p data-animate className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground font-medium tracking-wide">
            {t("subtitle")}
          </p>
        </div>
      </section>

      {/* ═══ News articles ═══ */}
      <div className="mx-auto max-w-4xl px-6 pb-32">
        {newsItems === undefined ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground text-sm gap-2">
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Laden…
          </div>
        ) : newsItems.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-lg text-muted-foreground">{t("placeholder")}</p>
          </div>
        ) : (
          <div ref={gridRef} className="space-y-8">
            {newsItems.map((item) => {
              const title = locale === "it" ? item.titelIt : item.titel;
              const content = locale === "it" ? item.inhaltIt : item.inhalt;

              return (
                <article
                  key={item._id}
                  data-card
                  className="group premium-card bg-white"
                >
                  {/* Accent border */}
                  <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="flex flex-col sm:flex-row">
                    {/* Image */}
                    {item.imageUrl && (
                      <div className="relative w-full sm:w-72 shrink-0 aspect-[16/10] sm:aspect-auto sm:min-h-[240px] overflow-hidden rounded-t-[1.5rem] sm:rounded-tr-none sm:rounded-l-[1.5rem]">
                        <Image
                          src={item.imageUrl}
                          alt={title}
                          fill
                          sizes="(max-width: 640px) 100vw, 288px"
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>
                    )}

                    {/* Text content */}
                    <div className="flex-1 p-8 sm:p-10">
                      <div className="flex items-center gap-3 mb-4 text-xs text-muted-foreground">
                        <time dateTime={new Date(item.createdAt).toISOString()}>
                          {new Date(item.createdAt).toLocaleDateString(locale === "it" ? "it-IT" : "de-DE", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })}
                        </time>
                      </div>
                      <h2 className="mb-4 text-2xl font-black text-foreground">{title}</h2>
                      <p className="text-[17px] leading-relaxed text-muted-foreground font-medium whitespace-pre-line">
                        {content}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
