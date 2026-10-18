import { type Locale, locales } from "@/lib/i18n";
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

/** Person structured data. Deliberately carries no email, phone or address. */
export function personJsonLd(locale: Locale, jobTitle: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteName,
    jobTitle,
    url: `${siteUrl}/${locale}`,
    inLanguage: locale,
    knowsLanguage: [...locales],
  };
}
