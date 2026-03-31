import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Impressum" });
  const isIt = locale === "it";
  const url = isIt ? "https://brugnara.bz.it/it/impressum" : "https://brugnara.bz.it/impressum";

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: url,
      languages: {
        de: "https://brugnara.bz.it/impressum",
        it: "https://brugnara.bz.it/it/impressum",
      },
    },
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url,
    },
  };
}

export default function ImpressumLayout({ children }: { children: React.ReactNode }) {
  return children;
}
