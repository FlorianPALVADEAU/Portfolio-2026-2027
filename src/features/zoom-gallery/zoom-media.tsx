import Image from "next/image";
import type { GalleryItem } from "@/lib/landing";

type ZoomMediaProps = {
  item: GalleryItem;
  alt: string;
};

export function ZoomMedia({ item, alt }: ZoomMediaProps) {
  if (item.kind === "video") {
    return (
      <video
        src={item.src}
        poster={item.poster}
        aria-label={alt}
        muted
        loop
        playsInline
        preload="none"
        className="size-full object-cover"
      />
    );
  }
  return (
    <Image
      src={item.src}
      alt={alt}
      fill
      sizes="(min-width: 768px) 22vw, 40vw"
      className="object-cover"
    />
  );
}
