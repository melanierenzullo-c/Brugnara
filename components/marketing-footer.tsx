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
    <footer className="bg-[#3A537E]">
      {/* Accent top border */}
      <div className="h-1 bg-[#A5BDD8]" />

      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-3">
        {/* Kontakt */}
        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#A5BDD8]">
            {t("kontakt")}
          </h3>
          <p className="text-[15px] leading-relaxed text-white/80">{t("adresse")}</p>
          <p className="text-[15px] leading-relaxed text-white/80">{t("telefon")}</p>
          <p className="text-[15px] leading-relaxed text-white/80">{t("email")}</p>
        </div>

        {/* Öffnungszeiten */}
        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#A5BDD8]">
            {t("oeffnungszeiten")}
          </h3>
          {STATIC_OEFFNUNGSZEITEN.map((zeit) => (
            <p key={zeit.tag} className="text-[15px] leading-relaxed text-white/80">
              <span className="font-semibold text-white">{zeit.tag}:</span>{" "}
              {zeit.geschlossen
                ? t("geschlossen")
                : [
                    zeit.von1 && zeit.bis1
                      ? `${zeit.von1.slice(0, 5)}–${zeit.bis1.slice(0, 5)}`
                      : null,
                    zeit.von2 && zeit.bis2
                      ? `${zeit.von2.slice(0, 5)}–${zeit.bis2.slice(0, 5)}`
                      : null,
                  ]
                    .filter(Boolean)
                    .join(", ")}
            </p>
          ))}
        </div>

        {/* Logo + Impressum */}
        <div className="flex flex-col items-start sm:items-end">
          <Image
            src="/images/logo.png"
            alt="M. Brugnara Logo"
            width={140}
            height={70}
            className="mb-4 h-auto w-[120px] brightness-0 invert"
          />
          <Link
            href="/impressum"
            className="text-[14px] text-white/60 underline-offset-4 transition-colors hover:text-white hover:underline"
          >
            {t("impressum")}
          </Link>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-white/10 px-6 py-4 text-center text-[13px] text-white/40">
        © {new Date().getFullYear()} M. Brugnara GmbH. Alle Rechte vorbehalten.
      </div>
    </footer>
  );
}
