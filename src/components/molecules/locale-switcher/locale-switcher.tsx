"use client";

import { usePathname } from "next/navigation";
import { Flag } from "@/components/atoms/flag";
import { Link } from "@/components/atoms/link";
import { Dropdown } from "@/components/molecules/dropdown";
import { type Locale, localeNames, locales, localizePath } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type LocaleSwitcherProps = {
  current: Locale;
  label: string;
  /** "inline" lists the flags in a row, for places such as the menu where a dropdown would be clipped. */
  layout?: "dropdown" | "inline";
};

export function LocaleSwitcher({ current, label, layout = "dropdown" }: LocaleSwitcherProps) {
  const pathname = usePathname();

  if (layout === "inline") {
    return (
      <nav aria-label={label}>
        <ul className="flex items-center gap-1">
          {locales.map((locale) => (
            <li key={locale}>
              <Link
                href={localizePath(pathname, locale)}
                // The 404 page is served from a prerendered route, so its server pathname is not the typed one.
                suppressHydrationWarning
                scroll={false}
                data-keep-scroll=""
                hrefLang={locale}
                lang={locale}
                aria-label={`${locale.toUpperCase()}, ${localeNames[locale]}`}
                aria-current={locale === current ? "true" : undefined}
                className={cn(
                  "inline-flex size-11 items-center justify-center rounded-full no-underline hover:bg-muted",
                  locale !== current && "opacity-60",
                )}
              >
                <Flag locale={locale} />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  return (
    <Dropdown
      label={`${label}: ${localeNames[current]}`}
      trigger={<Flag locale={current} className="size-7" />}
      align="start"
    >
      <nav aria-label={label}>
        <ul>
          {locales.map((locale) => (
            <li key={locale}>
              <Link
                href={localizePath(pathname, locale)}
                // The 404 page is served from a prerendered route, so its server pathname is not the typed one.
                suppressHydrationWarning
                scroll={false}
                data-keep-scroll=""
                hrefLang={locale}
                lang={locale}
                aria-label={`${locale.toUpperCase()}, ${localeNames[locale]}`}
                aria-current={locale === current ? "true" : undefined}
                className={cn(
                  "flex min-h-11 items-center gap-3 rounded-md px-3 text-sm no-underline hover:bg-muted",
                  locale === current ? "text-foreground" : "text-muted-foreground",
                )}
              >
                <Flag locale={locale} className="size-5" />
                {localeNames[locale]}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </Dropdown>
  );
}
