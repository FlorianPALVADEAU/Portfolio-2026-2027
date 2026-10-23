export const locales = ["fr", "en", "de"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

/** Native names, shown as-is in every locale. */
export const localeNames: Record<Locale, string> = {
  fr: "Français",
  en: "English",
  de: "Deutsch",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Picks the first supported language of an `Accept-Language` header, ordered by quality. */
export function negotiateLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale;

  const ranked = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag = "", ...params] = part.trim().split(";");
      const q = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
      const quality = q ? Number.parseFloat(q.slice(2)) : 1;
      return { language: tag.trim().toLowerCase().split("-")[0] ?? "", quality };
    })
    .filter(({ quality }) => Number.isFinite(quality) && quality > 0)
    .sort((a, b) => b.quality - a.quality);

  for (const { language } of ranked) {
    if (isLocale(language)) return language;
  }
  return defaultLocale;
}

/** Swaps (or adds) the leading locale segment of a pathname. */
export function localizePath(pathname: string, locale: Locale): string {
  const [, first = "", ...rest] = pathname.split("/");
  const tail = isLocale(first) ? rest : [first, ...rest];
  const path = tail.filter(Boolean).join("/");
  return path ? `/${locale}/${path}` : `/${locale}`;
}
