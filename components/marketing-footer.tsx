"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

const STATIC_OEFFNUNGSZEITEN = [
  {
    tag: "mondayToFriday",
    von1: "08:00",
    bis1: "12:00",
    von2: "14:30",
    bis2: "18:30",
    geschlossen: false,
  },
  {
    tag: "saturday",
    von1: "08:00",
    bis1: "12:00",
    von2: null,
    bis2: null,
    geschlossen: false,
  },
  {
    tag: "sunday",
    von1: null,
    bis1: null,
    von2: null,
    bis2: null,
    geschlossen: true,
  },
];

export function MarketingFooter() {
  const t = useTranslations("Footer");

  return (
    <footer className="relative bg-[#080B12] pt-24 pb-12 overflow-hidden text-white/90 selection:bg-primary/30">
      {/* Decorative gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="absolute top-0 right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[150px] pointer-events-none" />
      <div
        className="absolute inset-0 z-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-12 border-b border-white/10 pb-16 lg:pb-20">
          {/* Brand Info (Span 5) */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <Link
              href="/"
              className="inline-block transition-transform duration-300 hover:-translate-y-1 w-fit"
            >
              <Image
                src="/images/logo.png"
                alt="M. Brugnara Logo"
                width={180}
                height={90}
                className="h-auto w-[160px] brightness-0 invert opacity-90 transition-opacity hover:opacity-100"
              />
            </Link>
            <p className="max-w-sm text-[16px] leading-relaxed text-white/60 font-medium tracking-wide">
              {t("description")}
            </p>
            <Link
              href="/produkte"
              className="group inline-flex items-center gap-3 text-[14px] font-bold uppercase tracking-widest text-white/80 transition-all hover:text-primary mt-2"
            >
              {t("toProducts")}
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 transition-colors group-hover:bg-primary/20">
                <svg
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </span>
            </Link>

            {/* Social Links */}
            <div className="flex items-center gap-3 mt-2">
              <a
                href="https://www.instagram.com/brugnara_eisenwaren?igsh=MTZwMGdvaDd6N211MA=="
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white/50 transition-all hover:bg-pink-500/20 hover:text-pink-400"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/www.brugnara.net/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white/50 transition-all hover:bg-blue-500/20 hover:text-blue-400"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.256h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://www.ebay.it/usr/m.brugnara?_trksid=p4429486.m3561.l49544"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="eBay"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white/50 transition-all hover:bg-yellow-500/20 hover:text-yellow-400"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M.563 13.016c0 2.946 2.242 4.39 5.05 4.39 2.957 0 4.077-1.675 4.077-1.675h.05s-.025.24-.025.528v.974h2.19V8.988c0-2.79-1.906-4.137-4.67-4.137-2.646 0-4.532 1.425-4.532 1.425l.975 1.726s1.55-1.178 3.382-1.178c1.575 0 2.52.784 2.52 2.307v.35H8.1C4.247 9.48.563 10.576.563 13.016zm8.907-.3v.593s-.91 1.601-2.86 1.601c-1.3 0-2.148-.695-2.148-1.726 0-1.783 2.382-2.077 5.008-2.077v1.61zm4.647-7.704h2.385l2.41 6.963 2.31-6.963H23.5l-4.252 11.21h-2.385L13.117 5.012z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Kontakt (Span 3) */}
          <div className="lg:col-span-4">
            <h3 className="mb-8 text-[13px] font-bold uppercase tracking-[0.25em] text-white/40">
              {t("kontakt")}
            </h3>
            <ul className="space-y-6 text-[16px] text-white/80 font-medium">
              <li className="flex gap-4">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-primary/80 transition-colors hover:bg-white/10">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <span className="leading-relaxed text-white/70">
                  {t("adresse")}
                </span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-primary/80 transition-colors group-hover:bg-primary/20 group-hover:text-primary">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <a
                  href="tel:+390473232755"
                  className="transition-all text-white/70 group-hover:text-white group-hover:translate-x-1 inline-block"
                >
                  {t("telefon")}
                </a>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-primary/80 transition-colors group-hover:bg-primary/20 group-hover:text-primary">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <a
                  href="mailto:info@brugnara.bz.it"
                  className="transition-all text-white/70 group-hover:text-white group-hover:translate-x-1 inline-block"
                >
                  {t("email")}
                </a>
              </li>
            </ul>
          </div>

          {/* Öffnungszeiten (Span 4) */}
          <div className="lg:col-span-4">
            <h3 className="mb-8 text-[13px] font-bold uppercase tracking-[0.25em] text-white/40">
              {t("oeffnungszeiten")}
            </h3>
            <div className="rounded-[1.5rem] border border-white/5 bg-white/[0.02] p-6 backdrop-blur-xl shadow-2xl">
              <div className="flex flex-col gap-4">
                {STATIC_OEFFNUNGSZEITEN.map((zeit) => (
                  <div
                    key={zeit.tag}
                    className="flex justify-between items-center text-[15px] border-b border-white/5 pb-4 last:border-0 last:pb-0"
                  >
                    <span className="font-bold text-white/90">
                      {t(zeit.tag)}
                    </span>
                    <span className="text-white/60 font-medium">
                      {zeit.geschlossen ? (
                        <span className="flex items-center gap-2 text-rose-400/90 text-[12px] font-bold tracking-[0.15em] uppercase px-3 py-1 rounded-lg">
                          {t("geschlossen")}
                        </span>
                      ) : (
                        <div className="flex items-center gap-3">
                          <span className="text-[14px]">
                            {zeit.von1 && zeit.bis1
                              ? `${zeit.von1.slice(0, 5)} - ${zeit.bis1.slice(0, 5)}`
                              : null}
                          </span>
                          {zeit.von2 && zeit.bis2 && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-white/20" />
                              <span className="text-[14px]">{`${zeit.von2.slice(0, 5)} - ${zeit.bis2.slice(0, 5)}`}</span>
                            </>
                          )}
                        </div>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 flex flex-col md:flex-row justify-between items-center gap-8 text-[14px] font-medium text-white/40">
          <div className="flex items-center gap-4">
            <span>© {new Date().getFullYear()} M. Brugnara GmbH</span>
            <span className="hidden md:inline-block w-1.5 h-1.5 rounded-full bg-primary/40" />
            <span className="hidden md:inline-block tracking-[0.15em] uppercase text-[11px] font-bold text-white/30">
              {t("city")}
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            <Link href="/news" className="transition-colors hover:text-white">
              {t("news")}
            </Link>
            <Link
              href="/kontakt"
              className="transition-colors hover:text-white"
            >
              {t("kontakt")}
            </Link>
            <Link
              href="/datenschutz"
              className="transition-colors hover:text-white"
            >
              {t("datenschutz")}
            </Link>
            <Link
              href="/impressum"
              className="transition-colors hover:text-white"
            >
              {t("impressum")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
