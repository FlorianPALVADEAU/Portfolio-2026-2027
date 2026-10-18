import { describe, expect, it } from "vitest";
import { languageAlternates, openGraphLocale, personJsonLd } from "./seo";

describe("seo", () => {
  it("maps every locale and defaults to English", () => {
    expect(languageAlternates()).toEqual({
      fr: "/fr",
      en: "/en",
      de: "/de",
      "x-default": "/en",
    });
    expect(languageAlternates("/notes").de).toBe("/de/notes");
  });

  it("uses Swiss regional tags for French and German", () => {
    expect(openGraphLocale("fr")).toBe("fr_CH");
    expect(openGraphLocale("de")).toBe("de_CH");
  });

  it("builds a Person without contact data", () => {
    const data = personJsonLd("fr", "Ingénieur");
    expect(data["@type"]).toBe("Person");
    expect(data.jobTitle).toBe("Ingénieur");
    expect(Object.keys(data)).not.toEqual(expect.arrayContaining(["email"]));
    expect(JSON.stringify(data)).not.toMatch(/email|telephone|address/i);
  });
});
