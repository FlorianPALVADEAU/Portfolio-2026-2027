import { describe, expect, it } from "vitest";
import { isLocale, localizePath, negotiateLocale } from "./config";

describe("negotiateLocale", () => {
  it("falls back to the default without a header", () => {
    expect(negotiateLocale(null)).toBe("en");
  });

  it("matches a regional tag on its language", () => {
    expect(negotiateLocale("de-CH,de;q=0.9,en;q=0.5")).toBe("de");
  });

  it("honours quality ordering", () => {
    expect(negotiateLocale("en;q=0.4,fr;q=0.9")).toBe("fr");
  });

  it("ignores unsupported and refused languages", () => {
    expect(negotiateLocale("es,it;q=0.8,fr;q=0")).toBe("en");
  });
});

describe("isLocale", () => {
  it("accepts supported locales only", () => {
    expect(isLocale("fr")).toBe(true);
    expect(isLocale("es")).toBe(false);
  });
});

describe("localizePath", () => {
  it("swaps the locale segment", () => {
    expect(localizePath("/fr/projects/x", "de")).toBe("/de/projects/x");
  });

  it("returns the locale root for the home page", () => {
    expect(localizePath("/en", "fr")).toBe("/fr");
  });

  it("adds a locale to an unprefixed path", () => {
    expect(localizePath("/notes", "en")).toBe("/en/notes");
  });
});
