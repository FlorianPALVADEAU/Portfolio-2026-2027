"use client";

import { useEffect, useState } from "react";

type Track = { title: string; artist: string; url: string; playing: boolean };

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
    <p className={className}>
      {`${track.playing ? messages.playing : messages.lastPlayed}: `}
      <a href={track.url} target="_blank" rel="noopener noreferrer" className={linkClassName}>
        {`${track.title}, ${track.artist}`}
        <span className="sr-only">{` (${messages.newTab})`}</span>
      </a>
    </p>
  );
}
