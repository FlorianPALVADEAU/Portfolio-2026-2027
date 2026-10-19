import { Button } from "@/components/atoms/button";
import { Container } from "@/components/atoms/container";
import { Link } from "@/components/atoms/link";
import { Logo } from "@/components/atoms/logo";
import { SkipLink } from "@/components/atoms/skip-link";
import { LocaleSwitcher } from "@/components/molecules/locale-switcher";
import { SoundToggle } from "@/components/molecules/sound-toggle";
import { ThemeSwitcher } from "@/components/molecules/theme-switcher";
import { CommandPalette } from "@/features/command-palette";
import { HeaderReveal } from "@/features/header-reveal";
import { MAIN_ID } from "@/features/route-focus";
import { SiteMenu } from "@/features/site-menu";
import type { Locale, Messages } from "@/lib/i18n";
import { navSections } from "@/lib/landing";
import { siteName } from "@/lib/site";

type SiteHeaderProps = {
  locale: Locale;
  messages: Messages["header"];
  palette: Messages["palette"];
};

export function SiteHeader({ locale, messages, palette }: SiteHeaderProps) {
  return (
    <>
      <SkipLink href={`#${MAIN_ID}`}>{messages.skip}</SkipLink>
      <HeaderReveal>
        <Container>
          <div className="relative flex items-center justify-between rounded-full border border-border/60 bg-background/60 py-2 pr-2 pl-4 sm:pl-5 backdrop-blur-md backdrop-saturate-150">
            <Link href={`/${locale}`} className="inline-flex min-h-11 items-center no-underline">
              <Logo label={siteName} className="h-5" />
            </Link>
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Touch screens have no hover, so the sound controls only exist from md up. */}
              <div className="hidden items-center gap-2 md:flex">
                <SoundToggle onLabel={messages.sound.on} offLabel={messages.sound.off} />
                <LocaleSwitcher current={locale} label={messages.language} />
              </div>
              <Button
                asChild
                className="hidden rounded-full px-5 text-xs tracking-wider uppercase hover:text-accent-foreground md:inline-flex"
              >
                <Link href={`/${locale}#contact`} className="no-underline">
                  {messages.cta}
                </Link>
              </Button>
              <SiteMenu
                openLabel={messages.menu.open}
                closeLabel={messages.menu.close}
                navLabel={messages.nav.label}
                action={
                  <Button
                    asChild
                    size="lg"
                    className="w-full rounded-full tracking-wider uppercase hover:text-accent-foreground"
                  >
                    <Link href={`/${locale}#contact`} className="no-underline">
                      {messages.cta}
                    </Link>
                  </Button>
                }
                items={navSections.map((id) => ({
                  href: `/${locale}#${id}`,
                  label: messages.nav[id],
                }))}
              >
                <CommandPalette
                  locale={locale}
                  themeNames={messages.theme.names}
                  messages={palette}
                />
                <ThemeSwitcher label={messages.theme.label} names={messages.theme.names} />
                <div className="md:hidden">
                  <LocaleSwitcher current={locale} label={messages.language} layout="inline" />
                </div>
              </SiteMenu>
            </div>
          </div>
        </Container>
      </HeaderReveal>
    </>
  );
}
