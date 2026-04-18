import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getMessages, getTranslations } from "next-intl/server";
import { GsapProvider } from "@/components/gsap-provider";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import { getToken } from "@/lib/auth-server";
import { JsonLd, getLocalBusinessJsonLd } from "@/components/json-ld";

const BASE_URL = "https://brugnara.bz.it";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const isIt = locale === "it";

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: t("title"),
      template: `%s | ${t("title")}`,
    },
    description: t("description"),
    keywords: isIt
      ? [
          "ferramenta Merano",
          "negozio ferramenta Alto Adige",
          "casalinghi Merano",
          "utensili Merano",
          "elettrodomestici Merano",
          "attrezzi da giardino Merano",
          "stufe e cucine Merano",
          "M. Brugnara",
        ]
      : [
          "Eisenwaren Meran",
          "Fachgeschäft Meran",
          "Haushalt Meran",
          "Werkzeug Meran",
          "Elektrogeräte Meran",
          "Gartengeräte Meran",
          "Öfen Herde Meran",
          "M. Brugnara",
          "Eisenwaren Südtirol",
        ],
    authors: [{ name: "M. Brugnara GmbH" }],
    creator: "M. Brugnara GmbH",
    openGraph: {
      type: "website",
      locale: isIt ? "it_IT" : "de_DE",
      alternateLocale: isIt ? "de_DE" : "it_IT",
      url: isIt ? `${BASE_URL}/it` : BASE_URL,
      siteName: t("title"),
      title: t("title"),
      description: t("description"),
      images: [
        {
          url: "/images/og-image.png",
          width: 1200,
          height: 630,
          alt: t("title"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/images/og-image.png"],
    },
    alternates: {
      canonical: isIt ? `${BASE_URL}/it` : BASE_URL,
      languages: {
        "de": BASE_URL,
        "it": `${BASE_URL}/it`,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {},
  };
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();
  let initialToken: string | null = null;
  try {
    initialToken = await getToken();
  } catch {
    initialToken = null;
  }

  const localBusinessData = getLocalBusinessJsonLd(locale);

  return (
    <>
      <JsonLd data={localBusinessData} />
      <ConvexClientProvider initialToken={initialToken}>
        <NextIntlClientProvider messages={messages}>
          <GsapProvider>{children}</GsapProvider>
        </NextIntlClientProvider>
      </ConvexClientProvider>
    </>
  );
}
