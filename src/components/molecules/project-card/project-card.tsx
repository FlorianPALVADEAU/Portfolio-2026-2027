import Image from "next/image";
import { Badge } from "@/components/atoms/badge";
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

/** The title link stretches over the whole card, so the card is one focus stop with one name. */
export function ProjectCard({ href, title, summary, year, stack, cover }: ProjectCardProps) {
  return (
    <article className="group relative flex flex-col gap-4 rounded-xl border border-border bg-surface p-4 focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-ring">
      <div className="overflow-hidden rounded-lg">
        <Image
          src={cover.src}
          width={cover.width}
          height={cover.height}
          alt={cover.alt}
          sizes="(min-width: 1024px) 560px, 100vw"
          className="h-auto w-full motion-safe:transition-transform motion-safe:duration-(--duration-slow) motion-safe:group-hover:scale-105"
        />
      </div>
      <div className="flex items-baseline justify-between gap-4">
        <Heading level={3} size="xl">
          <Link
            href={href}
            className="no-underline after:absolute after:inset-0 after:content-[''] hover:text-foreground focus-visible:outline-none"
          >
            {title}
          </Link>
        </Heading>
        <Text as="span" size="sm" tone="muted" className="font-mono">
          {year}
        </Text>
      </div>
      <Text tone="muted" size="sm">
        {summary}
      </Text>
      <ul className="flex flex-wrap gap-2">
        {stack.map((name) => (
          <li key={name}>
            <Badge variant="outline" className="font-mono">
              {name}
            </Badge>
          </li>
        ))}
      </ul>
    </article>
  );
}
