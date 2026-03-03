import { MarketingNavigation } from "@/components/marketing-navigation";
import { MarketingFooter } from "@/components/marketing-footer";
import { CookieConsent } from "@/components/cookie-consent";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingNavigation />
      <main className="flex-1">{children}</main>
      <CookieConsent />
      <MarketingFooter />
    </div>
  );
}
