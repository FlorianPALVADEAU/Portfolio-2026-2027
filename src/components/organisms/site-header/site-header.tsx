import { Container } from "@/components/atoms/container";
import { Link } from "@/components/atoms/link";
import { LocaleSwitcher } from "@/components/molecules/locale-switcher";
import type { Locale, Messages } from "@/lib/i18n";

type SiteHeaderProps = {
  locale: Locale;
  messages: Messages["header"];
};

export function SiteHeader({ locale, messages }: SiteHeaderProps) {
  return (
    <header className="border-b border-border">
      <Container className="flex items-center justify-between py-2">
        <Link
          href={`/${locale}`}
          className="inline-flex min-h-11 items-center font-mono text-sm font-medium no-underline"
        >
          Florian Palvadeau
        </Link>
        <LocaleSwitcher current={locale} label={messages.language} />
      </Container>
    </header>
  );
}
