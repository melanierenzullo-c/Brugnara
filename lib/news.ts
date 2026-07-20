import type { Locale } from "@/i18n/routing";

/** Nur die Felder, die für Anzeige und Slug gebraucht werden. */
export interface NewsTexts {
  titel: string;
  inhalt: string;
  titelIt: string;
  inhaltIt: string;
  titelEn?: string;
  inhaltEn?: string;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // restliche Akzente (à, é, …)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Titel + Inhalt in der aktiven Sprache, Fallback auf Deutsch. */
export function newsText(item: NewsTexts, locale: Locale) {
  if (locale === "it") return { title: item.titelIt, content: item.inhaltIt };
  if (locale === "en") {
    return {
      title: item.titelEn?.trim() || item.titel,
      content: item.inhaltEn?.trim() || item.inhalt,
    };
  }
  return { title: item.titel, content: item.inhalt };
}

/**
 * Slugs in allen Sprachen. Bewusst nicht nur der aktive: nach einem
 * Sprachwechsel steht noch der alte Slug in der URL, der Beitrag wird
 * trotzdem gefunden.
 */
export function newsSlugs(item: NewsTexts): string[] {
  return [item.titel, item.titelIt, item.titelEn]
    .filter((t): t is string => Boolean(t?.trim()))
    .map(slugify);
}

/** Slug für Links – immer der Titel der aktiven Sprache. */
export function newsSlug(item: NewsTexts, locale: Locale): string {
  return slugify(newsText(item, locale).title);
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>?/gm, " ").replace(/\s+/g, " ").trim();
}

export function excerpt(html: string, max = 180): string {
  const text = stripHtml(html);
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;
}

export function dateLocale(locale: Locale): string {
  return locale === "it" ? "it-IT" : locale === "en" ? "en-GB" : "de-DE";
}

export function formatNewsDate(timestamp: number, locale: Locale): string {
  return new Date(timestamp).toLocaleDateString(dateLocale(locale), {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
