import { ArrowUpRight } from "lucide-react";
import { Icon } from "@/components/atoms/icon";
import { Link } from "@/components/atoms/link";

type ProfileRowProps = {
  /** Position in the list, shown as `(01)`; decorative. */
  order: number;
  /** Brand name, set large. */
  label: string;
  href: string;
  /** Announces that the link leaves the site. */
  newTab: string;
};

/** The link without its scheme, which is how people read an address. */
const shown = (href: string) => href.replace(/^https?:\/\/(www\.)?/, "");

/**
 * A full-width line of an index: the name in huge type, the address beside it. On hover or focus
 * the line fills with ink from below and the type turns to paper.
 */
export function ProfileRow({ order, label, href, newTab }: ProfileRowProps) {
  return (
    <Link
      href={href}
      external
      className="group relative flex items-center gap-4 overflow-hidden border-t border-border py-5 no-underline outline-offset-[-3px] hover:text-background focus-visible:text-background md:gap-8 md:py-7"
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 origin-bottom scale-y-0 bg-foreground transition-transform duration-500 ease-(--ease-out-expo) group-hover:scale-y-100 group-focus-visible:scale-y-100"
      />
      <span
        aria-hidden="true"
        className="relative w-8 shrink-0 self-start pt-3 font-mono text-sm md:w-14 md:pt-5"
      >
        {`(${String(order).padStart(2, "0")})`}
      </span>
      <span className="relative text-[clamp(3rem,11vw,9.5rem)] leading-[0.95] font-semibold tracking-[-0.05em]">
        {label}
        <span className="sr-only">{` (${newTab})`}</span>
      </span>
      <span aria-hidden="true" className="relative ml-auto hidden font-mono text-sm lg:inline">
        {shown(href)}
      </span>
      <Icon
        icon={ArrowUpRight}
        size="lg"
        className="relative ml-auto size-8 transition-transform duration-500 ease-(--ease-out-expo) group-hover:translate-x-1 group-hover:-translate-y-1 group-focus-visible:translate-x-1 group-focus-visible:-translate-y-1 md:size-12 lg:ml-0"
      />
    </Link>
  );
}
