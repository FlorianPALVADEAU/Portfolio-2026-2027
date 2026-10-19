import { Effect } from "effect";
import type { Track } from "@/server/domain/spotify";
import { loadNowPlaying } from "@/server/services/spotify";
import { SpotifySourceLive } from "./spotify-source-live";

/** The track to show in the footer; null when nothing was played or Spotify cannot be reached. */
export function nowPlaying(): Promise<Track | null> {
  return Effect.runPromise(
    loadNowPlaying.pipe(
      Effect.provide(SpotifySourceLive),
      Effect.tapError((error) => Effect.logWarning(`spotify: ${error.reason}`)),
      Effect.orElseSucceed(() => null),
    ),
  );
}
