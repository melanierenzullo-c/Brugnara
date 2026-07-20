import { describe, expect, test } from "vitest";
import { normalizeUrl } from "./url";

describe("normalizeUrl", () => {
  test("ergänzt fehlendes Protokoll", () => {
    expect(normalizeUrl("brugnara.bz.it")).toBe("https://brugnara.bz.it/");
  });

  test("lässt erlaubte Protokolle durch", () => {
    expect(normalizeUrl("https://example.com/a?b=1")).toBe("https://example.com/a?b=1");
    expect(normalizeUrl("mailto:info@brugnara.bz.it")).toBe("mailto:info@brugnara.bz.it");
    expect(normalizeUrl("tel:+390471123456")).toBe("tel:+390471123456");
  });

  test("blockt gefährliche Protokolle", () => {
    expect(normalizeUrl("javascript:alert(1)")).toBeNull();
    expect(normalizeUrl("  JavaScript:alert(1)  ")).toBeNull();
    expect(normalizeUrl("data:text/html,<script>alert(1)</script>")).toBeNull();
    expect(normalizeUrl("")).toBeNull();
  });
});
