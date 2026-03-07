"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function NewsPage() {
  const t = useTranslations("News");
  const cardRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Header animation
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current.querySelectorAll("[data-animate]"),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power3.out" }
      );
    }

    // Card animation
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: { trigger: cardRef.current, start: "top 90%" },
        }
      );
    }
    return () => { ScrollTrigger.getAll().forEach((st) => st.kill()); };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* ═══ Header ═══ */}
      <section ref={headerRef} className="relative overflow-hidden bg-background pt-32 pb-20">
        <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <div data-animate className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 mb-6">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">Aktuelles</span>
          </div>
          <h1 data-animate className="mb-6 text-4xl font-black tracking-tight text-foreground sm:text-6xl text-gradient">
            News & Angebote
          </h1>
          <p data-animate className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground font-medium">
            {t("title")}
          </p>
        </div>
      </section>

      {/* ═══ Content ═══ */}
      <div className="mx-auto max-w-4xl px-6 pb-32">
        <div
          ref={cardRef}
          className="group relative overflow-hidden rounded-[2.5rem] bg-white border border-border/50 p-8 sm:p-12 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all duration-700"
        >
          {/* Accent border */}
          <div className="absolute top-0 left-0 h-2 w-full bg-gradient-to-r from-primary/30 via-primary to-primary/30" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8 text-primary">
              <span className="p-2 rounded-xl bg-primary/10">⏰</span>
              <h2 className="text-2xl font-black text-foreground">{t("oeffnungszeiten")}</h2>
            </div>

            <div className="mb-8 space-y-4 text-[17px] leading-relaxed text-muted-foreground">
              <p className="font-bold text-foreground text-xl">{t("zusaetzlich")}</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-secondary/5 border border-secondary/10">
                  <span className="block text-sm font-bold uppercase tracking-widest text-primary mb-2">Samstag</span>
                  <p className="text-foreground font-medium">{t("samstag")}</p>
                </div>
                <div className="p-6 rounded-2xl bg-secondary/5 border border-secondary/10">
                  <span className="block text-sm font-bold uppercase tracking-widest text-primary mb-2">Sonntag</span>
                  <p className="text-foreground font-medium">{t("sonntag")}</p>
                </div>
              </div>
            </div>

            <p className="mb-10 text-[17px] leading-relaxed text-muted-foreground font-medium">
              {t("besuchen")}
            </p>

            <a
              href="https://www.yumpu.com/de/document/read/70850661/flyer-inspiration-2025-brugnara"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl bg-primary px-8 py-4 text-[16px] font-bold text-white shadow-xl transition-all hover:scale-105 active:scale-95 no-underline"
            >
              <span className="relative z-10">{t("katalog")}</span>
              <svg className="relative z-10 h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-primary via-white/20 to-primary transition-transform duration-500 group-hover:translate-x-full" />
            </a>
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-[14px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">
            {t("placeholder")}
          </p>
        </div>
      </div>
    </div>
  );
}
