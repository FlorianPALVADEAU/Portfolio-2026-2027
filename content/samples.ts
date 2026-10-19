/** Template projects to preview the layout; the registry decides when they ship. */
export const sampleProjects = {
  "atlas-dashboard": {
    structure: () => import("./samples/atlas-dashboard/project"),
    text: {
      fr: () => import("./samples/atlas-dashboard/i18n/fr.json"),
      en: () => import("./samples/atlas-dashboard/i18n/en.json"),
      de: () => import("./samples/atlas-dashboard/i18n/de.json"),
    },
  },
  "northwind-commerce": {
    structure: () => import("./samples/northwind-commerce/project"),
    text: {
      fr: () => import("./samples/northwind-commerce/i18n/fr.json"),
      en: () => import("./samples/northwind-commerce/i18n/en.json"),
      de: () => import("./samples/northwind-commerce/i18n/de.json"),
    },
  },
  "pulse-api": {
    structure: () => import("./samples/pulse-api/project"),
    text: {
      fr: () => import("./samples/pulse-api/i18n/fr.json"),
      en: () => import("./samples/pulse-api/i18n/en.json"),
      de: () => import("./samples/pulse-api/i18n/de.json"),
    },
  },
  "lumen-design-system": {
    structure: () => import("./samples/lumen-design-system/project"),
    text: {
      fr: () => import("./samples/lumen-design-system/i18n/fr.json"),
      en: () => import("./samples/lumen-design-system/i18n/en.json"),
      de: () => import("./samples/lumen-design-system/i18n/de.json"),
    },
  },
  "orbit-scheduler": {
    structure: () => import("./samples/orbit-scheduler/project"),
    text: {
      fr: () => import("./samples/orbit-scheduler/i18n/fr.json"),
      en: () => import("./samples/orbit-scheduler/i18n/en.json"),
      de: () => import("./samples/orbit-scheduler/i18n/de.json"),
    },
  },
} as const;
