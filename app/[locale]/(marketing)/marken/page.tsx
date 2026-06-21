import { useTranslations } from "next-intl";

export default function MarkenPage() {
  const t = useTranslations("Marken");

  return (
    <div className="min-h-screen bg-background">
      {/* ═══ Header ═══ */}
      <section className="relative overflow-hidden bg-[#F6F7FB] pt-1 sm:pt-38 pb-20">
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-foreground sm:text-6xl text-gradient">
            {t("title")}
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            {t("content")}
          </p>
        </div>
      </section>

      {/* ═══ Brands Grid ═══ */}
      <section className="relative py-20 px-6 bg-[#fafbff]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 bg-gradient-to-r from-transparent via-border to-transparent" />

        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Placeholder for real brand cards */}
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="group flex aspect-[3/2] items-center justify-center rounded-[2rem] border border-border/50 bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] hover:border-primary/20"
              >
                <div className="text-center">
                  <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/30 mb-2">Partner Brand</span>
                  <div className="h-8 w-32 rounded-full bg-secondary/10 animate-pulse" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center rounded-[2rem] bg-secondary/5 border border-secondary/10 p-12">
            <p className="mx-auto max-w-xl text-muted-foreground font-medium italic">
              "Wir arbeiten nur mit den besten Herstellern zusammen, um Ihnen höchste Qualität für Ihre Projekte zu garantieren."
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
