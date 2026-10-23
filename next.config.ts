import type { NextConfig } from "next";
import { securityHeaders } from "./src/lib/security";

/** Folders of public files that change rarely; Next sends them with `max-age=0` unless told otherwise. */
const STATIC_FOLDERS = ["sequence", "brand", "photos", "projects", "skills", "sfx", "gallery"];
const WEEK_SECONDS = 60 * 60 * 24 * 7;

const nextConfig: NextConfig = {
  // Spotify only accepts a loopback IP as redirect URI, so the setup guide opens the dev server there.
  // The fixed back button of project pages lives at the bottom left, where the indicator sits by default.
  devIndicators: { position: "bottom-right" },
  allowedDevOrigins: ["127.0.0.1"],
  // 92 is for the large whiteboard photo, where the default 75 smears the fine marker lines.
  images: {
    qualities: [75, 92],
    // Album covers of the track shown in the footer.
    remotePatterns: [{ protocol: "https", hostname: "i.scdn.co" }],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders(process.env.NODE_ENV === "development") },
      ...STATIC_FOLDERS.map((folder) => ({
        source: `/${folder}/:path*`,
        headers: [
          {
            key: "Cache-Control",
            value: `public, max-age=${WEEK_SECONDS}, stale-while-revalidate=86400`,
          },
        ],
      })),
    ];
  },
  // The root layout sits under `[locale]`, so a plain `not-found.tsx` is never reached for unknown URLs.
  experimental: { globalNotFound: true },
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
