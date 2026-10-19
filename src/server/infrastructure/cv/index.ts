import type { Locale } from "@/lib/i18n";
import { findCv } from "./find-cv";

// Reading the disk counts as runtime I/O under Cache Components; "use cache" makes it build-time.
export async function cvHref(locale: Locale): Promise<string | null> {
  "use cache";
  return findCv(locale);
}
