import type { Metadata } from "next";
import "../globals.css";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getMessages } from "next-intl/server";
import { GsapProvider } from "@/components/gsap-provider";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import { getToken } from "@/lib/auth-server";

export const metadata: Metadata = {
  title: "M. Brugnara GmbH",
  description: "M. Brugnara GmbH – Ihr Fachgeschäft in Meran für Eisenwaren, Haushalt, Werkzeug, Elektrogeräte, Gartengeräte, Öfen und Herde.",
};

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

  return (
    <ConvexClientProvider initialToken={initialToken}>
      <NextIntlClientProvider messages={messages}>
        <GsapProvider>{children}</GsapProvider>
      </NextIntlClientProvider>
    </ConvexClientProvider>
  );
}

