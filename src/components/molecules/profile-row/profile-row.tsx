import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Icon } from "@/components/atoms/icon";
import { Link } from "@/components/atoms/link";

type ProfileRowProps = {
  /** Position in the list, shown as `(01)`; decorative. */
  order: number;
  /** Brand name, set large. */
  label: string;
  href: string;
  /** The link saves a file instead of opening something. */
  download?: boolean;
  /**
   * Set for a link that leaves the site: it opens in a new tab, and this text announces that to
   * assistive technology. Omit it for a file or an email address.
   */
  externalLabel?: string;
};

/** The link without its scheme, which is how people read an address. */
const shown = (href: string) => href.replace(/^(https?:\/\/(www\.)?|mailto:)/, "");

/**
 * A full-width line of an index: the name in huge type, the address beside it. On hover or focus
 * the line fills with ink from below and the type turns to paper.
 */
export function ProfileRow({
  order,
  label,
  href,
  download = false,
  externalLabel,
}: ProfileRowProps) {
  const external = externalLabel !== undefined;
  return (
    <Link
      href={href}
      external={external}
      download={download}
      className="group relative flex items-center gap-4 overflow-hidden border-t border-border py-4 no-underline outline-offset-[-3px] hover:text-background focus-visible:text-background md:gap-8 md:py-6"
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 origin-bottom scale-y-0 bg-foreground transition-transform duration-500 ease-(--ease-out-expo) group-hover:scale-y-100 group-focus-visible:scale-y-100"
      />
      <span aria-hidden="true" className="relative w-8 shrink-0 font-mono text-sm md:w-14">
        {`(${String(order).padStart(2, "0")})`}
      </span>
      <span className="relative text-3xl font-semibold tracking-tight">
        {label}
        {external && <span className="sr-only">{` (${externalLabel})`}</span>}
      </span>
      <span aria-hidden="true" className="relative ml-auto hidden font-mono text-sm lg:inline">
        {shown(href)}
      </span>
      <Icon
        icon={download ? ArrowDown : ArrowUpRight}
        size="md"
        className="relative ml-auto transition-transform duration-500 ease-(--ease-out-expo) group-hover:translate-x-1 group-hover:-translate-y-1 group-focus-visible:translate-x-1 group-focus-visible:-translate-y-1 lg:ml-0"
      />
    </Link>
  );
}
