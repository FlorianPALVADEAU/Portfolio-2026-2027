"use client";

import { type CSSProperties, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Track = { title: string; artist: string; url: string; playing: boolean };

/** Bounce length of each bar of the meter, in seconds. */
const METER = [0.9, 0.7, 1.1, 0.8, 1] as const;

type NowPlayingProps = {
  messages: { playing: string; lastPlayed: string; newTab: string };
  className?: string;
  linkClassName?: string;
};

/**
 * The track playing on the owner's Spotify, or the last one played. Asked after hydration so the
 * page never waits for it, and nothing is rendered when there is no track or no answer.
 */
export function NowPlaying({ messages, className, linkClassName }: NowPlayingProps) {
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
    <p className={cn("pill-in flex min-w-0 max-w-full items-center gap-3", className)}>
      <span aria-hidden="true" className="flex h-4 shrink-0 items-end gap-[2px]">
        {METER.map((duration, bar) => (
          <span
            key={duration}
            style={{ "--i": bar, "--d": `${duration}s` } as CSSProperties}
            className={cn(
              "h-full w-[2px] origin-bottom rounded-full bg-current",
              track.playing ? "meter-bar" : "scale-y-[0.55]",
            )}
          />
        ))}
      </span>
      <span className="min-w-0 truncate">
        <span className="font-mono text-xs tracking-widest uppercase opacity-60">{`${track.playing ? messages.playing : messages.lastPlayed} `}</span>
        <a
          href={track.url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn("font-medium", linkClassName)}
        >
          {`${track.title}, ${track.artist}`}
          <span className="sr-only">{` (${messages.newTab})`}</span>
        </a>
      </span>
    </p>
  );
}
