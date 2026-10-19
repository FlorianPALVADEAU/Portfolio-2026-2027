/** Landing sections in page order; each id doubles as the anchor and the message key. */
const landingSections = ["intro", "works", "skills", "about", "contact"] as const;
type LandingSection = (typeof landingSections)[number];

/** Sections reachable from the header navigation. */
export const navSections = [
  "works",
  "skills",
  "about",
  "contact",
] as const satisfies readonly LandingSection[];
