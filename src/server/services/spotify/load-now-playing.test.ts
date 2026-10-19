import { Effect, Layer } from "effect";
import { describe, expect, it } from "vitest";
import { SpotifyUnavailable, type Track } from "@/server/domain/spotify";
import { loadNowPlaying } from "./load-now-playing";
import { SpotifySource } from "./spotify-source";

const track = (title: string, playing: boolean): Track => ({
  title,
  artist: "Artist",
  url: `https://open.spotify.com/track/${title}`,
  playing,
});

const run = (source: {
  playing: Effect.Effect<Track | null, SpotifyUnavailable>;
  lastPlayed: Effect.Effect<Track | null, SpotifyUnavailable>;
}) =>
  Effect.runPromiseExit(
    loadNowPlaying.pipe(
      Effect.provide(
        Layer.succeed(SpotifySource, {
          playing: () => source.playing,
          lastPlayed: () => source.lastPlayed,
        }),
      ),
    ),
  );

describe("loadNowPlaying", () => {
  it("prefers the track playing now", async () => {
    const exit = await run({
      playing: Effect.succeed(track("now", true)),
      lastPlayed: Effect.succeed(track("before", false)),
    });

    expect(exit._tag === "Success" && exit.value?.title).toBe("now");
  });

  it("falls back to the last track played", async () => {
    const exit = await run({
      playing: Effect.succeed(null),
      lastPlayed: Effect.succeed(track("before", false)),
    });

    expect(exit._tag === "Success" && exit.value).toMatchObject({
      title: "before",
      playing: false,
    });
  });

  it("returns nothing when there is no history", async () => {
    const exit = await run({ playing: Effect.succeed(null), lastPlayed: Effect.succeed(null) });

    expect(exit._tag === "Success" && exit.value).toBeNull();
  });

  it("fails when Spotify is unavailable", async () => {
    const exit = await run({
      playing: Effect.fail(new SpotifyUnavailable({ reason: "down" })),
      lastPlayed: Effect.succeed(null),
    });

    expect(exit._tag).toBe("Failure");
  });
});
