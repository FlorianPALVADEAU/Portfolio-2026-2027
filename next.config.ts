import type { NextConfig } from "next";

/** Folders of public files that change rarely; Next sends them with `max-age=0` unless told otherwise. */
const STATIC_FOLDERS = ["sequence", "brand", "photos", "projects", "skills", "sfx"];
const WEEK_SECONDS = 60 * 60 * 24 * 7;

const nextConfig: NextConfig = {
  /* config options here */
  // Spotify only accepts a loopback IP as redirect URI, so the setup guide opens the dev server there.
  allowedDevOrigins: ["127.0.0.1"],
  // Placeholder gallery photos; drop this once they are local files.
  images: { remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }] },
  async headers() {
    return STATIC_FOLDERS.map((folder) => ({
      source: `/${folder}/:path*`,
      headers: [
        {
          key: "Cache-Control",
          value: `public, max-age=${WEEK_SECONDS}, stale-while-revalidate=86400`,
        },
      ],
    }));
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
