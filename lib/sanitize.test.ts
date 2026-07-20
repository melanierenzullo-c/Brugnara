import { describe, expect, test } from "vitest";
import DOMPurify from "isomorphic-dompurify";

/**
 * Spiegelt SANITIZE_OPTIONS aus components/news-article.tsx.
 * Der Test hält fest, dass gespeichertes Editor-HTML gefiltert wird, bevor es
 * per dangerouslySetInnerHTML auf der Website landet.
 */
const options = {
  ALLOWED_TAGS: [
    "p", "br", "strong", "b", "em", "i", "u", "s",
    "ul", "ol", "li", "h1", "h2", "h3", "blockquote", "hr",
    "code", "pre", "a",
  ],
  ADD_ATTR: ["target"],
};

const clean = (html: string) => DOMPurify.sanitize(html, options);

describe("News-Inhalt sanitizen", () => {
  test("erlaubtes Markup bleibt erhalten", () => {
    expect(clean("<p>Hallo <strong>Welt</strong></p>")).toBe("<p>Hallo <strong>Welt</strong></p>");
    expect(clean('<a href="https://x.com" target="_blank" rel="noopener noreferrer">w</a>')).toContain(
      'target="_blank"'
    );
    expect(clean('<p style="text-align:center">m</p>')).toContain("text-align:center");
  });

  test("Skripte und gefährliche URLs fliegen raus", () => {
    expect(clean("<script>alert(1)</script><p>ok</p>")).toBe("<p>ok</p>");
    expect(clean("<img src=x onerror=alert(1)>")).toBe("");
    expect(clean('<p onmouseover="alert(1)">m</p>')).toBe("<p>m</p>");
    for (const href of ["javascript:alert(1)", "JaVaScRiPt:alert(1)", "&#106;avascript:alert(1)", "data:text/html,x"]) {
      expect(clean(`<a href="${href}">k</a>`)).not.toContain("href");
    }
  });
});
