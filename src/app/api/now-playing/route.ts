import { connection } from "next/server";
import { nowPlaying } from "@/server/infrastructure/spotify";

/** The footer asks after hydration; a shared cache keeps Spotify calls to a couple per minute. */
export async function GET() {
  // Opts out of prerendering: the answer depends on what is playing right now.
  await connection();
  const track = await nowPlaying();
  const headers = { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" };
  return track ? Response.json(track, { headers }) : new Response(null, { status: 204, headers });
}
