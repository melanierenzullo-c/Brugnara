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
    <footer className="relative border-t border-border/10 bg-[#05070A] pt-20 pb-10 overflow-hidden text-white/90">
      {/* Decorative gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none opacity-50" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none opacity-50" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-12 lg:px-16">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-8 border-b border-white/10 pb-16">

          {/* Brand Info (Span 5) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <Link href="/" className="inline-block transition-transform hover:scale-105 active:scale-95 w-fit">
              <Image
                src="/images/logo.png"
                alt="M. Brugnara Logo"
                width={180}
                height={90}
                className="h-auto w-[150px] brightness-0 invert"
              />
            </Link>
            <p className="max-w-md text-[15px] leading-relaxed text-white/60">
              Seit Generationen Ihr verlässlicher Fachhandel für Eisenwaren, Haushalt, Gartengeräte und mehr im Herzen von Meran.
              Qualität und kompetente Beratung stehen bei uns an erster Stelle.
            </p>
            <div className="mt-2 flex gap-4">
              <Link href="/produkte" className="text-[13px] font-bold uppercase tracking-widest text-primary hover:text-white transition-colors">
                Entdecken Sie unsere Produkte →
              </Link>
            </div>
          </div>

          {/* Kontakt (Span 3) */}
          <div className="lg:col-span-3">
            <h3 className="mb-6 text-[12px] font-bold uppercase tracking-[0.2em] text-white/50">
              {t("kontakt")}
            </h3>
            <ul className="space-y-4 text-[15px] text-white/80">
              <li className="flex items-start gap-3">
                <span className="text-primary/70">📍</span>
                <span>{t("adresse")}</span>
              </li>
              <li className="flex items-center gap-3 relative group w-fit">
                <span className="text-primary/70">📞</span>
                <a href={`tel:${t("telefon")}`} className="transition-colors hover:text-white">{t("telefon")}</a>
                <span className="absolute -bottom-1 left-7 w-0 h-[1px] bg-primary transition-all group-hover:w-[calc(100%-28px)]" />
              </li>
              <li className="flex items-center gap-3 relative group w-fit">
                <span className="text-primary/70">✉️</span>
                <a href={`mailto:${t("email")}`} className="transition-colors hover:text-white">{t("email")}</a>
                <span className="absolute -bottom-1 left-7 w-0 h-[1px] bg-primary transition-all group-hover:w-[calc(100%-28px)]" />
              </li>
            </ul>
          </div>

          {/* Öffnungszeiten (Span 4) */}
          <div className="lg:col-span-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
              <h3 className="mb-5 text-[12px] font-bold uppercase tracking-[0.2em] text-white/50">
                {t("oeffnungszeiten")}
              </h3>
              <div className="flex flex-col gap-3">
                {STATIC_OEFFNUNGSZEITEN.map((zeit) => (
                  <div key={zeit.tag} className="flex justify-between items-center text-[14px] border-b border-white/5 pb-2 last:border-0 last:pb-0">
                    <span className="font-semibold text-white/90">{zeit.tag}</span>
                    <span className="text-white/60">
                      {zeit.geschlossen ? (
                        <span className="text-red-400/80 font-medium text-[13px] tracking-wider uppercase">{t("geschlossen")}</span>
                      ) : (
                        [
                          zeit.von1 && zeit.bis1 ? `${zeit.von1.slice(0, 5)}–${zeit.bis1.slice(0, 5)}` : null,
                          zeit.von2 && zeit.bis2 ? `${zeit.von2.slice(0, 5)}–${zeit.bis2.slice(0, 5)}` : null
                        ].filter(Boolean).join("  |  ")
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-[13px] font-medium text-white/40">
          <div className="flex items-center gap-6">
            <span>© {new Date().getFullYear()} M. Brugnara GmbH</span>
            <span className="hidden md:inline-block w-1 h-1 rounded-full bg-white/20" />
            <span className="tracking-widest uppercase text-[10px]">Designed in Südtirol</span>
          </div>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            <Link href="/impressum" className="hover:text-white transition-colors">Datenschutz</Link>
            <Link href="/impressum" className="hover:text-white transition-colors">Impressum</Link>
            <Link href="/marken" className="hover:text-white transition-colors">Marken</Link>
            <Link href="/news" className="hover:text-white transition-colors">News</Link>
            <Link href="/admin" className="hover:text-white transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
