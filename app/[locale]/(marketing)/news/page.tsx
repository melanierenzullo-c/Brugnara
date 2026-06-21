"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useQuery } from "convex/react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "@/i18n/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

import { api } from "@/convex/_generated/api";
import type { Locale } from "@/i18n/routing";

export default function NewsPage() {
  const t = useTranslations("News");
  const locale = useLocale() as Locale;
  const newsItems = useQuery(api.news.listPublic);
  const [searchQuery, setSearchQuery] = useState("");
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const isSearching = searchQuery.trim().length > 0;

  const filteredNews = isSearching && newsItems
    ? newsItems.filter((item) => {
        const q = searchQuery.trim().toLowerCase();
        return (
          item.titel.toLowerCase().includes(q) ||
          item.titelIt.toLowerCase().includes(q)
        );
      })
    : newsItems;

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

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>?/gm, " ");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="min-h-screen bg-white">
        {/* ═══ Header ═══ */}
        <section className="relative overflow-hidden bg-[#F6F7FB] pt-1 sm:pt-38 pb-20">
          <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
            <h1 className="mb-4 text-4xl font-black tracking-tight text-foreground sm:text-6xl text-gradient leading-snug">
              {t("title")}
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              {t("subtitle")}
            </p>
          </div>
        </section>

        {/* ═══ News articles ═══ */}
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20 pb-40">
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

          {filteredNews === undefined ? (
            <div className="flex items-center justify-center py-20 text-muted-foreground text-sm gap-2">
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Laden…
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-lg text-muted-foreground">
                {isSearching ? t("searchNoResults") : t("placeholder")}
              </p>
            </div>
          ) : (
            <div ref={gridRef} className="space-y-8">
              {filteredNews.map((item) => {
                const title = locale === "it" ? item.titelIt : item.titel;
                const content = locale === "it" ? item.inhaltIt : item.inhalt;
                const plainText = stripHtml(content);

                return (
                  <article
                    key={item._id}
                    data-card
                    className="group premium-card bg-white"
                  >
                    <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                    <div className="flex flex-col">
                      {item.imageUrl && (
                        <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] overflow-hidden rounded-t-[1.5rem]">
                          <Image
                            src={item.imageUrl}
                            alt={title}
                            fill
                            sizes="(max-width: 1024px) 100vw, 1152px"
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>
                      )}

                      <div className="p-8 sm:p-12">
                        <div className="flex items-center gap-3 mb-6 text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                          <time dateTime={new Date(item.createdAt).toISOString()}>
                            {new Date(item.createdAt).toLocaleDateString(locale === "it" ? "it-IT" : "de-DE", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            })}
                          </time>
                        </div>
                        <h2 className="mb-6 text-3xl sm:text-4xl font-black text-foreground tracking-tight leading-[1.1]">{title}</h2>
                        <div 
                          className="prose-content text-[17px] sm:text-[19px] max-w-3xl"
                          dangerouslySetInnerHTML={{ __html: content }} 
                        />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
