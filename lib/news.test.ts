import { describe, expect, test } from "vitest";
import { excerpt, newsSlug, newsSlugs, newsText, slugify } from "./news";

const item = {
  titel: "Frühjahrs-Aktion 2026!",
  inhalt: "<p>Hallo <strong>Welt</strong></p>",
  titelIt: "Promozione primavera",
  inhaltIt: "<p>Ciao</p>",
  titelEn: "  ",
  inhaltEn: "",
};

describe("news helpers", () => {
  test("slugify", () => {
    expect(slugify("Frühjahrs-Aktion 2026!")).toBe("fruehjahrs-aktion-2026");
    expect(slugify("Città & Natale")).toBe("citta-natale");
  });

  test("newsText fällt bei leerem Englisch auf Deutsch zurück", () => {
    expect(newsText(item, "en").title).toBe(item.titel);
    expect(newsText(item, "it").title).toBe(item.titelIt);
  });

  test("newsSlugs kennt alle Sprachen, newsSlug nur die aktive", () => {
    expect(newsSlugs(item)).toEqual(["fruehjahrs-aktion-2026", "promozione-primavera"]);
    expect(newsSlug(item, "it")).toBe("promozione-primavera");
    // leerer EN-Titel erzeugt keinen leeren Slug
    expect(newsSlugs(item)).not.toContain("");
  });

  test("excerpt entfernt HTML und kürzt", () => {
    expect(excerpt(item.inhalt)).toBe("Hallo Welt");
    expect(excerpt("<p>abcdef</p>", 3)).toBe("abc…");
  });
});
