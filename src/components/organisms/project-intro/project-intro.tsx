import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { Heading } from "@/components/atoms/heading";
import { Icon } from "@/components/atoms/icon";
import { Link } from "@/components/atoms/link";
import { Text } from "@/components/atoms/text";
import { StoryPanel } from "@/components/molecules/story-panel";
import { Entrance } from "@/features/entrance";
import { VideoPlayer } from "@/features/video-player";

type PlayerLabels = Parameters<typeof VideoPlayer>[0]["labels"];

type ProjectIntroProps = {
  title: string;
  summary: string;
  facts: readonly { label: string; value: string }[];
  stack: { title: string; items: readonly string[] } | null;
  links: readonly { id: string; href: string; label: string }[];
  /** The picture above the title, or the video that opens on it. */
  teaser: {
    poster: { src: string; width: number; height: number };
    video?: string | undefined;
    label: string;
  } | null;
  playerLabels: PlayerLabels;
};

const LABEL = "font-mono text-xs uppercase tracking-widest text-accent";

/** Opening screen of a project: a picture or video, the name large below it, the facts beside. */
export function ProjectIntro({
  title,
  summary,
  facts,
  stack,
  links,
  teaser,
  playerLabels,
}: ProjectIntroProps) {
  return (
    <StoryPanel size="intro" className="relative">
      <span
        aria-hidden="true"
        data-story-cue
        className="absolute right-[3vw] bottom-8 hidden text-3xl transition-opacity duration-(--duration-slow) group-data-[rail=on]/rail:block"
      >
        →
      </span>
      <Entrance className="flex flex-1 flex-col justify-end gap-16 py-24 lg:py-0">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-x-12">
          <div className="flex flex-col gap-8 lg:col-span-8">
            {teaser && (
              <div
                data-entrance
                data-story-frame
                className="w-full lg:w-[min(100%,calc((100dvh-24rem)*1.7778))]"
              >
                {teaser.video ? (
                  <VideoPlayer
                    src={teaser.video}
                    poster={teaser.poster}
                    label={teaser.label}
                    labels={playerLabels}
                  />
                ) : (
                  <Image
                    src={teaser.poster.src}
                    width={teaser.poster.width}
                    height={teaser.poster.height}
                    alt={teaser.label}
                    priority
                    sizes="(min-width: 1024px) 60vw, 100vw"
                    className="aspect-video w-full rounded-3xl object-cover"
                  />
                )}
              </div>
            )}
            <Heading
              level={1}
              size="display"
              className="text-[clamp(3rem,7vw,7.5rem)] leading-[0.92]"
            >
              {title}
            </Heading>
          </div>
          <div className="flex flex-col gap-8 lg:col-span-4 lg:pb-3">
            <Text
              data-entrance
              className="max-w-[26ch] text-[clamp(1.25rem,1.9vw,1.75rem)] leading-snug font-semibold text-balance"
            >
              {summary}
            </Text>
            <dl data-entrance className="grid grid-cols-2 gap-x-8 gap-y-5 text-sm">
              {facts.map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-1">
                  <dt className={LABEL}>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
              {stack && (
                <div className="col-span-2 flex flex-col gap-1">
                  <dt className={LABEL}>{stack.title}</dt>
                  <dd>{stack.items.join(" · ")}</dd>
                </div>
              )}
            </dl>
            {links.length > 0 && (
              <ul data-entrance className="flex flex-wrap gap-3">
                {links.map(({ id, href, label }, index) => (
                  <li key={id}>
                    <Link
                      href={href}
                      external
                      className={`group/link inline-flex min-h-11 items-center gap-2 rounded-full border px-5 text-sm font-medium no-underline transition-colors ${index === 0 ? "border-accent bg-accent text-accent-foreground hover:bg-transparent hover:text-accent" : "border-border bg-surface hover:border-accent hover:text-accent"}`}
                    >
                      {label}
                      <Icon
                        icon={ArrowUpRight}
                        size="sm"
                        className="transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Entrance>
    </StoryPanel>
  );
}
