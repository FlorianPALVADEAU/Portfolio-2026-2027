/**
 * Every project and note that ships. Imports are explicit so a missing file fails the build,
 * and the loader still validates what each file contains.
 */
export const registry = {
  project: {
    "sample-project": {
      structure: () => import("./sample-project/project"),
      text: {
        fr: () => import("./sample-project/i18n/fr.json"),
        en: () => import("./sample-project/i18n/en.json"),
        de: () => import("./sample-project/i18n/de.json"),
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
