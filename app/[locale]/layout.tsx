import type { Metadata } from "next";
import "../globals.css";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getMessages, getTranslations } from "next-intl/server";
import { GsapProvider } from "@/components/gsap-provider";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import { getToken } from "@/lib/auth-server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("title"),
    description: t("description"),
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

  return (
    <ConvexClientProvider initialToken={initialToken}>
      <NextIntlClientProvider messages={messages}>
        <GsapProvider>{children}</GsapProvider>
      </NextIntlClientProvider>
    </ConvexClientProvider>
  );
}

