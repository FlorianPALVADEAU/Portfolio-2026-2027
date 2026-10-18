import { Container } from "@/components/atoms/container";
import { Link } from "@/components/atoms/link";
import { Logo } from "@/components/atoms/logo";
import { SkipLink } from "@/components/atoms/skip-link";
import { LocaleSwitcher } from "@/components/molecules/locale-switcher";
import { SectionNav } from "@/components/molecules/section-nav";
import { SoundToggle } from "@/components/molecules/sound-toggle";
import { ThemeSwitcher } from "@/components/molecules/theme-switcher";
import { CommandPalette } from "@/features/command-palette";
import { MAIN_ID } from "@/features/route-focus";
import type { Locale, Messages } from "@/lib/i18n";
import { navSections } from "@/lib/landing";

type SiteHeaderProps = {
  locale: Locale;
  messages: Messages["header"];
  palette: Messages["palette"];
};

export function SiteHeader({ locale, messages, palette }: SiteHeaderProps) {
  return (
    <>
      <SkipLink href={`#${MAIN_ID}`}>{messages.skip}</SkipLink>
      <header className="border-b border-border">
        <Container className="flex flex-wrap items-center justify-between gap-x-6 py-2">
          <Link
            href={`/${locale}`}
            className="inline-flex min-h-11 items-center font-mono text-sm font-medium no-underline"
          >
            <Logo className="mr-3 h-5" />
            Florian Palvadeau
          </Link>
          <div className="flex flex-wrap items-center justify-end gap-x-4">
            <ThemeSwitcher label={messages.theme.label} names={messages.theme.names} />
            <CommandPalette locale={locale} themeNames={messages.theme.names} messages={palette} />
            <SoundToggle onLabel={messages.sound.on} offLabel={messages.sound.off} />
            <LocaleSwitcher current={locale} label={messages.language} />
          </div>
          <div className="w-full">
            <SectionNav
              label={messages.nav.label}
              items={navSections.map((id) => ({
                href: `/${locale}#${id}`,
                label: messages.nav[id],
              }))}
            />
          </div>
        </Container>
      </header>
    </>
  );
}
