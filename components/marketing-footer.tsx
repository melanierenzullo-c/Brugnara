"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

const STATIC_OEFFNUNGSZEITEN = [
  { tag: "mondayToFriday", von1: "08:00", bis1: "12:00", von2: "14:30", bis2: "18:30", geschlossen: false },
  { tag: "saturday", von1: "08:00", bis1: "12:00", von2: null, bis2: null, geschlossen: false },
  { tag: "sunday", von1: null, bis1: null, von2: null, bis2: null, geschlossen: true },
];

export function MarketingFooter() {
  const t = useTranslations("Footer");

  return (
    <footer className="bg-[#F6F7FB] text-[#1F2937]">

      {/* ── Main body ── */}
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-14 py-16 lg:grid-cols-12 lg:gap-10">

          {/* Brand */}
          <div className="flex flex-col gap-7 lg:col-span-4">
            <Link href="/" className="w-fit transition-opacity hover:opacity-60">
              <Image
                src="/images/logo.png"
                alt="M. Brugnara Logo"
                width={150}
                height={75}
                className="h-auto w-[140px]"
              />
            </Link>

            <p className="max-w-[280px] text-[15px] leading-relaxed text-[#1F2937]">
              {t("description")}
            </p>

            {/* Socials */}
            <div className="flex items-center gap-4">
              <a href="https://www.instagram.com/brugnara_eisenwaren?igsh=MTZwMGdvaDd6N211MA==" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-[#6B7280] transition-colors hover:text-[#E1306C]">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
              </a>
              <a href="https://www.facebook.com/www.brugnara.net/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-[#6B7280] transition-colors hover:text-[#1877F2]">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.256h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" /></svg>
              </a>
              <a href="https://www.ebay.it/usr/m.brugnara?_trksid=p4429486.m3561.l49544" target="_blank" rel="noopener noreferrer" aria-label="eBay" className="text-[#6B7280] transition-colors hover:text-[#F5C518]">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.563 13.016c0 2.946 2.242 4.39 5.05 4.39 2.957 0 4.077-1.675 4.077-1.675h.05s-.025.24-.025.528v.974h2.19V8.988c0-2.79-1.906-4.137-4.67-4.137-2.646 0-4.532 1.425-4.532 1.425l.975 1.726s1.55-1.178 3.382-1.178c1.575 0 2.52.784 2.52 2.307v.35H8.1C4.247 9.48.563 10.576.563 13.016zm8.907-.3v.593s-.91 1.601-2.86 1.601c-1.3 0-2.148-.695-2.148-1.726 0-1.783 2.382-2.077 5.008-2.077v1.61zm4.647-7.704h2.385l2.41 6.963 2.31-6.963H23.5l-4.252 11.21h-2.385L13.117 5.012z" /></svg>
              </a>
            </div>

            <Link
              href="/produkte"
              className="group inline-flex w-fit items-center gap-2 text-[13px] font-bold uppercase tracking-[0.2em] text-[#264D68] transition-opacity hover:text-[#1F2937]"
            >
              {t("toProducts")}
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Nav columns */}
          <div className="grid grid-cols-1 gap-10 lg:col-span-4 lg:gap-8">
            {/* Kontakt */}
            <div className="text-center">
              <p className="mb-5 text-[11px] font-black uppercase tracking-[0.25em] text-[#264D68]">
                {t("kontakt")}
              </p>
              <ul className="space-y-3">
                <li>
                  <a href="https://maps.google.com/?q=Romstraße+31/A,+Meran" target="_blank" rel="noopener noreferrer"
                    className="text-[15px] text-[#264D68] transition-colors hover:text-[#1F2937]">
                    {t("adresse")}
                  </a>
                </li>
                <li>
                  <a href="tel:+390473232755" className="text-[15px] text-[#264D68] transition-colors hover:text-[#1F2937]">
                    {t("telefon")}
                  </a>
                </li>
                <li>
                  <a href="mailto:info@brugnara.bz.it" className="text-[15px] text-[#264D68] transition-colors hover:text-[#1F2937]">
                    {t("email")}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Öffnungszeiten */}
          <div className="lg:col-span-4">
            <p className="mb-5 text-[11px] font-black uppercase tracking-[0.25em] text-[#264D68]">
              {t("oeffnungszeiten")}
            </p>
            <div className="space-y-3">
              {STATIC_OEFFNUNGSZEITEN.map((zeit) => (
                <div key={zeit.tag} className="flex items-center justify-between gap-4">
                  <span className="text-[15px] font-semibold text-[#1F2937]">
                    {t(zeit.tag)}
                  </span>
                  {zeit.geschlossen ? (
                    <span className="text-[13px] font-bold uppercase tracking-[0.15em] text-[#F87171]">
                      {t("geschlossen")}
                    </span>
                  ) : (
                    <div className="flex items-center gap-3 tabular-nums text-[14px] text-[#1F2937]">
                      {zeit.von1 && zeit.bis1 && <span>{zeit.von1}–{zeit.bis1}</span>}
                      {zeit.von2 && zeit.bis2 && (
                        <>
                          <span className="text-[#2A2D35]">·</span>
                          <span>{zeit.von2}–{zeit.bis2}</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="flex flex-col gap-4 border-t border-[#2A2D35] py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] text-[#1F2937]">
            © {new Date().getFullYear()} M. Brugnara GmbH
            <span className="mx-3 text-[#264D68]">|</span>
            <span className="text-[11px] font-bold uppercase tracking-[0.15em]">{t("city")}</span>
          </p>
          <div className="flex flex-wrap items-center gap-4 text-[13px] text-[#264D68]">
            <Link href="/datenschutz" className="transition-colors hover:text-[#1F2937]">
              {t("datenschutz")}
            </Link>
            <Link href="/cookies" className="transition-colors hover:text-[#1F2937]">
              {t("cookies")}
            </Link>
            <Link href="/impressum" className="transition-colors hover:text-[#1F2937]">
              {t("impressum")}
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/brugnara_eisenwaren?igsh=MTZwMGdvaDd6N211MA=="
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-[#1F2937] transition-colors hover:text-[#E1306C]"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
            </a>
            <a
              href="https://www.facebook.com/www.brugnara.net/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-[#1F2937] transition-colors hover:text-[#1877F2]"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.256h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" /></svg>
            </a>
            <a
              href="https://www.ebay.it/usr/m.brugnara?_trksid=p4429486.m3561.l49544"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="eBay"
              className="text-[#1F2937] transition-colors hover:text-[#F5C518]"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.563 13.016c0 2.946 2.242 4.39 5.05 4.39 2.957 0 4.077-1.675 4.077-1.675h.05s-.025.24-.025.528v.974h2.19V8.988c0-2.79-1.906-4.137-4.67-4.137-2.646 0-4.532 1.425-4.532 1.425l.975 1.726s1.55-1.178 3.382-1.178c1.575 0 2.52.784 2.52 2.307v.35H8.1C4.247 9.48.563 10.576.563 13.016zm8.907-.3v.593s-.91 1.601-2.86 1.601c-1.3 0-2.148-.695-2.148-1.726 0-1.783 2.382-2.077 5.008-2.077v1.61zm4.647-7.704h2.385l2.41 6.963 2.31-6.963H23.5l-4.252 11.21h-2.385L13.117 5.012z" /></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
