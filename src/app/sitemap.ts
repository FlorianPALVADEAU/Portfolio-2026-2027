import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { languageAlternates } from "@/lib/seo";
import { siteUrl } from "@/lib/site";
import { projectSlugs } from "@/server/infrastructure/content";

/** One entry per locale for every page, each pointing at its translations. */
function entriesFor(path: string): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    Object.entries(languageAlternates(path)).map(([language, href]) => [
      language,
      `${siteUrl}${href}`,
    ]),
  );
  return locales.map((locale) => ({
    url: `${siteUrl}/${locale}${path}`,
    alternates: { languages },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [...entriesFor(""), ...projectSlugs.flatMap((slug) => entriesFor(`/projects/${slug}`))];
}
