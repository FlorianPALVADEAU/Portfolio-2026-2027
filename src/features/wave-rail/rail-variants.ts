/**
 * The rhythm of the nodes: size, width, height on the stage and the way the label appears. It
 * repeats every few nodes, so neighbours never look alike. Offsets are shares of the stage
 * height; neighbours differ enough in height to overlap sideways without touching, and the
 * upward ones stay small so a label never reaches the heading of its slide.
 */
export const NODE_VARIANTS = [
  { text: "in-data-[motion=rail]:text-3xl", width: 1.5, offset: 0.2, reveal: "rise" },
  { text: "in-data-[motion=rail]:text-xl", width: 1, offset: -0.12, reveal: "drop" },
  { text: "in-data-[motion=rail]:text-2xl", width: 1, offset: 0.08, reveal: "slide" },
  { text: "in-data-[motion=rail]:text-3xl", width: 1.4, offset: -0.14, reveal: "drop" },
  { text: "in-data-[motion=rail]:text-xl", width: 1, offset: 0.22, reveal: "slide" },
  { text: "in-data-[motion=rail]:text-2xl", width: 1.2, offset: -0.04, reveal: "rise" },
] as const;

export type Reveal = (typeof NODE_VARIANTS)[number]["reveal"];
