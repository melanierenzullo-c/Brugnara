"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { use, useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Locale } from "@/i18n/routing";

const CATEGORY_MAP: Record<string, string> = {
  eisenwaren: "eisenwaren",
  haushaltsartikel: "haushaltsartikel",
  werkzeug: "werkzeug",
  elektrogeraete: "elektrogeraete",
  gartengeraete: "gartengeraete",
  "oefen-herde": "oefen-herde",
};

interface LocalizedString {
  de: string;
  it: string;
}

interface ProductData {
  name: LocalizedString;
  beschreibung: LocalizedString;
  foto: string;
}

const STATIC_PRODUKTE: Record<string, ProductData[]> = {
  eisenwaren: [
    { name: { de: "Vorhangschlösser", it: "Lucchetti" }, beschreibung: { de: "Robuste und zuverlässige Schlösser für Schutz und Sicherheit.", it: "Lucchetti robusti e affidabili per protezione e sicurezza." }, foto: "1765552153_Schlösser.jpeg" },
    { name: { de: "Schlüsselanhänger", it: "Portachiavi" }, beschreibung: { de: "Praktisch und stilvoll – perfekt, um Schlüssel sicher zu organisieren.", it: "Pratici e stilosi – perfetti per organizzare le chiavi in modo sicuro." }, foto: "1765553526_Schlüsselanhänger.jpeg" },
    { name: { de: "Taschenlampen", it: "Torce" }, beschreibung: { de: "Helle und zuverlässige Lichtquelle für Zuhause, Outdoor oder Notfälle.", it: "Fonte di luce brillante e affidabile per casa, outdoor o emergenze." }, foto: "1765553682_Taschenlampen .jpeg" },
    { name: { de: "Atac", it: "Atac" }, beschreibung: { de: "Vielseitige Befestigungslösungen für Holz, Metall, Kunststoff und mehr.", it: "Soluzioni di fissaggio versatili per legno, metallo, plastica e altro." }, foto: "1765555041_Atack.jpeg" },
  ],
  werkzeug: [
    { name: { de: "Schraubenzieher", it: "Cacciaviti" }, beschreibung: { de: "Präzise und langlebige Werkzeuge für Heim und Profi.", it: "Strumenti precisi e durevoli per casa e professionisti." }, foto: "1765552411_Schraubenzieher.jpeg" },
    { name: { de: "Steckschlüsselsatz", it: "Set di chiavi a bussola" }, beschreibung: { de: "Robuste und vielseitige Steckschlüssel.", it: "Chiavi a bussola robuste e versatili." }, foto: "1765556528_Set .jpeg" },
    { name: { de: "Inbusschlüssel Set", it: "Set chiavi a brugola" }, beschreibung: { de: "Robustes und praktisches Set für präzise Schraubarbeiten.", it: "Set robusto e pratico per lavori di avvitamento precisi." }, foto: "1765635276_Imbusschlüsselset.jpeg" },
  ],
  gartengeraete: [
    { name: { de: "Gartenhandschuhe", it: "Guanti da giardino" }, beschreibung: { de: "Bequeme und robuste Handschuhe zum Schutz bei Gartenarbeiten.", it: "Guanti comodi e robusti per la protezione durante i lavori in giardino." }, foto: "1765635778_Handschuhe .jpeg" },
  ],
  haushaltsartikel: [
    { name: { de: "Servietten", it: "Tovaglioli" }, beschreibung: { de: "Praktische und saugfähige Servietten.", it: "Tovaglioli pratici e assorbenti." }, foto: "1765635879_Servietten .jpeg" },
    { name: { de: "Stechformen für Kekse", it: "Formine per biscotti" }, beschreibung: { de: "Praktische Ausstechformen zum Backen.", it: "Formine pratiche per preparare biscotti." }, foto: "1765636075_Stechformen .jpeg" },
    { name: { de: "Glücksbringer", it: "Portafortuna" }, beschreibung: { de: "Kleine Geschenkideen mit symbolischer Bedeutung.", it: "Piccole idee regalo dal significato simbolico." }, foto: "1765636135_Glücksbringer.jpeg" },
  ],
  elektrogeraete: [],
  "oefen-herde": [],
};

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProduktePage({ params }: ProductPageProps) {
  const { slug } = use(params);
  const t = useTranslations("Products");
  const tCat = useTranslations("ProductCategories");
  const locale = useLocale() as Locale;
  const gridRef = useRef<HTMLDivElement>(null);

  const categoryKey = CATEGORY_MAP[slug] ?? slug;
  const categoryName = tCat(categoryKey);
  const produkte = STATIC_PRODUKTE[slug] ?? [];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (gridRef.current) {
      const cards = gridRef.current.querySelectorAll("[data-card]");
      gsap.fromTo(
        cards,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 85%",
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      {/* Category hero banner */}
      <div className="relative flex h-[30vh] items-end overflow-hidden bg-[#3A537E]">
        <div className="absolute inset-0 bg-gradient-to-t from-[#3A537E] to-[#5A759E]" />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-8">
          {/* Breadcrumb */}
          <nav className="mb-3 flex items-center gap-2 text-[14px] text-white/60">
            <Link href="/" className="text-white/60 no-underline transition-colors hover:text-white">
              {t("breadcrumbHome")}
            </Link>
            <span>|</span>
            <span>{t("breadcrumbProdukte")}</span>
            <span>|</span>
            <span className="font-semibold text-white">{categoryName}</span>
          </nav>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            {categoryName}
          </h1>
        </div>
      </div>

      {/* Product grid */}
      <div className="mx-auto max-w-6xl px-6 py-12">
        {produkte.length === 0 ? (
          <p className="py-20 text-center text-lg text-[#6B7280]">
            {t("noProducts")}
          </p>
        ) : (
          <div ref={gridRef} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {produkte.map((produkt, index) => (
              <div
                key={index}
                data-card
                className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex aspect-[4/3] w-full items-center justify-center bg-gray-50">
                  <span className="text-gray-300">📷 {produkt.name[locale]}</span>
                </div>
                <div className="p-5">
                  <h4 className="mb-2 text-lg font-bold text-[#1A1A2E]">
                    {produkt.name[locale]}
                  </h4>
                  <p className="text-[14px] leading-relaxed text-[#6B7280]">
                    {produkt.beschreibung[locale]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
