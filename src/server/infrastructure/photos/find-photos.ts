import { existsSync, readdirSync } from "node:fs";
import path from "node:path";

const IMAGE = /\.(avif|jpe?g|png|webp)$/i;

/**
 * Convention: pictures of the owner are dropped in `public/photos/me/<folder>`, so adding or
 * removing one needs no code change. Returns their public URLs in file-name order.
 */
export function findPhotos(
  folder: string,
  directory = path.join(process.cwd(), "public", "photos", "me"),
): string[] {
  const target = path.join(directory, folder);
  if (!existsSync(target)) return [];
  return readdirSync(target)
    .filter((file) => IMAGE.test(file))
    .sort()
    .map((file) => `/photos/me/${folder}/${file}`);
}
