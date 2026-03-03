"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function NewsPage() {
  const t = useTranslations("News");
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: { trigger: cardRef.current, start: "top 85%" },
        }
      );
    }
    return () => { ScrollTrigger.getAll().forEach((st) => st.kill()); };
  }, []);

  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      {/* Page header */}
      <div className="bg-white py-12">
        <div className="mx-auto max-w-4xl px-6">
          <h1 className="text-3xl font-bold text-[#3A537E]">News</h1>
          <p className="mt-2 text-[#6B7280]">{t("title")}</p>
        </div>
      </div>

      {/* News card */}
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div
          ref={cardRef}
          className="overflow-hidden rounded-2xl border-l-4 border-[#5A759E] bg-white p-8 shadow-sm"
        >
          <p className="mb-4 text-[16px] font-semibold leading-relaxed text-[#1A1A2E]">
            {t("oeffnungszeiten")}
          </p>
          <div className="mb-4 text-[15px] leading-[1.8] text-[#6B7280]">
            <p className="font-semibold text-[#1A1A2E]">{t("zusaetzlich")}</p>
            <p>{t("samstag")}</p>
            <p>{t("sonntag")}</p>
          </div>
          <p className="mb-6 text-[15px] leading-relaxed text-[#6B7280]">
            {t("besuchen")}
          </p>
          <a
            href="https://www.yumpu.com/de/document/read/70850661/flyer-inspiration-2025-brugnara"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-[#3A537E] px-5 py-2.5 text-[14px] font-semibold text-white no-underline transition-colors hover:bg-[#5A759E]"
          >
            {t("katalog")}
            <span>→</span>
          </a>
        </div>

        <p className="mt-12 text-center text-[14px] text-[#6B7280]">
          {t("placeholder")}
        </p>
      </div>
    </div>
  );
}
