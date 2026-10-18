/**
 * Every project that ships. Imports are explicit so a missing file fails the build,
 * and the loader still validates what each file contains.
 */
export const registry = {
  "sample-project": {
    structure: () => import("./sample-project/project"),
    text: {
      fr: () => import("./sample-project/i18n/fr.json"),
      en: () => import("./sample-project/i18n/en.json"),
      de: () => import("./sample-project/i18n/de.json"),
    },
  },
} as const;
