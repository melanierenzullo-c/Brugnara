import fs from "fs";
import path from "path";
import { getTranslations } from "next-intl/server";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function DatenschutzPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("Datenschutz");

  // Get the modification date of this file
  const filePath = path.join(process.cwd(), "app/[locale]/(marketing)/datenschutz/page.tsx");
  let formattedDate = "";
  try {
    const stats = fs.statSync(filePath);
    formattedDate = new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(stats.mtime);
  } catch (e) {
    console.error("Could not read file stats for Datenschutz page:", e);
    formattedDate = "–";
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ═══ Header ═══ */}
      <section className="relative overflow-hidden bg-[#F6F7FB] pt-24 sm:pt-38 pb-20">
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-foreground sm:text-6xl text-gradient leading-snug">
            {t("title")}
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">{t("gdprRef")}</p>
        </div>
      </section>

      {/* ═══ Content ═══ */}
      <div className="mx-auto max-w-4xl px-6 pt-12 pb-16">
        <div className="rounded-[2rem] border border-border/50 bg-white p-8 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] sm:p-10">
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
            {t("lastUpdated", { date: formattedDate })}
          </div>
        </div>
      </div>
    </div>
  );
}
