import type { ReactNode } from "react";
import { Link } from "@/components/atoms/link";
import { Text } from "@/components/atoms/text";
import { LandingSection } from "@/components/organisms/landing-section";
import type { Messages } from "@/lib/i18n";
import { profiles } from "@/lib/landing";

type ContactSectionProps = {
  index: number;
  title: string;
  messages: Messages["home"]["contact"];
  /** Slot for the contact form and booking facade. */
  children?: ReactNode;
};

export function ContactSection({ index, title, messages, children }: ContactSectionProps) {
  return (
    <LandingSection id="contact" index={index} title={title} tone="clear">
      <div className="grid gap-12 md:grid-cols-2">
        <div className="flex flex-col gap-6">
          <Text size="lg" className="max-w-prose">
            {messages.invitation}
          </Text>
          <ul aria-label={messages.profiles} className="flex flex-wrap gap-x-8 gap-y-3">
            {profiles.map(({ id, label, href }) => (
              <li key={id}>
                <Link href={href} external className="text-lg font-semibold">
                  {label}
                  <span className="sr-only">{` (${messages.newTab})`}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {children}
      </div>
    </LandingSection>
  );
}
