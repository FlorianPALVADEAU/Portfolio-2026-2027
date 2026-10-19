import { Container } from "@/components/atoms/container";
import { Link } from "@/components/atoms/link";
import { NowPlaying } from "@/features/now-playing";
import type { Locale, Messages } from "@/lib/i18n";
import { navSections, pictureCredits, profiles } from "@/lib/landing";
import { siteName } from "@/lib/site";

type SiteFooterProps = {
  locale: Locale;
  nav: Messages["header"]["nav"];
  messages: Messages["footer"];
};

const linkClass = "no-underline hover:text-background hover:underline";

/** Inverse ground; the name returns at full width, set as SVG text so it never wraps. */
export function SiteFooter({ locale, nav, messages }: SiteFooterProps) {
  return (
    <footer className="relative mt-auto bg-foreground text-background">
      <Container className="flex min-h-[70svh] flex-col justify-between gap-16 py-10">
        <div className="grid gap-10 text-base md:grid-cols-12">
          <nav aria-label={messages.navigation} className="md:col-span-3">
            <ul className="flex flex-col gap-1">
              {navSections.map((id) => (
                <li key={id}>
                  <Link href={`/${locale}#${id}`} className={linkClass}>
                    {nav[id]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <ul aria-label={messages.profiles} className="flex flex-col gap-1 md:col-span-3">
            {profiles.map(({ id, label, href }) => (
              <li key={id}>
                <Link href={href} external className={linkClass}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="md:col-span-6">
            {`${messages.photos} `}
            {pictureCredits.map(({ id, title, author, licence, licenceUrl, sourceUrl }, index) => (
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
            ))}
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <svg
            viewBox="0 0 1000 150"
            role="img"
            aria-label={siteName}
            className="w-full fill-current"
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
          <NowPlaying
            messages={messages.nowPlaying}
            className="text-sm"
            linkClassName={linkClass}
          />
          <p className="text-sm">{messages.legal}</p>
        </div>
      </Container>
    </footer>
  );
}
