import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { languageAlternates } from "@/lib/seo";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    Object.entries(languageAlternates()).map(([language, path]) => [language, `${siteUrl}${path}`]),
  );

  return locales.map((locale) => ({
    url: `${siteUrl}/${locale}`,
    alternates: { languages },
  }));
}
