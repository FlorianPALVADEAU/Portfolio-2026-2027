import { existsSync, readdirSync } from "node:fs";
import path from "node:path";

const IMAGE = /\.(avif|jpe?g|png|webp)$/i;

/**
 * Convention: pictures of the owner are dropped in `public/photos/me/<folder>`, so adding or
 * removing one needs no code change. Returns their public URLs in file-name order. Its caller is cached
 * for good, so the folder is read at build time; the ignore comments keep Turbopack
 * from tracing the whole project into the server output for a path it cannot resolve statically.
 */
export function findPhotos(
  folder: string,
  directory = path.join(/*turbopackIgnore: true*/ process.cwd(), "public", "photos", "me"),
): string[] {
  const target = path.join(/*turbopackIgnore: true*/ directory, folder);
  if (!existsSync(/*turbopackIgnore: true*/ target)) return [];
  return readdirSync(/*turbopackIgnore: true*/ target)
    .filter((file) => IMAGE.test(file))
    .sort()
    .map((file) => `/photos/me/${folder}/${file}`);
}
