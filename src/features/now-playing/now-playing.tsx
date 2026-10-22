"use client";

import { ArrowUpRight, Music2 } from "lucide-react";
import Image from "next/image";
import { type CSSProperties, useEffect, useState } from "react";
import { Icon } from "@/components/atoms/icon";
import { cn } from "@/lib/utils";

type Track = {
  title: string;
  artist: string;
  url: string;
  cover: string | null;
  playing: boolean;
};

/** Bounce length of each bar of the meter, in seconds. */
const METER = [0.9, 0.7, 1.1, 0.8, 1] as const;

type NowPlayingProps = {
  messages: { playing: string; lastPlayed: string; newTab: string };
  className?: string;
};

/**
 * The track playing on the owner's Spotify, or the last one played, as one card that links to it:
 * the album cover, with a level meter over it while the track plays, then the title and artist.
 * Asked after hydration so the page never waits for it, and nothing is rendered when there is no
 * track or no answer. The card is a single link, so a keyboard visits it once.
 */
export function NowPlaying({ messages, className }: NowPlayingProps) {
  const [track, setTrack] = useState<Track | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/now-playing", { signal: controller.signal })
      .then((reply) => (reply.status === 200 ? (reply.json() as Promise<Track>) : null))
      .then(setTrack)
      .catch(() => setTrack(null));
    return () => controller.abort();
  }, []);

  if (!track) return null;

  return (
    <a
      href={track.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "pill-in group flex w-full min-w-0 max-w-sm items-center gap-4 rounded-2xl border border-background/15 bg-background/5 p-2.5 pr-4 no-underline transition-[background-color,border-color,translate] duration-500 ease-(--ease-out-expo) hover:-translate-y-0.5 hover:border-background/35 hover:bg-background/10 focus-visible:border-background/35 focus-visible:bg-background/10 motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        className,
      )}
    >
      <span className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-background/10">
        {track.cover ? (
          <Image
            src={track.cover}
            alt=""
            fill
            sizes="64px"
            className="object-cover transition-transform duration-700 ease-(--ease-out-expo) group-hover:scale-110 motion-reduce:transition-none"
          />
        ) : (
          <Icon icon={Music2} className="absolute inset-0 m-auto size-6 opacity-60" />
        )}
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-x-0 bottom-0 flex h-6 items-end justify-center gap-[3px] bg-gradient-to-t from-black/70 to-transparent px-2 pb-1.5 text-white",
            !track.playing && "hidden",
          )}
        >
          {METER.map((duration, bar) => (
            <span
              key={duration}
              style={{ "--i": bar, "--d": `${duration}s` } as CSSProperties}
              className="meter-bar h-3 w-[3px] origin-bottom rounded-full bg-current"
            />
          ))}
        </span>
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="flex items-center gap-2 font-mono text-xs tracking-widest uppercase opacity-60">
          {track.playing && (
            <span aria-hidden="true" className="relative flex size-1.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-current motion-reduce:hidden" />
              <span className="relative size-1.5 rounded-full bg-current" />
            </span>
          )}
          {track.playing ? messages.playing : messages.lastPlayed}
        </span>
        <span className="truncate text-base font-medium">{track.title}</span>
        <span className="truncate text-sm text-background/70">{track.artist}</span>
      </span>
      <Icon
        icon={ArrowUpRight}
        className="size-5 shrink-0 opacity-50 transition-[translate,opacity] duration-500 ease-(--ease-out-expo) group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100 motion-reduce:transition-none"
      />
      <span className="sr-only">{`(${messages.newTab})`}</span>
    </a>
  );
}
