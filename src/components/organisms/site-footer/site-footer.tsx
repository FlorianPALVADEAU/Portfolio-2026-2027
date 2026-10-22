import { Asterisk } from "lucide-react";
import NextLink from "next/link";
import { Button } from "@/components/atoms/button";
import { Icon } from "@/components/atoms/icon";
import { Rise } from "@/components/atoms/rise";
import { RiseText } from "@/components/atoms/rise-text";
import { BackToTop } from "@/components/molecules/back-to-top";
import { SocialLink } from "@/components/molecules/social-link";
import { CreditsDialog } from "@/features/credits-dialog";
import { FooterReveal } from "@/features/footer-reveal";
import { Magnetic } from "@/features/magnetic";
import { Marquee } from "@/features/marquee";
import { NowPlaying } from "@/features/now-playing";
import type { Locale, Messages } from "@/lib/i18n";
import { profiles, socialIcons } from "@/lib/landing";
import { siteName } from "@/lib/site";
import { CreditsContent } from "./credits-content";
import { FooterNav } from "./footer-nav";
import { footerLinkClass, monoLabel } from "./styles";

type SiteFooterProps = {
  locale: Locale;
  nav: Messages["header"]["nav"];
  /** The availability line of the contact section, repeated here as the footer's first line. */
  availability: string;
  /** The CV in the visitor's language; the button is left out when no file has been added. */
  cv: { label: string; href: string | null };
  messages: Messages["footer"];
};

/** The name repeated, with a slowly turning mark between two copies; only the first is announced. */
const bannerItems = [0, 1, 2].map((copy) => ({
  id: `name-${copy}`,
  content: (
    <span aria-hidden={copy > 0 || undefined} className="flex items-center gap-8 md:gap-12">
      {siteName}
      <Icon
        icon={Asterisk}
        className="size-[0.55em] animate-[spin_10s_linear_infinite] motion-reduce:animate-none"
      />
    </span>
  ),
}));

/**
 * The page's last word: an inset card on paper, padded on every side and never taller than the
 * screen. The closing line rises in word by word as the card scrolls into view, and nothing here
 * holds the scroll.
 */
export function SiteFooter({ locale, nav, availability, cv, messages }: SiteFooterProps) {
  const { credits } = messages;

  return (
    <footer data-paper="" className="mt-auto overflow-clip bg-background p-3 md:p-4">
      <FooterReveal className="relative flex min-h-[calc(100svh-1.5rem)] origin-top flex-col justify-between gap-8 overflow-hidden rounded-xl bg-foreground px-5 py-6 text-background md:min-h-[calc(100svh-2rem)] md:px-10 md:py-8">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <Rise>
            <p className={`flex items-center gap-3 ${monoLabel}`}>
              <span aria-hidden="true" className="relative flex size-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-background motion-reduce:hidden" />
                <span className="relative size-2 rounded-full bg-background" />
              </span>
              {availability}
            </p>
          </Rise>
          <Rise>
            <CreditsDialog
              triggerLabel={credits.trigger}
              title={credits.title}
              closeLabel={credits.close}
              triggerClassName={`cursor-pointer ${footerLinkClass} ${monoLabel}`}
            >
              <CreditsContent credits={credits} />
            </CreditsDialog>
          </Rise>
        </div>

        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <Rise>
              <p className="text-lg text-background/70">{messages.kicker}</p>
            </Rise>
            <h2 className="max-w-5xl text-[clamp(2.25rem,1rem+5vw,6rem)] leading-[0.95] font-semibold tracking-tight">
              <RiseText>{messages.headline.lead}</RiseText>{" "}
              <RiseText className="text-background/55">{messages.headline.accent}</RiseText>
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Rise>
              <Magnetic strength={0.25}>
                <Button
                  asChild
                  size="lg"
                  className="bg-background text-foreground hover:bg-background hover:opacity-90"
                >
                  <NextLink href={`/${locale}#contact`} data-jump="">
                    {messages.cta}
                  </NextLink>
                </Button>
              </Magnetic>
            </Rise>
            {cv.href && (
              <Rise>
                <Magnetic strength={0.25}>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-background/30 text-background hover:bg-background/10"
                  >
                    <a href={cv.href} download className="no-underline">
                      {cv.label}
                    </a>
                  </Button>
                </Magnetic>
              </Rise>
            )}
            <Rise>
              <ul aria-label={messages.profiles} className="flex items-center gap-3">
                {profiles.map(({ id, label, href }) => (
                  <li key={id}>
                    <Magnetic>
                      <SocialLink
                        label={label}
                        href={href}
                        path={socialIcons[id].path}
                        newTab={messages.newTab}
                      />
                    </Magnetic>
                  </li>
                ))}
              </ul>
            </Rise>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <Rise>
            <Marquee
              items={bannerItems}
              label={siteName}
              speed={100}
              itemClassName="text-[clamp(2.5rem,1.2rem+5vw,5.5rem)] leading-none font-semibold tracking-tight whitespace-nowrap"
              className="border-0 bg-transparent px-0 py-0"
            />
          </Rise>
          <div className="flex flex-col gap-8 border-t border-background/15 pt-6 text-sm">
            <div className="grid gap-8 md:grid-cols-12 md:items-end">
              <Rise className="md:col-span-7">
                <FooterNav locale={locale} label={messages.navigation} nav={nav} />
              </Rise>
              <div className="md:col-span-5 md:justify-self-end">
                <NowPlaying messages={messages.nowPlaying} />
              </div>
            </div>
            <div className="flex items-center justify-between gap-6 border-t border-background/15 pt-5">
              <Rise>
                <p className="text-background/70">{messages.legal}</p>
              </Rise>
              <Rise>
                <Magnetic strength={0.3}>
                  <BackToTop label={messages.top} />
                </Magnetic>
              </Rise>
            </div>
          </div>
        </div>
      </FooterReveal>
    </footer>
  );
}
