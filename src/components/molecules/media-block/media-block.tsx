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
    <figure data-story-grow className="m-0">
      <div className="overflow-hidden rounded-3xl">
        <Image
          src={image.src}
          width={image.width}
          height={image.height}
          alt={alt}
          priority={priority}
          data-story-zoom
          sizes="(min-width: 1024px) 70vw, 100vw"
          className="h-auto w-full group-data-[rail=on]/rail:max-h-[72vh] group-data-[rail=on]/rail:w-auto"
        />
      </div>
      {caption && (
        <Text as="small" size="sm" className="mt-2 block">
          <figcaption>{caption}</figcaption>
        </Text>
      )}
    </figure>
  );
}
