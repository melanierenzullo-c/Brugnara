const BASE_URL = "https://brugnara.bz.it";

const BUSINESS_GEO = {
  latitude: 46.6713,
  longitude: 11.1598,
} as const;

interface JsonLdProps {
  readonly data: Record<string, unknown>;
}

/** Renders a JSON-LD script tag for structured data */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** LocalBusiness structured data for the hardware store */
export function getLocalBusinessJsonLd(locale: string): Record<string, unknown> {
  const isIt = locale === "it";

  return {
    "@context": "https://schema.org",
    "@type": "HardwareStore",
    "@id": `${BASE_URL}/#business`,
    name: "M. Brugnara GmbH",
    alternateName: isIt ? "M. Brugnara Srl" : "M. Brugnara GmbH",
    description: isIt
      ? "Il vostro negozio specializzato a Merano per ferramenta, casalinghi, utensili, elettrodomestici, attrezzi da giardino, stufe e cucine."
      : "Ihr Fachgeschäft in Meran für Eisenwaren, Haushalt, Werkzeug, Elektrogeräte, Gartengeräte, Öfen und Herde.",
    url: isIt ? `${BASE_URL}/it` : BASE_URL,
    telephone: "+39 0473 232755",
    email: "info@brugnara.bz.it",
    image: `${BASE_URL}/images/og-image.png`,
    logo: `${BASE_URL}/images/logo.png`,
    priceRange: "€€",
    currenciesAccepted: "EUR",
    paymentAccepted: "Cash, Credit Card, Debit Card",
    address: {
      "@type": "PostalAddress",
      streetAddress: isIt ? "Via Roma 31/A" : "Romstraße 31/A",
      addressLocality: isIt ? "Merano" : "Meran",
      addressRegion: isIt ? "Alto Adige" : "Südtirol",
      postalCode: "39012",
      addressCountry: "IT",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: BUSINESS_GEO.latitude,
      longitude: BUSINESS_GEO.longitude,
    },
    areaServed: [
      {
        "@type": "City",
        name: isIt ? "Merano" : "Meran",
      },
      {
        "@type": "AdministrativeArea",
        name: isIt ? "Alto Adige" : "Südtirol",
      },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "12:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "14:30",
        closes: "18:30",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "08:00",
        closes: "12:00",
      },
    ],
    sameAs: [
      "https://www.instagram.com/brugnara_eisenwaren",
      "https://www.facebook.com/www.brugnara.net/",
      "https://www.ebay.it/usr/m.brugnara",
    ],
  };
}

/** WebSite structured data for the homepage */
export function getWebSiteJsonLd(locale: string): Record<string, unknown> {
  const isIt = locale === "it";

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    name: isIt ? "M. Brugnara Srl" : "M. Brugnara GmbH",
    url: BASE_URL,
    inLanguage: [
      { "@type": "Language", name: "German", alternateName: "de" },
      { "@type": "Language", name: "Italian", alternateName: "it" },
    ],
    publisher: {
      "@id": `${BASE_URL}/#business`,
    },
  };
}

/** BreadcrumbList structured data for navigation */
export function getBreadcrumbJsonLd(
  items: ReadonlyArray<{ name: string; url: string }>
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
