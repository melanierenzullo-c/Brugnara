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
        {/* ═══ Category hero banner ═══ */}
        <section className="relative min-h-[40vh] flex items-center justify-center overflow-hidden bg-[#F6F7FB] pt-24 pb-16">
          <div className="absolute inset-0 z-0 opacity-[0.03]" />

          <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
            <nav className="mb-8 flex items-center gap-3 text-[12px] font-bold uppercase tracking-widest text-muted-foreground/60">
              <Link href="/" className="transition-colors hover:text-primary">
                {t("Home")}
              </Link>
              <span className="opacity-30">/</span>
              <Link href="/produkte" className="transition-colors hover:text-primary">
                {t("News")}
              </Link>
            </nav>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <h1 className="text-4xl sm:text-5xl font-medium text-foreground tracking-tight">{t("title")}</h1>
            </div>
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

                    <div className="flex flex-col sm:flex-row">
                      {item.imageUrl && (
                        <div className="relative w-full sm:w-72 shrink-0 aspect-[4/3] self-start overflow-hidden rounded-t-[1.5rem] sm:rounded-tr-none sm:rounded-l-[1.5rem]">
                          <Image
                            src={item.imageUrl}
                            alt={title}
                            fill
                            sizes="(max-width: 640px) 100vw, 288px"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      )}

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
                        <div className="news-content text-[17px] leading-relaxed text-muted-foreground font-medium">
                          {content.length > 200 ? (
                            <p>{plainText.slice(0, 200)}...</p>
                          ) : (
                            <div dangerouslySetInnerHTML={{ __html: content }} />
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <style jsx global>{`
        .news-content a {
          color: var(--primary);
          text-decoration: underline;
        }
        .news-content ul {
          list-style-type: disc;
          padding-left: 1.25rem;
          margin: 0.5rem 0;
        }
        .news-content ol {
          list-style-type: decimal;
          padding-left: 1.25rem;
          margin: 0.5rem 0;
        }
        .news-content h1, .news-content h2 {
          font-size: 1.1rem;
          font-weight: bold;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          color: var(--foreground);
        }
      `}</style>
    </div>
  );
}
