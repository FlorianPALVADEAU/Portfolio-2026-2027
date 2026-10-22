import { cacheLife } from "next/cache";
import { findPhotos } from "./find-photos";

type PhotoFolder = "trail";

// Reading the disk counts as runtime I/O under Cache Components; "use cache" makes it build-time.
export async function photoUrls(folder: PhotoFolder): Promise<string[]> {
  "use cache";
  // The listing needs `public/`, which is traced only into the build: it must not be recomputed at runtime.
  cacheLife("max");
  return findPhotos(folder);
}
