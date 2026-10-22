"use client";

import { useEffect, useState } from "react";
import { NowPlayingCard, type NowPlayingTrack } from "@/components/molecules/now-playing-card";

type NowPlayingProps = {
  messages: { playing: string; lastPlayed: string; newTab: string };
  className?: string;
};

/**
 * The track playing on the owner's Spotify, or the last one played. Asked after hydration so the
 * page never waits for it, and nothing is rendered when there is no track or no answer.
 */
export function NowPlaying({ messages, className }: NowPlayingProps) {
  const [track, setTrack] = useState<NowPlayingTrack | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/now-playing", { signal: controller.signal })
      .then((reply) => (reply.status === 200 ? (reply.json() as Promise<NowPlayingTrack>) : null))
      .then(setTrack)
      .catch(() => setTrack(null));
    return () => controller.abort();
  }, []);

  if (!track) return null;

  return <NowPlayingCard track={track} messages={messages} {...(className ? { className } : {})} />;
}
