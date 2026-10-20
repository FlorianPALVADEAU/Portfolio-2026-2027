import Image from "next/image";
import { Text } from "@/components/atoms/text";
import { Frame } from "@/features/frame-rail";
import type { Messages } from "@/lib/i18n";

type ClosingFrameProps = {
  messages: Messages["home"]["skills"]["closing"];
  photo: Messages["home"]["photos"]["closing"];
};

/**
 * Frame 6: a photo that fills the screen as it arrives, then shrinks into a rounded card with
 * texts over it (see `addFinale` in the rail). Stacked, it is simply that card, texts showing.
 */
export function ClosingFrame({ messages, photo }: ClosingFrameProps) {
  return (
    <Frame bleed aria-labelledby="skills-closing">
      <figure className="relative m-0 aspect-4/5 w-full md:aspect-21/9 in-data-[motion=rail]:h-svh in-data-[motion=rail]:aspect-auto">
        <div
          data-frame-finale
          className="absolute inset-0 overflow-hidden rounded-3xl in-data-[motion=rail]:rounded-none"
        >
          <div data-frame-finale-image className="absolute inset-0">
            <Image
              src="/photos/lavaux-church.jpg"
              alt={photo.alt}
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-black/10" />
        </div>
        <div className="absolute inset-0 flex flex-col justify-end gap-4 p-6 text-white md:p-12 in-data-[motion=rail]:inset-x-[7%] in-data-[motion=rail]:inset-y-[9%]">
          <Text data-frame-finale-text className="font-mono text-sm tracking-widest uppercase">
            {messages.eyebrow}
          </Text>
          <h3
            id="skills-closing"
            data-frame-finale-text
            className="max-w-[16ch] text-[clamp(2.5rem,7vw,6.5rem)] leading-[1.02] font-semibold tracking-[-0.04em] text-balance"
          >
            {photo.caption}
          </h3>
          <Text data-frame-finale-text className="max-w-[40ch] text-lg md:text-xl">
            {messages.statement}
          </Text>
        </div>
      </figure>
    </Frame>
  );
}
