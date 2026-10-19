import { Data, Schema } from "effect";

/** A track as the footer shows it. */
export type Track = {
  title: string;
  artist: string;
  url: string;
  /** True while it plays now, false for the last one played. */
  playing: boolean;
};

const Item = Schema.Struct({
  name: Schema.String,
  artists: Schema.Array(Schema.Struct({ name: Schema.String })),
  external_urls: Schema.Struct({ spotify: Schema.String }),
});

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
  playing,
});

/** Spotify is not configured, or it could not be reached or answered something unexpected. */
export class SpotifyUnavailable extends Data.TaggedError("SpotifyUnavailable")<{
  reason: string;
}> {}
