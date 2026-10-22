import { Effect } from "effect";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SpotifySource } from "@/server/services/spotify";
import { SpotifySourceLive } from "./spotify-source-live";

const item = {
  name: "Song",
  artists: [{ name: "A" }, { name: "B" }],
  external_urls: { spotify: "https://open.spotify.com/track/1" },
  album: {
    images: [
      { url: "https://i.scdn.co/image/large" },
      { url: "https://i.scdn.co/image/medium" },
      { url: "https://i.scdn.co/image/small" },
    ],
  },
};

const reply = (status: number, body?: unknown) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
});

/** Answers the token exchange first, then each API call in order. */
function stubFetch(...apiReplies: ReturnType<typeof reply>[]) {
  const fetchMock = vi
    .fn()
    .mockResolvedValueOnce(reply(200, { access_token: "access" }))
    .mockResolvedValueOnce(apiReplies[0])
    .mockResolvedValueOnce(reply(200, { access_token: "access" }))
    .mockResolvedValueOnce(apiReplies[1]);
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

const playing = () =>
  Effect.runPromiseExit(
    Effect.gen(function* () {
      return yield* (yield* SpotifySource).playing();
    }).pipe(Effect.provide(SpotifySourceLive)),
  );
const lastPlayed = () =>
  Effect.runPromiseExit(
    Effect.gen(function* () {
      return yield* (yield* SpotifySource).lastPlayed();
    }).pipe(Effect.provide(SpotifySourceLive)),
  );

describe("Spotify source", () => {
  beforeEach(() => {
    vi.stubEnv("SPOTIFY_CLIENT_ID", "id");
    vi.stubEnv("SPOTIFY_CLIENT_SECRET", "secret");
    vi.stubEnv("SPOTIFY_REFRESH_TOKEN", "refresh");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("maps the track playing now and exchanges the refresh token on the server", async () => {
    const fetchMock = stubFetch(reply(200, { is_playing: true, item }));

    const exit = await playing();

    expect(exit._tag === "Success" && exit.value).toEqual({
      title: "Song",
      artist: "A, B",
      url: "https://open.spotify.com/track/1",
      cover: "https://i.scdn.co/image/medium",
      playing: true,
    });
    const [url, init] = fetchMock.mock.calls[0] ?? [];
    expect(url).toBe("https://accounts.spotify.com/api/token");
    expect(init.headers.Authorization).toBe(`Basic ${Buffer.from("id:secret").toString("base64")}`);
    expect(fetchMock.mock.calls[1]?.[1].headers.Authorization).toBe("Bearer access");
  });

  it("reports nothing when no track plays: 204, paused or an ad without item", async () => {
    stubFetch(reply(204));
    const idle = await playing();
    expect(idle._tag === "Success" && idle.value).toBeNull();

    stubFetch(reply(200, { is_playing: false, item }));
    const paused = await playing();
    expect(paused._tag === "Success" && paused.value).toBeNull();

    stubFetch(reply(200, { is_playing: true, item: null }));
    const ad = await playing();
    expect(ad._tag === "Success" && ad.value).toBeNull();
  });

  it("maps the last played track", async () => {
    stubFetch(reply(200, { items: [{ track: item }] }), reply(200, { items: [{ track: item }] }));

    const exit = await lastPlayed();

    expect(exit._tag === "Success" && exit.value).toMatchObject({ title: "Song", playing: false });
  });

  it("fails without calling Spotify when it is not configured", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("SPOTIFY_REFRESH_TOKEN", "");

    expect((await playing())._tag).toBe("Failure");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("fails when Spotify answers an error", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(reply(500)));

    expect((await playing())._tag).toBe("Failure");
  });
});
