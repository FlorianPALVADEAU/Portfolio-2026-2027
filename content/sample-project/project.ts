/** Placeholder project that exercises every block type until real case studies land. */
export default {
  slug: "sample-project",
  year: 2026,
  stack: ["TypeScript", "Next.js", "Effect"],
  cover: { src: "/projects/sample-project/cover.png", width: 1600, height: 900 },
  blocks: [
    { id: "overview", type: "text" },
    { id: "stack", type: "stack", items: ["TypeScript", "Next.js", "Effect", "Tailwind CSS"] },
    { id: "challenges", type: "challenges" },
    {
      id: "screenshot",
      type: "media",
      image: { src: "/projects/sample-project/screenshot.png", width: 1200, height: 800 },
    },
    { id: "results", type: "results" },
    {
      id: "links",
      type: "links",
      items: [{ id: "source", href: "https://github.com/FlorianPALVADEAU/Portfolio-2026-2027" }],
    },
  ],
};
