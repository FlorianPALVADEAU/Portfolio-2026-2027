import Image from "next/image";
import { Button } from "@/components/atoms/button";
import { Heading } from "@/components/atoms/heading";
import { ScrollSequence } from "@/features/scroll-sequence";
import type { Messages } from "@/lib/i18n";
import { genevaAscent, heroPhotoSlots } from "@/lib/landing";
import { cn } from "@/lib/utils";

type HeroSectionProps = {
  messages: Pick<Messages["home"], "badge" | "role" | "headline" | "cv" | "scroll" | "opening">;
  /** Public URL of the CV in the visitor's language; omitted when none has been added. */
  cvHref?: string | null;
  /** Public URLs of the photos to scatter around the headline; the first ones fill the slots. */
  photos?: readonly string[];
};

/**
 * The opening: a pinned stage that climbs out of Geneva while the visitor scrolls, ending on one
 * line. It always uses the dark palette so the footage and the white type read in every theme, and
 * it slides under the sticky header, which is 4.5rem tall.
 */
export function HeroSection({ messages, cvHref = null, photos = [] }: HeroSectionProps) {
  return (
    <section data-theme="dark" className="relative -mt-18 bg-black text-foreground">
      <ScrollSequence frames={genevaAscent}>
        {photos.slice(0, heroPhotoSlots.length).map((src, index) => {
          const slot = heroPhotoSlots[index];
          return (
            slot && (
              <div
                key={src}
                aria-hidden="true"
                style={{ rotate: `${slot.tilt}deg` }}
                className={cn("absolute", slot.className)}
              >
                <div
                  data-sequence-photo
                  className="relative size-full overflow-hidden rounded-lg shadow-2xl"
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 16vw, 34vw"
                    className="object-cover"
                  />
                </div>
              </div>
            )
          );
        })}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-(--gutter) text-center">
          <Heading level={1} size="display" data-sequence-reveal className="max-w-4xl">
            <span className="sr-only">Florian Palvadeau.</span> {messages.headline}
          </Heading>
          <p
            data-sequence-reveal
            className="font-mono text-sm tracking-widest text-muted-foreground uppercase"
          >
            {messages.role}
          </p>
        </div>
        <div
          data-sequence-fade
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-(--gutter) text-center"
        >
          <p className="font-mono text-xs tracking-widest text-foreground uppercase [text-shadow:0_1px_12px_rgb(0_0_0/0.7)]">
            Florian Palvadeau
          </p>
          <p className="max-w-4xl text-display font-semibold tracking-tight text-balance">
            {messages.opening}
          </p>
        </div>
        <div
          aria-hidden="true"
          data-sequence-fade
          className="absolute inset-x-0 bottom-28 flex flex-col items-center gap-3 font-mono text-xs tracking-widest text-foreground uppercase [text-shadow:0_1px_12px_rgb(0_0_0/0.7)] md:bottom-20"
        >
          <span>{messages.scroll}</span>
          <span className="h-10 w-px origin-top animate-pulse bg-current motion-reduce:animate-none" />
        </div>
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-3 px-(--gutter) md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-4 pb-6 font-mono text-xs tracking-widest text-foreground uppercase [text-shadow:0_1px_12px_rgb(0_0_0/0.7)]">
          <span>{messages.badge}</span>
          <span aria-hidden="true" className="hidden md:block" />
          <span className="md:justify-self-end">
            {cvHref && (
              <Button asChild size="sm" variant="outline">
                <a href={cvHref} download className="no-underline">
                  {messages.cv}
                </a>
              </Button>
            )}
          </span>
        </div>
      </ScrollSequence>
    </section>
  );
}
