import { type Locale, locales } from "@/lib/i18n";
import { profiles } from "@/lib/landing/profiles";
import { siteName, siteUrl } from "@/lib/site";

const OPEN_GRAPH_LOCALES: Record<Locale, string> = { fr: "fr_CH", en: "en_GB", de: "de_CH" };

export function openGraphLocale(locale: Locale): string {
  return OPEN_GRAPH_LOCALES[locale];
}

/** Hreflang map for a path that exists in every locale; `x-default` points at English. */
export function languageAlternates(path = ""): Record<string, string> {
  return {
    ...Object.fromEntries(locales.map((locale) => [locale, `/${locale}${path}`])),
    "x-default": `/en${path}`,
  };
}

const PERSON_ID = `${siteUrl}/#person`;

/** Person structured data. Deliberately carries no email, phone or address. */
export function personJsonLd(locale: Locale, jobTitle: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: siteName,
    jobTitle,
    url: `${siteUrl}/${locale}`,
    image: `${siteUrl}/brand/portrait.webp`,
    sameAs: profiles.map(({ href }) => href),
    inLanguage: locale,
    knowsLanguage: [...locales],
  };
}

/** The site itself, so search engines can tie the three language versions together. */
export function websiteJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: `${siteUrl}/${locale}`,
    inLanguage: locale,
    publisher: { "@id": PERSON_ID },
  };
}

type ProjectSchemaInput = {
  slug: string;
  title: string;
  summary: string;
  year: number;
  stack: readonly string[];
  cover: { src: string };
};

/** A project as a creative work authored by the owner. */
export function projectJsonLd(locale: Locale, project: ProjectSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    url: `${siteUrl}/${locale}/projects/${project.slug}`,
    image: `${siteUrl}${project.cover.src}`,
    dateCreated: String(project.year),
    keywords: project.stack.join(", "),
    inLanguage: locale,
    author: { "@id": PERSON_ID },
  };
}

/** Breadcrumb trail; `path` is relative to the site origin. */
export function breadcrumbJsonLd(trail: readonly { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map(({ name, path }, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      item: `${siteUrl}${path}`,
    })),
  };
}
