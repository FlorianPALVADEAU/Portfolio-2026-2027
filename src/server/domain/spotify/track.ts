import { Data, Schema } from "effect";

/** A track as the footer shows it. */
export type Track = {
  title: string;
  artist: string;
  url: string;
  /** Album cover, or null when Spotify sends none. */
  cover: string | null;
  /** True while it plays now, false for the last one played. */
  playing: boolean;
};

const Item = Schema.Struct({
  name: Schema.String,
  artists: Schema.Array(Schema.Struct({ name: Schema.String })),
  external_urls: Schema.Struct({ spotify: Schema.String }),
  album: Schema.Struct({ images: Schema.Array(Schema.Struct({ url: Schema.String })) }),
});

/** Spotify lists covers from the largest (640px) to the smallest; the middle one suits a 64px tile at 2x. */
const coverOf = (images: SpotifyItem["album"]["images"]) => (images[1] ?? images[0])?.url ?? null;

/** `item` is null for ads and when nothing is loaded. */
export const CurrentlyPlaying = Schema.Struct({
  is_playing: Schema.Boolean,
  currently_playing_type: Schema.optional(Schema.String),
  item: Schema.NullOr(Item),
});

export const RecentlyPlayed = Schema.Struct({
  items: Schema.Array(Schema.Struct({ track: Item })),
});

export type SpotifyItem = typeof Item.Type;

export const toTrack = (item: SpotifyItem, playing: boolean): Track => ({
  title: item.name,
  artist: item.artists.map(({ name }) => name).join(", "),
  url: item.external_urls.spotify,
  cover: coverOf(item.album.images),
  playing,
});

/** Spotify is not configured, or it could not be reached or answered something unexpected. */
export class SpotifyUnavailable extends Data.TaggedError("SpotifyUnavailable")<{
  reason: string;
}> {}
