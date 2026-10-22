import Image from "next/image";
import { Button } from "@/components/atoms/button";
import { Heading } from "@/components/atoms/heading";
import { RotatingText } from "@/features/rotating-text";
import { ScrollSequence } from "@/features/scroll-sequence";
import type { Messages } from "@/lib/i18n";
import { genevaAscent, heroPhotoSlots } from "@/lib/landing";
import { cn } from "@/lib/utils";

type HeroSectionProps = {
  messages: Pick<Messages["home"], "badge" | "role" | "headline" | "cv" | "opening">;
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
                data-depth={slot.depth}
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
                    // Wide photos are cropped to a narrow frame, so the file must be much wider than the frame.
                    sizes="(min-width: 768px) 40vw, 80vw"
                    quality={92}
                    className="object-cover"
                  />
                </div>
              </div>
            )
          );
        })}
        <div
          data-depth={-0.3}
          className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-(--gutter) text-center"
        >
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
          <p
            data-entrance=""
            className="font-mono text-xs tracking-widest text-foreground uppercase [text-shadow:0_1px_12px_rgb(0_0_0/0.7)]"
          >
            Florian Palvadeau
          </p>
          <div data-entrance="">
            <RotatingText
              base={messages.opening.base}
              phrases={messages.opening.phrases}
              className="max-w-5xl text-[clamp(2.5rem,1rem+6vw,7rem)] leading-[0.95] font-semibold tracking-tight text-balance"
            />
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-4 px-(--gutter) pb-8 font-mono text-xs tracking-widest text-foreground uppercase md:grid md:grid-cols-[1fr_auto_1fr] md:gap-4 md:pb-6 [text-shadow:0_1px_12px_rgb(0_0_0/0.7)]">
          <span
            data-entrance=""
            className="inline-flex h-10 w-full max-w-xs items-center justify-center gap-2.5 rounded-full border border-foreground/40 bg-foreground/10 px-5 text-center backdrop-blur-md md:w-auto md:max-w-none md:justify-self-start"
          >
            <span aria-hidden="true" className="relative flex size-2 shrink-0">
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 motion-reduce:hidden" />
              <span className="relative size-2 rounded-full bg-emerald-400" />
            </span>
            {messages.badge}
          </span>
          <span aria-hidden="true" className="hidden md:block" />
          {cvHref && (
            <Button
              asChild
              data-entrance=""
              variant="outline"
              className="h-10 w-full max-w-xs rounded-full border-foreground/40 bg-foreground/10 px-5 font-mono text-xs tracking-widest uppercase backdrop-blur-md hover:bg-foreground/20 md:w-auto md:max-w-none md:justify-self-end"
            >
              <a href={cvHref} download className="no-underline">
                {messages.cv}
              </a>
            </Button>
          )}
        </div>
      </ScrollSequence>
    </section>
  );
}
