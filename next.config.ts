import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Spotify only accepts a loopback IP as redirect URI, so the setup guide opens the dev server there.
  allowedDevOrigins: ["127.0.0.1"],
  // Placeholder gallery photos; drop this once they are local files.
  images: { remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }] },
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
