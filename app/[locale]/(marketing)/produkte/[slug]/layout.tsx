import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  
  // We need both the Product page metadata translations and the specific category name
  const tMeta = await getTranslations({ locale, namespace: "Products" });
  const tCat = await getTranslations({ locale, namespace: "ProductCategories" });
  
  const isIt = locale === "it";
  const url = isIt 
    ? `https://brugnara.bz.it/it/prodotti/${slug}` 
    : `https://brugnara.bz.it/produkte/${slug}`;

  // Use the slug to get the translated category name. If slug isn't found, fallback to slug string.
  // We have to ts-ignore or cast because next-intl strictly types translation keys based on the json.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const categoryName = tCat(slug as any) || slug;

  return {
    title: tMeta("metaTitle", { category: categoryName }),
    description: tMeta("metaDescription", { category: categoryName }),
    alternates: {
      canonical: url,
      languages: {
        de: `https://brugnara.bz.it/produkte/${slug}`,
        it: `https://brugnara.bz.it/it/prodotti/${slug}`,
      },
    },
    openGraph: {
      title: tMeta("metaTitle", { category: categoryName }),
      description: tMeta("metaDescription", { category: categoryName }),
      url,
    },
  };
}

export default function ProductCategoryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
