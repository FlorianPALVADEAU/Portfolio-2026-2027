import { Link } from "@/components/atoms/link";

type SocialLinkProps = {
  /** Brand name, read out in place of the icon. */
  label: string;
  href: string;
  /** SVG path of the brand mark, drawn on a 24px grid. */
  path: string;
  /** Announces that the link leaves the site. */
  newTab: string;
};

/**
 * A round icon link for the inverse ground of the footer. On hover or focus paper fills the
 * circle from below while the mark tilts and swells.
 */
export function SocialLink({ label, href, path, newTab }: SocialLinkProps) {
  return (
    <Link
      href={href}
      external
      className="group relative flex size-12 items-center justify-center overflow-hidden rounded-full border border-background/30 text-background no-underline outline-offset-4 hover:text-foreground focus-visible:text-foreground"
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 origin-bottom scale-y-0 rounded-full bg-background transition-transform duration-500 ease-(--ease-out-expo) group-hover:scale-y-100 group-focus-visible:scale-y-100 motion-reduce:transition-none"
      />
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="relative size-5 fill-current transition-transform duration-500 ease-(--ease-out-expo) group-hover:-rotate-12 group-hover:scale-110 group-focus-visible:-rotate-12 group-focus-visible:scale-110 motion-reduce:transition-none"
      >
        <path d={path} />
      </svg>
      <span className="sr-only">{`${label} (${newTab})`}</span>
    </Link>
  );
}
