import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { languageAlternates } from "@/lib/seo";
import { buildDate, siteUrl } from "@/lib/site";
import { projectSlugs } from "@/server/infrastructure/content";

/** One entry per locale for every page, each pointing at its translations. */
function entriesFor(path: string, lastModified: Date): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    Object.entries(languageAlternates(path)).map(([language, href]) => [
      language,
      `${siteUrl}${href}`,
    ]),
  );
  return locales.map((locale) => ({
    url: `${siteUrl}/${locale}${path}`,
    lastModified,
    alternates: { languages },
  }));
}

/** Content only changes with a build, so the build date is the last modification. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...entriesFor("", buildDate),
    ...projectSlugs.flatMap((slug) => entriesFor(`/projects/${slug}`, buildDate)),
  ];
}
