import Image from "next/image";
import { Container } from "@/components/atoms/container";
import { Section } from "@/components/atoms/section";
import { LitText } from "@/features/lit-text";
import { Marquee } from "@/features/marquee";
import type { Messages } from "@/lib/i18n";
import { clients } from "@/lib/landing";
import { cn } from "@/lib/utils";

type IntroSectionProps = {
  title: string;
  messages: Messages["home"]["intro"];
  controls: Pick<Messages["home"]["marquee"], "pause" | "play">;
};

/** What the owner does, lit word by word as it scrolls in, above the companies worked with. */
export function IntroSection({ title, messages, controls }: IntroSectionProps) {
  return (
    <Section
      id="intro"
      aria-label={title}
      data-theme="dark"
      className="relative scroll-mt-4 bg-black text-foreground"
    >
      <Container className="flex flex-col gap-24 md:gap-32">
        <LitText
          text={messages.paragraph}
          className="mx-auto max-w-5xl text-center text-[clamp(1.75rem,3.8vw,3.5rem)] leading-[1.15] tracking-tight text-balance"
        />
        <Marquee
          items={clients.map(({ id, name, width, height, onWhite }) => ({
            id,
            content: (
              <Image
                src={`/brand/companies/${id}.svg`}
                alt={name}
                width={width}
                height={height}
                unoptimized
                className={cn(
                  "h-6 w-auto opacity-70 md:h-7",
                  onWhite ? "invert" : "brightness-0 invert",
                )}
              />
            ),
          }))}
          label={messages.clients}
          pauseLabel={controls.pause}
          playLabel={controls.play}
          className="border-0 bg-transparent px-0"
        />
      </Container>
    </Section>
  );
}
