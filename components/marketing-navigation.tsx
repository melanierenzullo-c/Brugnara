"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useParams } from "next/navigation";

const PRODUCT_CATEGORIES = [
  { slug: "eisenwaren", image: "/images/home/eisenwaren/1.jpg" },
  { slug: "haushaltsartikel", image: "/images/home/haushalt/1.jpg" },
  { slug: "werkzeug", image: "/images/home/werkzeug/1.jpg" },
  { slug: "elektrogeraete", image: "/images/home/elektrogeraete/1.jpg" },
  { slug: "gartengeraete", image: "/images/home/gartengeraete/1.jpg" },
  { slug: "oefen-herde", image: "/images/home/herde/1.jpg" },
] as const;

/** Languages available for switching */
const LANGUAGES = [
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
] as const;

export function MarketingNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const t = useTranslations("Navigation");
  const tCat = useTranslations("ProductCategories");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const switchLocale = () => {
    const newLocale = locale === "de" ? "it" : "de";
    if (params?.slug) {
      router.replace(
        { pathname: "/produkte/[slug]", params: { slug: params.slug as string } },
        { locale: newLocale }
      );
    } else {
      // @ts-expect-error -- dynamic pathname
      router.replace({ pathname }, { locale: newLocale });
    }
  };

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-50 mx-auto w-full transition-all duration-500 sm:top-4 sm:max-w-7xl sm:px-4 ${scrolled ? "sm:translate-y-0" : "sm:translate-y-2"
          }`}
      >
        <div
          className={`glass flex items-center justify-between px-6 py-2 transition-all duration-500 sm:rounded-2xl ${scrolled ? "bg-white/90 dark:bg-black/80" : "border-transparent bg-white/40 shadow-none dark:bg-transparent"
            }`}
        >
          {/* Logo */}
          <Link href="/" className="shrink-0 transition-transform hover:scale-105 active:scale-95">
            <Image
              src="/images/logoklein.png"
              alt="M. Brugnara GmbH"
              width={130}
              height={60}
              className="block h-12 w-auto sm:h-14"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {/* Produkte Mega-Dropdown */}
            <div
              className="group relative"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex cursor-pointer items-center gap-1.5 rounded-xl border-none bg-transparent px-4 py-2 text-[15px] font-medium text-foreground transition-all hover:bg-primary/5"
              >
                {t("produkte")}
                <svg
                  className={`h-3.5 w-3.5 transition-transform duration-300 ${dropdownOpen ? "rotate-180" : "group-hover:translate-y-0.5"}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown panel */}
              <div
                className={`absolute left-1/2 top-full pt-4 transition-all duration-300 ${dropdownOpen
                  ? "pointer-events-auto -translate-x-1/2 translate-y-0 opacity-100"
                  : "pointer-events-none -translate-x-1/2 -translate-y-4 opacity-0"
                  }`}
              >
                <div className="grid w-[640px] grid-cols-2 gap-2 rounded-3xl border border-border/50 bg-white/98 p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] backdrop-blur-2xl dark:bg-black/95">
                  <div className="col-span-2 px-3 pt-2 pb-2">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-muted-foreground/50">{t("produkte")}</p>
                  </div>
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={{ pathname: "/produkte/[slug]", params: { slug: cat.slug } }}
                      className="group/item flex items-center gap-4 rounded-2xl p-2.5 text-[14px] font-medium text-foreground no-underline transition-all duration-300 hover:bg-primary/5"
                      onClick={() => { setDropdownOpen(false); setMobileMenuOpen(false); }}
                    >
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-muted/30">
                        <Image
                          src={cat.image}
                          alt={tCat(cat.slug)}
                          fill
                          className="object-cover transition-transform duration-500 group-hover/item:scale-110"
                        />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-[14px] font-bold tracking-tight text-foreground">{tCat(cat.slug)}</span>
                        <span className="text-[11px] font-medium text-muted-foreground/60 transition-colors group-hover/item:text-primary">{t("entdecken")} →</span>
                      </div>
                    </Link>
                  ))}
                  <div className="col-span-2 mt-1 border-t border-border/30 pt-3 pb-1 px-3">
                    <Link
                      href="/produkte"
                      className="flex items-center justify-between rounded-xl px-3 py-2 text-[13px] font-bold text-primary no-underline transition-all hover:bg-primary/5"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Alle Produkte ansehen
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <Link href="/" className="rounded-xl px-4 py-2 text-[15px] font-medium text-foreground no-underline transition-all hover:bg-primary/5">
              {t("home")}
            </Link>

            {/* Language Switcher – Globe dropdown */}
            <div className="relative ml-4"
              onMouseEnter={() => setLangOpen(true)}
              onMouseLeave={() => setLangOpen(false)}
            >
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex cursor-pointer items-center gap-2 rounded-xl border border-border/40 bg-white/50 px-3 py-2 text-[13px] font-semibold text-foreground backdrop-blur-sm transition-all hover:bg-primary/5 hover:border-primary/20"
              >
                {/* Globe icon */}
                <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.6 9h16.8M3.6 15h16.8" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3a15 15 0 014 9 15 15 0 01-4 9 15 15 0 01-4-9 15 15 0 014-9z" />
                </svg>
                <span>{locale === "de" ? "Deutsch" : "Italiano"}</span>
                <svg className={`h-3 w-3 text-muted-foreground transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Language dropdown */}
              <div className={`absolute right-0 top-full pt-2 transition-all duration-200 ${langOpen ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"}`}>
                <div className="w-44 overflow-hidden rounded-2xl border border-border/50 bg-white/98 shadow-xl backdrop-blur-2xl dark:bg-black/95">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        if (locale !== lang.code) switchLocale();
                        setLangOpen(false);
                      }}
                      className={`flex w-full cursor-pointer items-center gap-3 border-none px-4 py-3 text-left text-[13px] font-semibold transition-all ${locale === lang.code
                          ? "bg-primary/5 text-primary"
                          : "bg-transparent text-foreground hover:bg-secondary/5"
                        }`}
                    >
                      <span className="text-base">{lang.flag}</span>
                      <span>{lang.label}</span>
                      {locale === lang.code && (
                        <svg className="ml-auto h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          {/* Hamburger */}
          <button
            className="group relative flex h-10 w-10 flex-col items-center justify-center gap-[5px] cursor-pointer border-none bg-primary/5 rounded-full lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menü"
          >
            <span className={`block h-[1.5px] w-5 rounded bg-foreground transition-all duration-300 ${mobileMenuOpen ? "translate-y-[6.5px] rotate-45" : ""}`} />
            <span className={`block h-[1.5px] w-4 rounded bg-foreground transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-[1.5px] w-5 rounded bg-foreground transition-all duration-300 ${mobileMenuOpen ? "-translate-y-[6.5px] -rotate-45" : ""}`} />
          </button>
        </div>

        {/* Mobile drawer */}
        <div className={`overflow-hidden transition-all duration-500 lg:hidden ${mobileMenuOpen ? "max-h-[600px] translate-y-2 opacity-100" : "max-h-0 -translate-y-4 opacity-0"}`}>
          <nav className="mx-4 mt-2 flex flex-col gap-1 rounded-3xl glass px-4 py-4 dark:bg-black/90">
            <Link href="/" className="rounded-2xl px-4 py-3 text-[15px] font-semibold text-foreground no-underline transition-all hover:bg-primary/5 active:scale-95" onClick={() => setMobileMenuOpen(false)}>{t("home")}</Link>

            <div className="mt-2 space-y-1">
              <p className="px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">{t("produkte")}</p>
              <div className="grid grid-cols-1 gap-1">
                {PRODUCT_CATEGORIES.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={{ pathname: "/produkte/[slug]", params: { slug: cat.slug } }}
                    className="flex items-center gap-3 rounded-2xl px-4 py-3 text-[14px] font-medium text-foreground no-underline transition-all hover:bg-primary/5 active:scale-95"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-muted/30">
                      <Image
                        src={cat.image}
                        alt={tCat(cat.slug)}
                        fill
                        className="object-cover"
                      />
                    </div>
                    {tCat(cat.slug)}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-4 border-t border-border/20 pt-4">
              <p className="px-4 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">Sprache</p>
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    if (locale !== lang.code) switchLocale();
                    setMobileMenuOpen(false);
                  }}
                  className={`flex w-full cursor-pointer items-center gap-3 rounded-xl border-none px-4 py-3 text-left text-[14px] font-semibold transition-all ${locale === lang.code
                      ? "bg-primary/5 text-primary"
                      : "bg-transparent text-foreground hover:bg-secondary/5"
                    }`}
                >
                  <span className="text-base">{lang.flag}</span>
                  <span>{lang.label}</span>
                  {locale === lang.code && (
                    <svg className="ml-auto h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </nav>
        </div>
      </header>
      <div className="h-[76px] sm:h-[100px]" />
    </>
  );
}
