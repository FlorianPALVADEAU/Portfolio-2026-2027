import { describe, expect, it } from "vitest";
import {
  breadcrumbJsonLd,
  languageAlternates,
  openGraphLocale,
  personJsonLd,
  projectJsonLd,
  websiteJsonLd,
} from "./seo";

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

  it("links the Person to the approved public profiles", () => {
    expect(personJsonLd("en", "Engineer").sameAs).toEqual(
      expect.arrayContaining([expect.stringContaining("github.com")]),
    );
  });

  it("points the website and a project at the Person", () => {
    const person = personJsonLd("en", "Engineer")["@id"];
    expect(websiteJsonLd("en").publisher).toEqual({ "@id": person });
    const project = projectJsonLd("de", {
      slug: "demo",
      title: "Demo",
      summary: "A demo",
      year: 2026,
      stack: ["Next.js", "Effect"],
      cover: { src: "/projects/demo/cover.webp" },
    });
    expect(project.author).toEqual({ "@id": person });
    expect(project.url).toMatch(/\/de\/projects\/demo$/);
    expect(project.image).toMatch(/\/projects\/demo\/cover\.webp$/);
    expect(project.keywords).toBe("Next.js, Effect");
  });

  it("numbers breadcrumb items from one", () => {
    const trail = breadcrumbJsonLd([
      { name: "Home", path: "/en" },
      { name: "Demo", path: "/en/projects/demo" },
    ]);
    expect(trail.itemListElement.map(({ position }) => position)).toEqual([1, 2]);
    expect(trail.itemListElement[1]?.item).toMatch(/\/en\/projects\/demo$/);
  });
});
