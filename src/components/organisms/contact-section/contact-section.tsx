import type { ReactNode } from "react";
import { Container } from "@/components/atoms/container";
import { Section } from "@/components/atoms/section";
import { LocalTime } from "@/components/molecules/local-time";
import { ProfileRow } from "@/components/molecules/profile-row";
import { Reveal } from "@/features/reveal";
import type { Locale, Messages } from "@/lib/i18n";
import { profiles } from "@/lib/landing";

/** Where the owner lives, for the clock in the masthead. */
const TIME_ZONE = "Europe/Zurich";

type ContactSectionProps = {
  index: number;
  /** Accessible name; the visible heading is the closing text of the gallery above. */
  title: string;
  locale: Locale;
  messages: Messages["home"]["contact"];
  /** Writing, booking and activity, in the order they are read. */
  form?: ReactNode;
  booking?: ReactNode;
  activity?: ReactNode;
};

/**
 * Paper that carries on from the gallery's closing text: a masthead, the profiles as a large
 * index, then the ways to write or book a call and the proof of activity. Each block is a
 * hairline apart and sets its title in the left columns, its content in the right ones.
 */
export function ContactSection({
  index,
  title,
  locale,
  messages,
  form,
  booking,
  activity,
}: ContactSectionProps) {
  return (
    <Section
      id="contact"
      aria-label={title}
      data-paper=""
      className="relative scroll-mt-4 bg-background py-0 text-foreground"
    >
      <Container className="pt-12 pb-(--section-space) md:pt-20">
        <Reveal className="flex flex-col gap-24 md:gap-32">
          <div className="flex flex-col gap-16 md:gap-24">
            <p className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 font-mono text-sm tracking-widest uppercase">
              <span aria-hidden="true">{`[${String(index).padStart(2, "0")}]`}</span>
              <span>{messages.availability}</span>
              <LocalTime locale={locale} timeZone={TIME_ZONE} place={messages.location} />
            </p>
            <ul aria-label={messages.profiles} className="border-b border-border">
              {profiles.map(({ id, label, href }, position) => (
                <li key={id}>
                  <ProfileRow
                    order={position + 1}
                    label={label}
                    href={href}
                    newTab={messages.newTab}
                  />
                </li>
              ))}
            </ul>
          </div>
          {form}
          {booking}
          {activity}
        </Reveal>
      </Container>
    </Section>
  );
}
