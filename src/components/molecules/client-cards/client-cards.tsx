import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { Heading } from "@/components/atoms/heading";
import { Icon } from "@/components/atoms/icon";
import { Link } from "@/components/atoms/link";
import { Rise } from "@/components/atoms/rise";
import { RiseText } from "@/components/atoms/rise-text";
import { clients } from "@/lib/landing";
import { cn } from "@/lib/utils";

const CARD_CLASS =
  "group relative flex h-24 items-center justify-center rounded-md bg-muted/50 ring-1 ring-border/40 no-underline transition-colors duration-(--duration-base) md:h-28";

type ClientCardsProps = {
  title: string;
  /** Spoken after the name of a card that opens the company's site. */
  newTab: string;
};

/**
 * The companies worked with, one still card each on paper: the logo in dark, lifted on hover. A
 * card links to the company's site when its address is known, and is a plain tile otherwise.
 */
export function ClientCards({ title, newTab }: ClientCardsProps) {
  return (
    <div className="grid gap-8 border-t border-border pt-8 md:grid-cols-12">
      <div className="flex flex-col gap-4 md:col-span-4">
        <Heading level={3} size="xl">
          <RiseText>{title}</RiseText>
        </Heading>
      </div>
      <ul className="grid grid-cols-2 gap-2 md:col-span-8 md:col-start-5 md:grid-cols-4">
        {clients.map(({ id, name, width, height, onWhite, url }) => {
          const logo = (
            <Image
              src={`/brand/companies/${id}.svg`}
              alt={url ? "" : name}
              width={width}
              height={height}
              unoptimized
              className={cn(
                "h-5 w-auto max-w-[70%] opacity-60 transition-opacity duration-(--duration-base) group-hover:opacity-100 md:h-6",
                onWhite ? "mix-blend-multiply" : "brightness-0",
              )}
            />
          );
          return (
            <li key={id}>
              <Rise>
                {url ? (
                  <Link
                    href={url}
                    external
                    className={cn(CARD_CLASS, "hover:bg-muted hover:text-foreground")}
                  >
                    {logo}
                    <Icon
                      icon={ArrowUpRight}
                      size="sm"
                      className="absolute top-2.5 right-2.5 opacity-0 transition-opacity duration-(--duration-base) group-hover:opacity-60 group-focus-visible:opacity-60"
                    />
                    <span className="sr-only">{`${name} (${newTab})`}</span>
                  </Link>
                ) : (
                  <div className={CARD_CLASS}>{logo}</div>
                )}
              </Rise>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
