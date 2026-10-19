import { sampleProjects } from "./samples";

/** Template projects show in development, or in any build with `SAMPLE_PROJECTS=1`. */
const withSamples = process.env.NODE_ENV === "development" || process.env.SAMPLE_PROJECTS === "1";

/**
 * Every project and note that ships. Imports are explicit so a missing file fails the build,
 * and the loader still validates what each file contains.
 */
export const registry = {
  project: {
    ...(withSamples ? sampleProjects : {}),
    overbound: {
      structure: () => import("./overbound/project"),
      text: {
        fr: () => import("./overbound/i18n/fr.json"),
        en: () => import("./overbound/i18n/en.json"),
        de: () => import("./overbound/i18n/de.json"),
      },
    },
  },
  note: {
    "sample-note": {
      structure: () => import("./sample-note/note"),
      text: {
        fr: () => import("./sample-note/i18n/fr.json"),
        en: () => import("./sample-note/i18n/en.json"),
        de: () => import("./sample-note/i18n/de.json"),
      },
    },
  },
} as const;
