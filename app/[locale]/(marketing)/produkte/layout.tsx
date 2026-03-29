import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ProductsOverview" });
  const isIt = locale === "it";
  const url = isIt ? "https://brugnara.bz.it/it/prodotti" : "https://brugnara.bz.it/produkte";

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: url,
      languages: {
        de: "https://brugnara.bz.it/produkte",
        it: "https://brugnara.bz.it/it/prodotti",
      },
    },
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url,
    },
  };
}

export default function ProdukteLayout({ children }: { children: React.ReactNode }) {
  return children;
}
