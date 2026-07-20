const ALLOWED_PROTOCOLS = ["http:", "https:", "mailto:", "tel:"];

/**
 * Gibt die verwendbare URL zurück oder null, wenn das Protokoll nicht erlaubt
 * ist. Wichtig, weil der im Editor gespeicherte HTML-Inhalt später per
 * dangerouslySetInnerHTML auf der Website gerendert wird – `javascript:` &Co.
 * dürfen gar nicht erst hineinkommen.
 */
export function normalizeUrl(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;
  // ohne Protokoll: als Web-Adresse behandeln
  const candidate = /^[a-z][a-z0-9+.-]*:/i.test(raw) ? raw : `https://${raw}`;
  try {
    const url = new URL(candidate);
    return ALLOWED_PROTOCOLS.includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}
