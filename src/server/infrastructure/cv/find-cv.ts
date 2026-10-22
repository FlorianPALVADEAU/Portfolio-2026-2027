import { existsSync } from "node:fs";
import path from "node:path";
import type { Locale } from "@/lib/i18n";

const CV_FILE_NAME = "Florian_PALVADEAU_CV.pdf";

/** Convention: one folder per language in `public/cv`; the file name is what the visitor's download is called. */
export const cvRelativePath = (locale: Locale) => `${locale}/${CV_FILE_NAME}`;

/** Public URL of the CV for a language, or null when the file has not been added yet. */
export function findCv(
  locale: Locale,
  directory = path.join(process.cwd(), "public", "cv"),
): string | null {
  return existsSync(path.join(directory, cvRelativePath(locale)))
    ? `/cv/${cvRelativePath(locale)}`
    : null;
}
