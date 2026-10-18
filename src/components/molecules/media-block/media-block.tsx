import Image from "next/image";
import { Text } from "@/components/atoms/text";

type MediaBlockProps = {
  image: { src: string; width: number; height: number };
  alt: string;
  caption?: string | undefined;
};

export function MediaBlock({ image, alt, caption }: MediaBlockProps) {
  return (
    <figure className="m-0">
      <Image
        src={image.src}
        width={image.width}
        height={image.height}
        alt={alt}
        sizes="(min-width: 1024px) 960px, 100vw"
        className="h-auto w-full rounded-lg border border-border"
      />
      {caption && (
        <Text as="small" tone="muted" size="sm" className="mt-2 block">
          <figcaption>{caption}</figcaption>
        </Text>
      )}
    </figure>
  );
}
