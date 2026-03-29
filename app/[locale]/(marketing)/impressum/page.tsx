"use client";

import { useTranslations } from "next-intl";

export default function ImpressumPage() {
  const t = useTranslations("Impressum");

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
            <span className="p-2 rounded-xl bg-primary/10">📄</span>
            {t("title")}
          </h2>
          <div className="grid sm:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div>
                <span className="block text-[11px] font-black uppercase tracking-[0.2em] text-primary mb-2">{t("companyLabel")}</span>
                <p className="text-lg font-bold text-foreground">{t("companyName")}</p>
                <p className="text-muted-foreground">{t("companyAddress")}</p>
              </div>
              <address className="not-italic">
                <span className="block text-[11px] font-black uppercase tracking-[0.2em] text-primary mb-2">{t("contactLabel")}</span>
                <p className="text-foreground font-medium">{t("phone")}</p>
                <p className="text-foreground font-medium">{t("email")}</p>
              </address>
            </div>
            <div className="space-y-6">
              <div>
                <span className="block text-[11px] font-black uppercase tracking-[0.2em] text-primary mb-2">{t("taxLabel")}</span>
                <p className="text-muted-foreground">{t("vatNumber")}</p>
                <p className="text-muted-foreground">{t("registry")}</p>
              </div>
              <div>
                <span className="block text-[11px] font-black uppercase tracking-[0.2em] text-primary mb-2">{t("responsibilityLabel")}</span>
                <p className="text-foreground font-medium text-lg">{t("responsiblePerson")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
