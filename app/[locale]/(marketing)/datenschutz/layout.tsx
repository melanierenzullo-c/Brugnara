import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Datenschutz" });
  const isIt = locale === "it";
  const url = isIt ? "https://brugnara.bz.it/it/datenschutz" : "https://brugnara.bz.it/datenschutz";

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: url,
      languages: {
        de: "https://brugnara.bz.it/datenschutz",
        it: "https://brugnara.bz.it/it/datenschutz",
      },
    },
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url,
    },
  };
}

export default function DatenschutzLayout({ children }: { children: React.ReactNode }) {
  return children;
}
