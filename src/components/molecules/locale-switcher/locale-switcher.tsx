"use client";

import { usePathname } from "next/navigation";
import { Link } from "@/components/atoms/link";
import { type Locale, localeNames, locales, localizePath } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type LocaleSwitcherProps = {
  current: Locale;
  label: string;
};

export function LocaleSwitcher({ current, label }: LocaleSwitcherProps) {
  const pathname = usePathname();

  return (
    <nav aria-label={label}>
      <ul className="flex items-center gap-1">
        {locales.map((locale) => (
          <li key={locale}>
            <Link
              href={localizePath(pathname, locale)}
              hrefLang={locale}
              lang={locale}
              aria-label={`${locale.toUpperCase()}, ${localeNames[locale]}`}
              aria-current={locale === current ? "true" : undefined}
              className={cn(
                "inline-flex min-h-11 min-w-11 items-center justify-center rounded-md px-2 font-mono text-sm uppercase no-underline",
                locale === current ? "bg-surface text-foreground" : "text-muted-foreground",
              )}
            >
              {locale}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
