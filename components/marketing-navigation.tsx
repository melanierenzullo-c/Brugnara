"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useParams } from "next/navigation";

const PRODUCT_CATEGORIES = [
  { slug: "eisenwaren" },
  { slug: "haushaltsartikel" },
  { slug: "werkzeug" },
  { slug: "elektrogeraete" },
  { slug: "gartengeraete" },
  { slug: "oefen-herde" },
] as const;

export function MarketingNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const t = useTranslations("Navigation");
  const tCat = useTranslations("ProductCategories");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
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
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-md" : "bg-white/95 backdrop-blur-md"
          }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src="/images/logoklein.png"
              alt="M. Brugnara GmbH"
              width={130}
              height={60}
              className="block h-14 w-auto"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            <Link href="/" className="rounded-lg px-4 py-2 text-[15px] font-semibold text-[#3A537E] no-underline transition-colors hover:bg-[#F4F6F9]">
              {t("home")}
            </Link>

            {/* Produkte Mega-Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex cursor-pointer items-center gap-1 rounded-lg border-none bg-transparent px-4 py-2 text-[15px] font-semibold text-[#3A537E] transition-colors hover:bg-[#F4F6F9]"
              >
                {t("produkte")}
                <svg
                  className={`h-4 w-4 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown panel */}
              <div
                className={`absolute left-1/2 top-full pt-2 transition-all duration-200 ${dropdownOpen
                    ? "pointer-events-auto -translate-x-1/2 translate-y-0 opacity-100"
                    : "pointer-events-none -translate-x-1/2 -translate-y-2 opacity-0"
                  }`}
              >
                <div className="grid w-[480px] grid-cols-2 gap-1 rounded-2xl border border-gray-100 bg-white p-3 shadow-2xl">
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={{ pathname: "/produkte/[slug]", params: { slug: cat.slug } }}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-[14px] font-medium text-[#3A537E] no-underline transition-colors hover:bg-[#F4F6F9]"
                      onClick={() => { setDropdownOpen(false); setMobileMenuOpen(false); }}
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#5A759E]/10 text-[16px]">
                        {cat.slug === "eisenwaren" ? "🔧" :
                          cat.slug === "haushaltsartikel" ? "🏠" :
                            cat.slug === "werkzeug" ? "🛠️" :
                              cat.slug === "elektrogeraete" ? "⚡" :
                                cat.slug === "gartengeraete" ? "🌿" : "🔥"}
                      </span>
                      {tCat(cat.slug)}
                    </Link>
                  ))}
                </div>
              </div>
            </div>



            {/* Language Toggle */}
            <div className="ml-4 flex overflow-hidden rounded-full border border-[#3A537E]/15 bg-[#F4F6F9]">
              <button
                onClick={locale === "it" ? switchLocale : undefined}
                className={`cursor-pointer border-none px-3.5 py-1.5 text-[12px] font-bold tracking-wide transition-all duration-200 ${locale === "de" ? "bg-[#3A537E] text-white shadow-sm" : "bg-transparent text-[#3A537E]/60 hover:text-[#3A537E]"
                  }`}
              >
                DE
              </button>
              <button
                onClick={locale === "de" ? switchLocale : undefined}
                className={`cursor-pointer border-none px-3.5 py-1.5 text-[12px] font-bold tracking-wide transition-all duration-200 ${locale === "it" ? "bg-[#3A537E] text-white shadow-sm" : "bg-transparent text-[#3A537E]/60 hover:text-[#3A537E]"
                  }`}
              >
                IT
              </button>
            </div>
          </nav>

          {/* Hamburger */}
          <button
            className="flex flex-col gap-[5px] cursor-pointer border-none bg-transparent p-2 lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menü"
          >
            <span className={`block h-[2px] w-[22px] rounded bg-[#3A537E] transition-all duration-300 ${mobileMenuOpen ? "translate-y-[7px] rotate-45" : ""}`} />
            <span className={`block h-[2px] w-[22px] rounded bg-[#3A537E] transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-[2px] w-[22px] rounded bg-[#3A537E] transition-all duration-300 ${mobileMenuOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
          </button>
        </div>

        {/* Mobile drawer */}
        <div className={`overflow-hidden bg-white transition-all duration-300 lg:hidden ${mobileMenuOpen ? "max-h-[600px] border-t border-gray-100" : "max-h-0"}`}>
          <nav className="flex flex-col gap-1 px-6 py-4">
            <Link href="/" className="rounded-lg px-4 py-3 text-[15px] font-semibold text-[#3A537E] no-underline hover:bg-[#F4F6F9]" onClick={() => setMobileMenuOpen(false)}>{t("home")}</Link>
            <p className="px-4 pt-3 pb-1 text-[12px] font-bold uppercase tracking-wider text-[#5A759E]/60">{t("produkte")}</p>
            {PRODUCT_CATEGORIES.map((cat) => (
              <Link key={cat.slug} href={{ pathname: "/produkte/[slug]", params: { slug: cat.slug } }} className="rounded-lg px-4 py-2.5 pl-8 text-[14px] text-[#3A537E] no-underline hover:bg-[#F4F6F9]" onClick={() => setMobileMenuOpen(false)}>
                {tCat(cat.slug)}
              </Link>
            ))}

            <div className="mt-2 flex gap-2 px-4">
              <button onClick={locale === "it" ? switchLocale : undefined} className={`cursor-pointer rounded-full border-none px-4 py-2 text-[13px] font-bold ${locale === "de" ? "bg-[#3A537E] text-white" : "bg-[#F4F6F9] text-[#3A537E]"}`}>DE</button>
              <button onClick={locale === "de" ? switchLocale : undefined} className={`cursor-pointer rounded-full border-none px-4 py-2 text-[13px] font-bold ${locale === "it" ? "bg-[#3A537E] text-white" : "bg-[#F4F6F9] text-[#3A537E]"}`}>IT</button>
            </div>
          </nav>
        </div>
      </header>
      <div className="h-[76px]" />
    </>
  );
}
