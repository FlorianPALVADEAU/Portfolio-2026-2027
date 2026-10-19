import Image from "next/image";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Container } from "@/components/atoms/container";
import { Heading } from "@/components/atoms/heading";
import { Link } from "@/components/atoms/link";
import { Section } from "@/components/atoms/section";
import { Text } from "@/components/atoms/text";
import { Entrance } from "@/features/entrance";
import type { Locale, Messages } from "@/lib/i18n";
import { heroStack } from "@/lib/landing";

type HeroSectionProps = {
  locale: Locale;
  messages: Pick<
    Messages["home"],
    "badge" | "role" | "tagline" | "cta" | "cv" | "scroll" | "portraitAlt"
  >;
  /** Public URL of the CV in the visitor's language; omitted when none has been added. */
  cvHref?: string | null;
};

export function HeroSection({ locale, messages, cvHref = null }: HeroSectionProps) {
  return (
    <Section className="relative overflow-hidden pt-8 md:pt-16">
      <Container>
        <Entrance className="grid items-center gap-12 md:grid-cols-[1.25fr_1fr]">
          <div className="flex flex-col gap-6">
            <div data-entrance>
              <Badge variant="outline">
                <span aria-hidden="true" className="size-2 rounded-full bg-accent" />
                {messages.badge}
              </Badge>
            </div>
            <Heading level={1} size="display">
              Florian Palvadeau
            </Heading>
            <p
              data-entrance
              className="text-3xl font-semibold tracking-tight text-accent md:text-4xl"
            >
              {messages.role}
            </p>
            <Text data-entrance tone="muted" size="lg" className="max-w-prose">
              {messages.tagline}
            </Text>
            <ul data-entrance className="flex flex-wrap gap-2">
              {heroStack.map((name) => (
                <li key={name}>
                  <Badge variant="default" className="font-mono">
                    {name}
                  </Badge>
                </li>
              ))}
            </ul>
            <div data-entrance className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link
                  href={`/${locale}#contact`}
                  className="no-underline hover:text-accent-foreground"
                >
                  {messages.cta}
                </Link>
              </Button>
              {cvHref && (
                <Button asChild size="lg" variant="outline">
                  <a href={cvHref} download className="no-underline">
                    {messages.cv}
                  </a>
                </Button>
              )}
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-sm md:max-w-none">
            <div
              aria-hidden="true"
              className="absolute inset-8 -z-10 rounded-full bg-accent opacity-25 blur-3xl"
            />
            <Image
              src="/brand/portrait.webp"
              alt={messages.portraitAlt}
              width={910}
              height={1137}
              priority
              sizes="(min-width: 768px) 40vw, 90vw"
              className="h-auto w-full rounded-2xl border border-border object-cover object-top md:max-h-[85svh]"
            />
          </div>
        </Entrance>
        <p
          aria-hidden="true"
          className="mt-12 hidden items-center gap-3 font-mono text-xs uppercase tracking-widest text-muted-foreground md:flex"
        >
          <span className="h-px w-12 bg-current" />
          {messages.scroll}
        </p>
      </Container>
    </Section>
  );
}
