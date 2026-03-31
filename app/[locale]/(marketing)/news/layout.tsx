import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "News" });
  const isIt = locale === "it";
  const url = isIt ? "https://brugnara.bz.it/it/novita" : "https://brugnara.bz.it/news";

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: url,
      languages: {
        de: "https://brugnara.bz.it/news",
        it: "https://brugnara.bz.it/it/novita",
      },
    },
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url,
    },
  };
}

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
