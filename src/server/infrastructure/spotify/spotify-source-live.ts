import { Effect, Layer, Schema } from "effect";
import {
  CurrentlyPlaying,
  RecentlyPlayed,
  SpotifyUnavailable,
  toTrack,
} from "@/server/domain/spotify";
import { SpotifySource } from "@/server/services/spotify";

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const API = "https://api.spotify.com/v1/me/player";

const fail = (reason: string) => new SpotifyUnavailable({ reason });

/** Trades the long-lived refresh token for a short access token; no credential leaves the server. */
const accessToken = Effect.gen(function* () {
  const {
    SPOTIFY_CLIENT_ID: id,
    SPOTIFY_CLIENT_SECRET: secret,
    SPOTIFY_REFRESH_TOKEN: refresh,
  } = process.env;
  if (!(id && secret && refresh)) return yield* fail("Spotify is not configured");

  const json = yield* Effect.tryPromise({
    try: async () => {
      const reply = await fetch(TOKEN_URL, {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refresh }),
        signal: AbortSignal.timeout(10_000),
      });
      if (!reply.ok) throw new Error(`token ${reply.status}`);
      return reply.json();
    },
    catch: (error) => fail(String(error)),
  });
  const { access_token } = yield* Schema.decodeUnknownEffect(
    Schema.Struct({ access_token: Schema.String }),
  )(json).pipe(Effect.mapError(() => fail("unexpected token response")));
  return access_token;
});

/** GET with the access token; `undefined` stands for 204, meaning nothing to report. */
const get = (path: string) =>
  Effect.gen(function* () {
    const token = yield* accessToken;
    return yield* Effect.tryPromise({
      try: async () => {
        const reply = await fetch(`${API}${path}`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: AbortSignal.timeout(10_000),
        });
        if (reply.status === 204) return undefined;
        if (!reply.ok) throw new Error(`spotify ${reply.status}`);
        return (await reply.json()) as unknown;
      },
      catch: (error) => fail(String(error)),
    });
  });

export const SpotifySourceLive = Layer.succeed(SpotifySource, {
  playing: () =>
    Effect.gen(function* () {
      const json = yield* get("/currently-playing");
      if (json === undefined) return null;
      const current = yield* Schema.decodeUnknownEffect(CurrentlyPlaying)(json).pipe(
        Effect.mapError(() => fail("unexpected response")),
      );
      return current.is_playing && current.item ? toTrack(current.item, true) : null;
    }),
  lastPlayed: () =>
    Effect.gen(function* () {
      const json = yield* get("/recently-played?limit=1");
      if (json === undefined) return null;
      const recent = yield* Schema.decodeUnknownEffect(RecentlyPlayed)(json).pipe(
        Effect.mapError(() => fail("unexpected response")),
      );
      const [latest] = recent.items;
      return latest ? toTrack(latest.track, false) : null;
    }),
});
