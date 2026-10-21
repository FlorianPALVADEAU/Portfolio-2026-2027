import NextLink from "next/link";
import { Button } from "@/components/atoms/button";
import { Link } from "@/components/atoms/link";
import { RiseText } from "@/components/atoms/rise-text";
import { BackToTop } from "@/components/molecules/back-to-top";
import { SocialLink } from "@/components/molecules/social-link";
import { FooterReveal } from "@/features/footer-reveal";
import { Magnetic } from "@/features/magnetic";
import { NowPlaying } from "@/features/now-playing";
import type { Locale, Messages } from "@/lib/i18n";
import { navSections, pictureCredits, profiles, socialIcons } from "@/lib/landing";
import { siteName } from "@/lib/site";

type SiteFooterProps = {
  locale: Locale;
  nav: Messages["header"]["nav"];
  /** The availability line of the contact section, repeated here as the footer's first line. */
  availability: string;
  messages: Messages["footer"];
};

/** A link that draws its underline from the left on hover instead of showing one. */
const linkClass =
  "bg-[linear-gradient(currentColor,currentColor)] bg-[length:0_1px] bg-bottom-left bg-no-repeat pb-0.5 text-background/70 no-underline transition-[background-size,color] duration-500 ease-(--ease-out-expo) hover:bg-[length:100%_1px] hover:text-background focus-visible:bg-[length:100%_1px] focus-visible:text-background motion-reduce:transition-none";

/**
 * The page's last word, set on paper: an inset card on the inverse ground, so the page ends on a
 * frame rather than running edge to edge. The closing line and the name rise in word by word as
 * the card scrolls into view, and nothing here holds the scroll.
 */
export function SiteFooter({ locale, nav, availability, messages }: SiteFooterProps) {
  return (
    <footer data-paper="" className="mt-auto overflow-clip bg-background p-2 md:p-3">
      <FooterReveal className="relative isolate flex min-h-[88svh] origin-top flex-col justify-between gap-10 overflow-hidden rounded-3xl bg-foreground px-5 py-6 text-background md:rounded-[2rem] md:gap-8 md:px-10 md:py-8">
        <div
          aria-hidden="true"
          className="footer-glow pointer-events-none absolute -top-1/3 left-1/2 -z-10 size-[80vmax] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--accent)_38%,transparent),transparent)]"
        />

        <p
          data-rise-fade=""
          className="flex items-center gap-3 font-mono text-sm tracking-widest uppercase"
        >
          <span aria-hidden="true" className="relative flex size-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-accent motion-reduce:hidden" />
            <span className="relative size-2 rounded-full bg-accent" />
          </span>
          {availability}
        </p>

        <div className="flex flex-col gap-8 md:gap-10">
          <div className="flex flex-col gap-4 md:gap-6">
            <p data-rise-fade="" className="text-lg text-background/70">
              {messages.kicker}
            </p>
            <h2 className="max-w-5xl text-[clamp(2.5rem,1.2rem+6vw,7rem)] leading-[0.95] font-semibold tracking-tight">
              <RiseText>{messages.headline.lead}</RiseText>{" "}
              <RiseText className="text-background/55">{messages.headline.accent}</RiseText>
            </h2>
          </div>
          <div data-rise-fade="" className="flex flex-wrap items-center gap-3">
            <Magnetic strength={0.25}>
              <Button
                asChild
                size="lg"
                className="rounded-full bg-background text-foreground hover:bg-background hover:opacity-90"
              >
                <NextLink href={`/${locale}#contact`}>{messages.cta}</NextLink>
              </Button>
            </Magnetic>
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
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <div
            data-rise-fade=""
            className="grid gap-8 border-t border-background/15 pt-6 text-sm md:grid-cols-12 md:items-start"
          >
            <nav aria-label={messages.navigation} className="md:col-span-4">
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
            <p className="text-background/70 md:col-span-8">
              {`${messages.photos} `}
              {pictureCredits.map(
                ({ id, title, author, licence, licenceUrl, sourceUrl }, index) => (
                  <span key={id}>
                    {index > 0 && "; "}
                    <Link href={sourceUrl} external className={linkClass}>
                      {`“${title}”`}
                    </Link>
                    {` ${author}, `}
                    <Link href={licenceUrl} external className={linkClass}>
                      {licence}
                    </Link>
                  </span>
                ),
              )}
            </p>
          </div>
          <div className="overflow-hidden">
            <svg
              data-rise-word=""
              viewBox="0 0 1000 150"
              role="img"
              aria-label={siteName}
              className="block w-full fill-current"
            >
              <text
                x="0"
                y="125"
                fontSize="128"
                fontWeight="600"
                letterSpacing="-6"
                textLength="1000"
                lengthAdjust="spacingAndGlyphs"
                fontFamily="var(--font-geist-sans)"
              >
                {siteName}
              </text>
            </svg>
          </div>
          <div data-rise-fade="" className="flex items-end justify-between gap-6 text-sm">
            <div className="flex flex-col gap-3">
              <NowPlaying
                messages={messages.nowPlaying}
                className="text-sm"
                linkClassName={linkClass}
              />
              <p className="text-background/70">{messages.legal}</p>
            </div>
            <Magnetic strength={0.3}>
              <BackToTop label={messages.top} />
            </Magnetic>
          </div>
        </div>
      </FooterReveal>
    </footer>
  );
}
