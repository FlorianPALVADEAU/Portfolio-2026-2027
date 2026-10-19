import { findPhotos } from "./find-photos";

type PhotoFolder = "hero" | "trail";

// Reading the disk counts as runtime I/O under Cache Components; "use cache" makes it build-time.
export async function photoUrls(folder: PhotoFolder): Promise<string[]> {
  "use cache";
  return findPhotos(folder);
}
