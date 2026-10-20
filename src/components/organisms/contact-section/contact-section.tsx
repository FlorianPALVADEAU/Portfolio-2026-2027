import Image from "next/image";
import type { ReactNode } from "react";
import { Container } from "@/components/atoms/container";
import { Link } from "@/components/atoms/link";
import { Section } from "@/components/atoms/section";
import type { Messages } from "@/lib/i18n";
import { profiles } from "@/lib/landing";

type ContactSectionProps = {
  title: string;
  messages: Messages["home"]["contact"];
  photo: Messages["home"]["photos"]["closing"];
  /** Slot for the contact form and booking facade. */
  children?: ReactNode;
};

export function ContactSection({ title, messages, photo, children }: ContactSectionProps) {
  return (
    <Section id="contact" aria-label={title} className="relative scroll-mt-4">
      <Container className="flex flex-col gap-10">
        <div className="grid gap-12 md:grid-cols-12">
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
        <figure className="-mx-(--gutter) m-0">
          <Image
            src="/photos/lavaux-church.jpg"
            alt={photo.alt}
            width={1920}
            height={1280}
            sizes="100vw"
            className="aspect-[4/5] w-full object-cover md:aspect-[21/9]"
          />
          <figcaption className="px-(--gutter) pt-3 text-sm">{photo.caption}</figcaption>
        </figure>
      </Container>
    </Section>
  );
}
