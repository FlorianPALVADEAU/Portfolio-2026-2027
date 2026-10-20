/**
 * A run of still frames, played back by scroll position: `0000.webp` to the `count`th one inside
 * `directory`. Plain data, so that a server component can hand it to the client player.
 */
export type FrameSet = { count: number; directory: string };

/** A lighter set for small screens and a larger one for the rest. */
export type FrameSources = { mobile: FrameSet; desktop: FrameSet };

const genevaFrameCount = 309;

/**
 * Frames of the ascent from Lake Geneva through the clouds, 30 per second of footage. `null` makes
 * the hero play a placeholder sky instead.
 */
export const genevaAscent: FrameSources | null = {
  mobile: { count: genevaFrameCount, directory: "/sequence/geneva/mobile" },
  desktop: { count: genevaFrameCount, directory: "/sequence/geneva/desktop" },
};
