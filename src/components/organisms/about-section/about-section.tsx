import { Heading } from "@/components/atoms/heading";
import { Section } from "@/components/atoms/section";
import { Text } from "@/components/atoms/text";
import { LiquidImage } from "@/features/liquid-image";
import { PhotoTrail } from "@/features/photo-trail";
import { PortraitReveal } from "@/features/portrait-reveal";
import type { Messages } from "@/lib/i18n";

const factKeys = ["since", "participants", "availability"] as const;

type AboutSectionProps = {
  index: number;
  title: string;
  messages: Messages["home"]["about"];
  /** Public URLs of the photos that follow the pointer on desktop. */
  trailPhotos?: readonly string[];
};

/**
 * Who the owner is, in one held screen: a portrait that opens from its centre, then a hook, a
 * short paragraph and three facts. It continues the dark intro: it is pulled up over the end of
 * the intro stage and stays transparent for that first viewport, so the intro can fade out
 * behind the opening portrait.
 */
export function AboutSection({ index, title, messages, trailPhotos = [] }: AboutSectionProps) {
  return (
    <Section
      id="about"
      aria-label={title}
      data-theme="dark"
      className="relative z-10 scroll-mt-4 bg-[linear-gradient(to_bottom,transparent_100svh,black_100svh)] py-0 text-foreground motion-reduce:bg-black"
    >
      <PortraitReveal className="grid content-center gap-6 px-(--gutter) motion-reduce:min-h-svh motion-reduce:py-(--section-space) md:grid-cols-12 md:items-center md:gap-10">
        <PhotoTrail photos={trailPhotos} />
        <figure
          data-portrait-frame
          className="relative m-0 aspect-[4/5] h-[34svh] justify-self-center overflow-hidden md:col-span-5 md:col-start-2 md:h-[68svh] motion-reduce:h-auto motion-reduce:w-full motion-reduce:max-w-sm"
        >
          <LiquidImage
            data-portrait-image
            src="/brand/portrait.webp"
            alt={messages.portraitAlt}
            sizes="(min-width: 768px) 40vw, 60vw"
            imageClassName="contrast-110 grayscale"
          />
        </figure>
        <div className="relative z-10 flex flex-col gap-4 md:col-span-5 md:col-start-8 md:gap-6">
          <Text
            data-portrait-line
            as="span"
            size="sm"
            tone="muted"
            className="font-mono uppercase tracking-widest"
          >
            <span aria-hidden="true">{`[${String(index).padStart(2, "0")}] `}</span>
            {title}
          </Text>
          <Heading
            level={2}
            size="3xl"
            data-portrait-line
            className="text-[clamp(1.75rem,3.2vw,3rem)] leading-[1.1] font-medium"
          >
            {messages.hook}
          </Heading>
          <Text data-portrait-line tone="muted" className="max-w-prose">
            {messages.text}
          </Text>
          <div data-portrait-line className="mt-2 border-t border-border pt-5">
            <dl className="grid grid-cols-3 gap-4">
              {factKeys.map((key) => (
                <div
                  key={key}
                  data-portrait-line
                  className="flex flex-col-reverse justify-end gap-1"
                >
                  <dt className="text-xs text-muted-foreground">{messages.facts[key].label}</dt>
                  <dd className="m-0 text-lg font-medium whitespace-nowrap md:text-xl">
                    {messages.facts[key].value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </PortraitReveal>
    </Section>
  );
}
