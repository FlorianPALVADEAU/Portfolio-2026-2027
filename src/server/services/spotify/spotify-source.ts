import { Context, type Effect } from "effect";
import type { SpotifyUnavailable, Track } from "@/server/domain/spotify";

/** The owner's listening history. Infrastructure provides the Spotify client. */
export class SpotifySource extends Context.Service<
  SpotifySource,
  {
    /** The track playing right now, or null when nothing is. */
    readonly playing: () => Effect.Effect<Track | null, SpotifyUnavailable>;
    readonly lastPlayed: () => Effect.Effect<Track | null, SpotifyUnavailable>;
  }
>()("SpotifySource") {}
