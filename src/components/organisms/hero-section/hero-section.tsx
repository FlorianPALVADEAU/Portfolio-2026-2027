import Image from "next/image";
import { Button } from "@/components/atoms/button";
import { Heading } from "@/components/atoms/heading";
import { Link } from "@/components/atoms/link";
import { Entrance } from "@/features/entrance";
import type { Locale, Messages } from "@/lib/i18n";

type HeroSectionProps = {
  locale: Locale;
  messages: Pick<Messages["home"], "badge" | "role" | "tagline" | "cta" | "portraitAlt">;
};

/** The name is the monument: it takes the left nine columns, the portrait the last three. */
export function HeroSection({ locale, messages }: HeroSectionProps) {
  return (
    <section className="grid md:min-h-[calc(100svh-104px)] md:grid-cols-12">
      <Entrance className="flex flex-col justify-end gap-10 px-(--gutter) py-6 md:col-span-9 md:gap-16 md:py-10">
        <Heading
          level={1}
          size="display"
          className="text-[clamp(3.25rem,13.4vw,13rem)] leading-[0.84] font-semibold tracking-[-0.05em] text-balance"
        >
          Florian <br />
          Palvadeau
        </Heading>
        <div className="flex max-w-[46ch] flex-col gap-6">
          <p data-entrance className="text-lg">
            {`${messages.role}. ${messages.tagline}`}
          </p>
          <div data-entrance className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Button asChild size="lg">
              <Link
                href={`/${locale}#contact`}
                className="no-underline hover:text-accent-foreground"
              >
                {messages.cta}
              </Link>
            </Button>
            <p className="text-base">{messages.badge}</p>
          </div>
        </div>
      </Entrance>
      <div className="relative h-[60svh] md:col-span-3 md:h-auto">
        <Image
          src="/brand/portrait.webp"
          alt={messages.portraitAlt}
          fill
          priority
          sizes="(min-width: 768px) 25vw, 100vw"
          className="object-cover object-top"
        />
      </div>
    </section>
  );
}
