import { Container } from "@/components/atoms/container";
import { Link } from "@/components/atoms/link";
import { SkipLink } from "@/components/atoms/skip-link";
import { LocaleSwitcher } from "@/components/molecules/locale-switcher";
import { ThemeSwitcher } from "@/components/molecules/theme-switcher";
import { MAIN_ID } from "@/features/route-focus";
import type { Locale, Messages } from "@/lib/i18n";

type SiteHeaderProps = {
  locale: Locale;
  messages: Messages["header"];
};

export function SiteHeader({ locale, messages }: SiteHeaderProps) {
  return (
    <>
      <SkipLink href={`#${MAIN_ID}`}>{messages.skip}</SkipLink>
      <header className="border-b border-border">
        <Container className="flex items-center justify-between py-2">
          <Link
            href={`/${locale}`}
            className="inline-flex min-h-11 items-center font-mono text-sm font-medium no-underline"
          >
            Florian Palvadeau
          </Link>
          <div className="flex flex-wrap items-center justify-end gap-x-4">
            <ThemeSwitcher label={messages.theme.label} names={messages.theme.names} />
            <LocaleSwitcher current={locale} label={messages.language} />
          </div>
        </Container>
      </header>
    </>
  );
}
