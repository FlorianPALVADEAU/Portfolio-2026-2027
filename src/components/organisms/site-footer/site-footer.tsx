import { Asterisk } from "lucide-react";
import NextLink from "next/link";
import { Button } from "@/components/atoms/button";
import { Icon } from "@/components/atoms/icon";
import { Link } from "@/components/atoms/link";
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
import { assetCredits, navSections, pictureCredits, profiles, socialIcons } from "@/lib/landing";
import { siteName } from "@/lib/site";

type SiteFooterProps = {
  locale: Locale;
  nav: Messages["header"]["nav"];
  /** The availability line of the contact section, repeated here as the footer's first line. */
  availability: string;
  /** The CV in the visitor's language; the button is left out when no file has been added. */
  cv: { label: string; href: string | null };
  messages: Messages["footer"];
};

/** A link that draws its underline from the left on hover instead of showing one. */
const linkClass =
  "bg-[linear-gradient(currentColor,currentColor)] bg-[length:0_1px] bg-bottom-left bg-no-repeat pb-0.5 text-background/70 no-underline transition-[background-size,color] duration-500 ease-(--ease-out-expo) hover:bg-[length:100%_1px] hover:text-background focus-visible:bg-[length:100%_1px] focus-visible:text-background motion-reduce:transition-none";

const monoLabel = "font-mono text-sm tracking-widest uppercase";

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
              triggerClassName={`cursor-pointer ${linkClass} ${monoLabel}`}
            >
              <div className="flex flex-col gap-8 text-sm">
                <section aria-labelledby="credits-photos" className="flex flex-col gap-3">
                  <h3 id="credits-photos" className="font-medium">
                    {credits.photos}
                  </h3>
                  <ul className="flex flex-col gap-3">
                    {pictureCredits.map(({ id, title, author, licence, licenceUrl, sourceUrl }) => (
                      <li key={id}>
                        <Link href={sourceUrl} external>
                          {`“${title}”`}
                        </Link>
                        {` ${author}, `}
                        <Link href={licenceUrl} external>
                          {licence}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
                <section aria-labelledby="credits-assets" className="flex flex-col gap-3">
                  <h3 id="credits-assets" className="font-medium">
                    {credits.assets}
                  </h3>
                  <ul className="flex flex-col gap-3">
                    {assetCredits.map(({ id, name, author, licence, licenceUrl, sourceUrl }) => (
                      <li key={id}>
                        <span className="text-muted-foreground">{`${credits.uses[id]}: `}</span>
                        <Link href={sourceUrl} external>
                          {name}
                        </Link>
                        {` ${author}, `}
                        <Link href={licenceUrl} external>
                          {licence}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
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
                  <NextLink href={`/${locale}#contact`}>{messages.cta}</NextLink>
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
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4 border-t border-background/15 pt-5 text-sm">
            <div className="flex min-w-0 flex-col gap-3">
              <Rise>
                <nav aria-label={messages.navigation}>
                  <ul className="flex flex-wrap gap-x-6 gap-y-2">
                    {navSections.map((id) => (
                      <li key={id}>
                        <Link href={`/${locale}#${id}`} className={linkClass}>
                          {nav[id]}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </Rise>
              <NowPlaying
                messages={messages.nowPlaying}
                className="text-sm"
                linkClassName={linkClass}
              />
              <Rise>
                <p className="text-background/70">{messages.legal}</p>
              </Rise>
            </div>
            <Rise>
              <Magnetic strength={0.3}>
                <BackToTop label={messages.top} />
              </Magnetic>
            </Rise>
          </div>
        </div>
      </FooterReveal>
    </footer>
  );
}
