import { Effect } from "effect";
import { SpotifySource } from "./spotify-source";

/** What is playing now, else the last track played, else nothing. */
export const loadNowPlaying = Effect.gen(function* () {
  const source = yield* SpotifySource;
  return (yield* source.playing()) ?? (yield* source.lastPlayed());
});
