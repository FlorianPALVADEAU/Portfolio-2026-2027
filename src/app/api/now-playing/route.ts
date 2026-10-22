import { connection } from "next/server";
import { nowPlaying } from "@/server/infrastructure/spotify";

const TTL_MS = 30_000;
let cached: { at: number; track: ReturnType<typeof nowPlaying> } | undefined;

/** One Spotify call per window per instance, even when a query string dodges the CDN cache. */
function currentTrack() {
  const now = Date.now();
  if (!cached || now - cached.at > TTL_MS) cached = { at: now, track: nowPlaying() };
  return cached.track;
}

/** The footer asks after hydration; a shared cache keeps Spotify calls to a couple per minute. */
export async function GET() {
  // Opts out of prerendering: the answer depends on what is playing right now.
  await connection();
  const track = await currentTrack();
  const headers = { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" };
  return track ? Response.json(track, { headers }) : new Response(null, { status: 204, headers });
}
