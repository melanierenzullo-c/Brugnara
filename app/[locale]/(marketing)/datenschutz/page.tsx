"use client";

import { useTranslations } from "next-intl";

export default function DatenschutzPage() {
  const t = useTranslations("Datenschutz");

  return (
    <div className="min-h-screen bg-[#fafbff]">
      {/* ═══ Header ═══ */}
      <section className="relative overflow-hidden bg-background pt-32 pb-20">
        <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 mb-6">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">{t("badge")}</span>
          </div>
          <h1 className="mb-6 text-4xl font-black tracking-tight text-foreground sm:text-6xl text-gradient">
            {t("title")}
          </h1>
        </div>
      </section>

      {/* ═══ Content ═══ */}
      <div className="mx-auto max-w-4xl px-6 pb-32">
        <div className="rounded-[2.5rem] bg-white border border-border/50 p-8 sm:p-12 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)]">
          <h2 className="mb-10 flex items-center gap-3 text-2xl font-black text-foreground">
            <span className="p-2 rounded-xl bg-primary/10">🛡️</span>
            {t("heading")}
          </h2>

          <div className="prose prose-slate max-w-none text-muted-foreground leading-relaxed">
            <p className="mb-8 font-medium">{t("gdprRef")}</p>

            <div className="space-y-10">
              <section>
                <h3 className="text-lg font-bold text-foreground mb-4">{t("section1Title")}</h3>
                <p>{t("section1Text")} <a href="mailto:info@brugnara.bz.it" className="text-primary hover:underline">info@brugnara.bz.it</a></p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-foreground mb-4">{t("section2Title")}</h3>
                <p>{t("section2Text")}</p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-foreground mb-4">{t("section3Title")}</h3>
                <p>{t("section3Text")}</p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-foreground mb-4">{t("section4Title")}</h3>
                <p>{t("section4Text")}</p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-foreground mb-4">{t("section5Title")}</h3>
                <p>{t("section5Intro")}</p>
                <ul className="mt-3 space-y-2 list-disc pl-6">
                  <li>{t("right1")}</li>
                  <li>{t("right2")}</li>
                  <li>{t("right3")}</li>
                  <li>{t("right4")}</li>
                  <li>{t("right5")}</li>
                  <li>{t("right6")}</li>
                </ul>
                <p className="mt-4">{t("section5Outro")} <a href="mailto:info@brugnara.bz.it" className="text-primary hover:underline">info@brugnara.bz.it</a></p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-foreground mb-4">{t("section6Title")}</h3>
                <p>{t("section6Text")}</p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-foreground mb-4">{t("section7Title")}</h3>
                <p>{t("section7Text")}</p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-foreground mb-4">{t("section8Title")}</h3>
                <p>{t("section8Text")} <a href="https://www.garanteprivacy.it" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">{t("section8Link")}</a>{t("section8End")}</p>
              </section>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border/50 text-sm italic opacity-60">
            {t("lastUpdated")}
          </div>
        </div>
      </div>
    </div>
  );
}
