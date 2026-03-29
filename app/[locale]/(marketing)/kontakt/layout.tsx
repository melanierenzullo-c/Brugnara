import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Contact" });
  const isIt = locale === "it";
  const url = isIt ? "https://brugnara.bz.it/it/kontakt" : "https://brugnara.bz.it/kontakt";

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: url,
      languages: {
        de: "https://brugnara.bz.it/kontakt",
        it: "https://brugnara.bz.it/it/kontakt",
      },
    },
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url,
    },
  };
}

export default function KontaktLayout({ children }: { children: React.ReactNode }) {
  return children;
}
