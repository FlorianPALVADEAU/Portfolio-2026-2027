import { describe, expect, it } from "vitest";
import { locales } from "@/lib/i18n";
import { loadProject, projectSlugs } from ".";

describe("shipped content", () => {
  const cases = projectSlugs.flatMap((slug) => locales.map((locale) => [slug, locale] as const));

  it.each(cases)("%s loads and validates in %s", async (slug, locale) => {
    const project = await loadProject(slug, locale);

    expect(project.slug).toBe(slug);
    expect(project.title.length).toBeGreaterThan(0);
  });

  it("rejects an unknown project", async () => {
    await expect(loadProject("does-not-exist", "en")).rejects.toThrow("unknown project");
  });

  it("keeps German free of the eszett", async () => {
    for (const slug of projectSlugs) {
      expect(JSON.stringify(await loadProject(slug, "de"))).not.toContain("ß");
    }
  });
});
