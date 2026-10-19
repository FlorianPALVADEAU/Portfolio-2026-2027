import { existsSync } from "node:fs";
import path from "node:path";
import type { Locale } from "@/lib/i18n";

/** Convention: one file per language in `public/cv`, named `cv-<locale>.pdf`. */
export const cvFileName = (locale: Locale) => `cv-${locale}.pdf`;

/** Public URL of the CV for a language, or null when the file has not been added yet. */
export function findCv(
  locale: Locale,
  directory = path.join(process.cwd(), "public", "cv"),
): string | null {
  return existsSync(path.join(directory, cvFileName(locale))) ? `/cv/${cvFileName(locale)}` : null;
}
