/** Landing sections in page order; each id doubles as the anchor and the message key. */
export const landingSections = ["intro", "about", "works", "skills", "gallery", "contact"] as const;
type LandingSection = (typeof landingSections)[number];

/** Sections reachable from the header navigation. */
export const navSections = [
  "about",
  "works",
  "skills",
  "contact",
] as const satisfies readonly LandingSection[];
