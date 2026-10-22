import { Link } from "@/components/atoms/link";
import type { Locale, Messages } from "@/lib/i18n";
import { navSections } from "@/lib/landing";
import { footerLinkClass, monoLabel } from "./styles";

type FooterNavProps = {
  locale: Locale;
  label: string;
  nav: Messages["header"]["nav"];
};

/** Jumps to the sections of the home page. */
export function FooterNav({ locale, label, nav }: FooterNavProps) {
  return (
    <nav aria-label={label} className="flex flex-col gap-3">
      <p aria-hidden="true" className={`text-background/50 ${monoLabel}`}>
        {label}
      </p>
      <ul className="grid grid-cols-2 gap-x-10 gap-y-2.5 text-base sm:grid-cols-3 md:w-fit">
        {navSections.map((id) => (
          <li key={id}>
            <Link href={`/${locale}#${id}`} data-jump="" className={footerLinkClass}>
              {nav[id]}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
