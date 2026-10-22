import type { ComponentProps, ReactNode } from "react";
import { Container } from "@/components/atoms/container";
import { Rise } from "@/components/atoms/rise";
import { Section } from "@/components/atoms/section";
import { ClientCards } from "@/components/molecules/client-cards";
import { ProfileRow } from "@/components/molecules/profile-row";
import { RiseReveal } from "@/features/rise-reveal";
import type { Messages } from "@/lib/i18n";
import { profiles } from "@/lib/landing";

type ProfileRowItem = { id: string } & Omit<ComponentProps<typeof ProfileRow>, "order">;

type ContactSectionProps = {
  index: number;
  /** Accessible name; the visible heading is the closing text of the gallery above. */
  title: string;
  messages: Messages["home"]["contact"];
  /** Last line of the profile index, shown when the CV file exists. */
  cv?: { label: string; href: string | null };
  /** Address to write to, read from the environment; without it the line is left out. */
  email?: string | undefined;
  /** Writing, where to find the owner and activity, in the order they are read. */
  form?: ReactNode;
  details?: ReactNode;
  activity?: ReactNode;
};

/**
 * Paper that carries on from the gallery's closing text: a masthead, the profiles as a large
 * index, then the form, where to find the owner and the proof of activity. Each block is a
 * hairline apart and sets its title in the left columns, its content in the right ones.
 */
export function ContactSection({
  index,
  title,
  messages,
  cv,
  email,
  form,
  details,
  activity,
}: ContactSectionProps) {
  const rows: ProfileRowItem[] = [
    ...profiles.map(({ id, label, href }) => ({
      id,
      label,
      href,
      externalLabel: messages.newTab,
    })),
    ...(cv?.href ? [{ id: "cv", label: cv.label, href: cv.href, download: true }] : []),
    ...(email ? [{ id: "email", label: messages.email, href: `mailto:${email}` }] : []),
  ];

  return (
    <Section
      id="contact"
      aria-label={title}
      data-paper=""
      className="relative scroll-mt-4 bg-background py-0 text-foreground"
    >
      <Container className="pt-12 pb-(--section-space) md:pt-20">
        <RiseReveal className="flex flex-col gap-16 md:gap-20">
          <div className="flex flex-col gap-12 md:gap-16">
            <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 font-mono text-sm tracking-widest uppercase">
              <Rise aria-hidden="true">{`[${String(index).padStart(2, "0")}]`}</Rise>
              <Rise>{messages.availability}</Rise>
              <Rise>{messages.location}</Rise>
            </div>
            <ul aria-label={messages.profiles} className="border-b border-border">
              {rows.map(({ id, ...row }, position) => (
                <li key={id}>
                  <Rise>
                    <ProfileRow order={position + 1} {...row} />
                  </Rise>
                </li>
              ))}
            </ul>
          </div>
          {form}
          {details}
          {activity}
          <ClientCards title={messages.clients} newTab={messages.newTab} />
        </RiseReveal>
      </Container>
    </Section>
  );
}
