import Image from "next/image";
import { Text } from "@/components/atoms/text";

type MediaBlockProps = {
  image: { src: string; width: number; height: number };
  alt: string;
  caption?: string | undefined;
  /** Loads at once: for the picture that opens a page. */
  priority?: boolean;
};

export function MediaBlock({ image, alt, caption, priority = false }: MediaBlockProps) {
  return (
    <figure data-story-grow data-story-velocity className="m-0">
      <div data-story-frame className="overflow-hidden rounded-3xl">
        <div data-story-parallax>
          <Image
            src={image.src}
            width={image.width}
            height={image.height}
            alt={alt}
            priority={priority}
            data-story-zoom
            // In the sideways story a picture is as high as the screen allows, so its width follows its shape.
            sizes={`(min-width: 1024px) calc((100vh - 7.5rem) * ${image.width / image.height}), 100vw`}
            className="h-auto w-full group-data-[rail=on]/rail:h-[calc(100dvh-7.5rem)] group-data-[rail=on]/rail:w-auto group-data-[rail=on]/rail:max-w-none group-data-[rail=on]/rail:object-cover"
          />
        </div>
      </div>
      {caption && (
        <Text as="small" size="sm" className="mt-2 block">
          <figcaption>{caption}</figcaption>
        </Text>
      )}
    </figure>
  );
}
