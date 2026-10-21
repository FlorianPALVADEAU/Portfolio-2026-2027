import { Heading } from "@/components/atoms/heading";
import { Section } from "@/components/atoms/section";
import { Text } from "@/components/atoms/text";
import { ZoomGallery, ZoomWords } from "@/features/zoom-gallery";
import type { Messages } from "@/lib/i18n";
import { galleryItems } from "@/lib/landing";

type GallerySectionProps = {
  index: number;
  title: string;
  /** Heading of the closing text, which opens the section below. */
  closingTitle: string;
  messages: Messages["home"]["gallery"];
};

/**
 * A dark scroll-driven dive through photos, from the "Gallery" title to the invitation that
 * leads into the contact section, whose paper the background turns to at the end.
 */
export function GallerySection({ index, title, closingTitle, messages }: GallerySectionProps) {
  return (
    <Section id="gallery" aria-labelledby="gallery-title" className="relative scroll-mt-4 py-0">
      <ZoomGallery
        items={galleryItems}
        alts={messages.images}
        intro={
          <div className="flex flex-col items-center gap-4 px-(--gutter) text-center">
            <Text
              as="span"
              size="sm"
              className="font-mono uppercase tracking-widest"
              aria-hidden="true"
            >
              {`[${String(index).padStart(2, "0")}]`}
            </Text>
            <Heading
              level={2}
              id="gallery-title"
              className="text-[clamp(3rem,12vw,10rem)] leading-none font-medium"
            >
              {title}
            </Heading>
            <Text size="sm" tone="muted" className="max-w-xs">
              {messages.hint}
            </Text>
          </div>
        }
        outro={
          <div className="flex max-w-3xl flex-col items-center gap-6 px-(--gutter) text-center">
            <Heading
              level={2}
              className="text-[clamp(2.5rem,8vw,7rem)] leading-[1.02] font-medium tracking-tight"
            >
              <ZoomWords text={closingTitle} />
            </Heading>
            <Text className="max-w-[40ch] text-lg text-inherit md:text-xl">
              <ZoomWords text={messages.invitation} />
            </Text>
          </div>
        }
      />
    </Section>
  );
}
