"use client";

import { useTranslations } from "next-intl";

export default function CookiesPage() {
  const t = useTranslations("CookiesPage");

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
          <div className="prose prose-slate max-w-none text-muted-foreground leading-relaxed">
            <p className="mb-10 text-lg font-medium text-foreground/80">{t("intro")}</p>

            <div className="space-y-12">
              <section>
                <h2 className="mb-4 text-2xl font-black text-foreground flex items-center gap-3">
                  <span className="p-2 rounded-xl bg-primary/10">🍪</span>
                  {t("whatAreCookiesTitle")}
                </h2>
                <p>{t("whatAreCookiesText")}</p>
              </section>

              <section>
                <h2 className="mb-8 text-2xl font-black text-foreground flex items-center gap-3">
                  <span className="p-2 rounded-xl bg-primary/10">🔍</span>
                  {t("typesTitle")}
                </h2>
                
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="p-6 rounded-3xl bg-[#fafbff] border border-border/50 transition-all hover:border-primary/20 hover:shadow-sm">
                    <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                      {t("essentialTitle")}
                    </h3>
                    <p className="text-sm">{t("essentialText")}</p>
                  </div>

                  <div className="p-6 rounded-3xl bg-[#fafbff] border border-border/50 transition-all hover:border-primary/20 hover:shadow-sm">
                    <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                      {t("preferencesTitle")}
                    </h3>
                    <p className="text-sm">{t("preferencesText")}</p>
                  </div>

                  <div className="p-6 rounded-3xl bg-[#fafbff] border border-border/50 transition-all hover:border-primary/20 hover:shadow-sm">
                    <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-violet-500"></span>
                      {t("statisticsTitle")}
                    </h3>
                    <p className="text-sm">{t("statisticsText")}</p>
                  </div>

                  <div className="p-6 rounded-3xl bg-[#fafbff] border border-border/50 transition-all hover:border-primary/20 hover:shadow-sm">
                    <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                      {t("marketingTitle")}
                    </h3>
                    <p className="text-sm">{t("marketingText")}</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
