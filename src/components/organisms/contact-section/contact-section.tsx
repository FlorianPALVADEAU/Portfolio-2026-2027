import type { ReactNode } from "react";
import { Link } from "@/components/atoms/link";
import { LandingSection } from "@/components/organisms/landing-section";
import type { Messages } from "@/lib/i18n";
import { profiles } from "@/lib/landing";

type ContactSectionProps = {
  title: string;
  messages: Messages["home"]["contact"];
  /** Slot for the contact form and booking facade. */
  children?: ReactNode;
};

export function ContactSection({ title, messages, children }: ContactSectionProps) {
  return (
    <LandingSection id="contact" title={title} tone="clear">
      <div className="grid gap-12 md:grid-cols-12">
        <p className="max-w-[40ch] text-xl md:col-span-5">{messages.invitation}</p>
        <ul
          aria-label={messages.profiles}
          className="flex flex-col gap-2 md:col-span-6 md:col-start-7"
        >
          {profiles.map(({ id, label, href }) => (
            <li key={id}>
              <Link
                href={href}
                external
                className="inline-block text-[clamp(2.75rem,8vw,7rem)] leading-[1.02] font-semibold tracking-[-0.04em] no-underline"
              >
                {label}
                <span className="sr-only">{` (${messages.newTab})`}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {children}
    </LandingSection>
  );
}
