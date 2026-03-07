"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

const STATIC_OEFFNUNGSZEITEN = [
  { tag: "Mo-Fr", von1: "08:00", bis1: "12:00", von2: "14:30", bis2: "18:30", geschlossen: false },
  { tag: "Sa", von1: "08:00", bis1: "12:00", von2: null, bis2: null, geschlossen: false },
  { tag: "So", von1: null, bis1: null, von2: null, bis2: null, geschlossen: true },
];

export function MarketingFooter() {
  const t = useTranslations("Footer");

  return (
    <footer className="relative bg-[#080B12] pt-24 pb-12 overflow-hidden text-white/90 selection:bg-primary/30">
      {/* Decorative gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="absolute top-0 right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 z-0 opacity-[0.02]" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-12 border-b border-white/10 pb-20">
          
          {/* Brand Info (Span 5) */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <Link href="/" className="inline-block transition-transform duration-300 hover:-translate-y-1 w-fit">
              <Image
                src="/images/logo.png"
                alt="M. Brugnara Logo"
                width={180}
                height={90}
                className="h-auto w-[160px] brightness-0 invert opacity-90 transition-opacity hover:opacity-100"
              />
            </Link>
            <p className="max-w-sm text-[16px] leading-relaxed text-white/60 font-medium tracking-wide">
              Seit Generationen Ihr verlässlicher Fachhandel für Eisenwaren, Haushalt und Gartengeräte im Herzen von Meran.
            </p>
            <Link 
              href="/produkte" 
              className="group inline-flex items-center gap-3 text-[14px] font-bold uppercase tracking-widest text-white/80 transition-all hover:text-primary mt-2"
            >
              Zu den Produkten
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 transition-colors group-hover:bg-primary/20">
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </Link>
          </div>

          {/* Kontakt (Span 3) */}
          <div className="lg:col-span-4">
            <h3 className="mb-8 text-[13px] font-bold uppercase tracking-[0.25em] text-white/40">
              {t("kontakt")}
            </h3>
            <ul className="space-y-6 text-[16px] text-white/80 font-medium">
              <li className="flex gap-4">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-primary/80 transition-colors hover:bg-white/10">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="leading-relaxed text-white/70">{t("adresse")}</span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-primary/80 transition-colors group-hover:bg-primary/20 group-hover:text-primary">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <a href={`tel:${t("telefon")}`} className="transition-all text-white/70 group-hover:text-white group-hover:translate-x-1 inline-block">{t("telefon")}</a>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-primary/80 transition-colors group-hover:bg-primary/20 group-hover:text-primary">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <a href={`mailto:${t("email")}`} className="transition-all text-white/70 group-hover:text-white group-hover:translate-x-1 inline-block">{t("email")}</a>
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
                  <div key={zeit.tag} className="flex justify-between items-center text-[15px] border-b border-white/5 pb-4 last:border-0 last:pb-0">
                    <span className="font-bold text-white/90">{zeit.tag}</span>
                    <span className="text-white/60 font-medium">
                      {zeit.geschlossen ? (
                        <span className="flex items-center gap-2 text-rose-400/90 text-[12px] font-bold tracking-[0.15em] uppercase px-3 py-1 bg-rose-500/10 rounded-lg">
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                          {t("geschlossen")}
                        </span>
                      ) : (
                        <div className="flex items-center gap-3">
                          <span className="text-[14px]">
                            {zeit.von1 && zeit.bis1 ? `${zeit.von1.slice(0, 5)} - ${zeit.bis1.slice(0, 5)}` : null}
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
            <span className="hidden md:inline-block tracking-[0.15em] uppercase text-[11px] font-bold text-white/30">Meran</span>
          </div>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            <Link href="/marken" className="transition-colors hover:text-white">Marken</Link>
            <Link href="/news" className="transition-colors hover:text-white">News</Link>
            <Link href="/impressum" className="transition-colors hover:text-white">Datenschutz</Link>
            <Link href="/impressum" className="transition-colors hover:text-white">Impressum</Link>
            <Link href="/admin" className="transition-colors hover:text-primary">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
