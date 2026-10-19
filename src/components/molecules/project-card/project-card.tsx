import Image from "next/image";
import { Heading } from "@/components/atoms/heading";
import { Link } from "@/components/atoms/link";
import { Text } from "@/components/atoms/text";

type ProjectCardProps = {
  href: string;
  title: string;
  summary: string;
  year: number;
  stack: readonly string[];
  cover: { src: string; width: number; height: number; alt: string };
};

/**
 * Text and a large cover side by side. The title link stretches over the whole card, so the card
 * is one focus stop with one name; `data-view-cursor` lets the page's cursor label follow the
 * pointer over it and the `data-reel-*` hooks let the works reel animate it.
 */
export function ProjectCard({ href, title, summary, year, stack, cover }: ProjectCardProps) {
  return (
    <article
      data-view-cursor
      data-reel-item
      className="group relative grid gap-6 focus-within:outline-2 focus-within:outline-offset-8 focus-within:outline-ring md:grid-cols-12 md:items-end"
    >
      <div className="flex flex-col gap-4 md:col-span-5">
        <Heading level={3} size="2xl">
          <span className="flex items-baseline">
            <span
              aria-hidden="true"
              className="inline-block w-0 -translate-x-full overflow-hidden opacity-0 motion-safe:transition-[width,opacity,translate] motion-safe:duration-500 motion-safe:ease-out group-focus-within:w-[1.1em] group-focus-within:translate-x-0 group-focus-within:opacity-100 group-hover:w-[1.1em] group-hover:translate-x-0 group-hover:opacity-100"
            >
              →
            </span>
            <Link
              href={href}
              data-reel-title
              className="block no-underline after:absolute after:inset-0 after:content-[''] hover:text-foreground focus-visible:outline-none"
            >
              {title}
            </Link>
          </span>
        </Heading>
        <Text>{summary}</Text>
        <p data-reel-tags>{[year, ...stack].join(", ")}</p>
      </div>
      <div className="overflow-hidden md:col-span-7">
        <Image
          src={cover.src}
          width={cover.width}
          height={cover.height}
          alt={cover.alt}
          data-reel-image
          sizes="(min-width: 768px) 58vw, 100vw"
          className="aspect-video w-full object-cover motion-safe:transition-transform motion-safe:duration-(--duration-slow) motion-safe:ease-out motion-safe:group-hover:scale-105"
        />
      </div>
    </article>
  );
}
