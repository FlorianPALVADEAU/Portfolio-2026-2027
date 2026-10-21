import Image from "next/image";
import { Section } from "@/components/atoms/section";
import { TrustBadge } from "@/components/molecules/trust-badge";
import { LitText } from "@/features/lit-text";
import { Marquee } from "@/features/marquee";
import type { Messages } from "@/lib/i18n";
import { clients } from "@/lib/landing";
import { cn } from "@/lib/utils";

type IntroSectionProps = {
  title: string;
  messages: Messages["home"]["intro"];
};

/**
 * What the owner does, above the companies worked with. It slides over the hero, then stays in
 * place while the paragraph lights up word by word. It is opaque and above the hero (`z-10`).
 */
export function IntroSection({ title, messages }: IntroSectionProps) {
  return (
    <Section
      id="intro"
      aria-label={title}
      data-theme="dark"
      className="relative z-10 scroll-mt-4 bg-black py-0 text-foreground"
    >
      <LitText
        text={messages.paragraph}
        stageClassName="flex flex-col justify-center gap-20 px-(--gutter) motion-reduce:min-h-svh motion-reduce:py-(--section-space) md:gap-28"
        className="mx-auto max-w-5xl text-center text-[clamp(1.75rem,3.8vw,3.5rem)] leading-[1.15] tracking-tight text-balance"
      >
        <div className="flex flex-col items-center gap-6 md:flex-row md:gap-10">
          <TrustBadge
            text={messages.trust.replace("{count}", String(clients.length))}
            className="shrink-0"
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
            className="min-w-0 flex-1 border-0 bg-transparent px-0"
            speed={190}
            fade
          />
        </div>
      </LitText>
    </Section>
  );
}
