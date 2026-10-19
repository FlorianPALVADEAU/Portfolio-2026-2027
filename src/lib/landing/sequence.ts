/** A numbered run of still frames, played back by scroll position. */
export type FrameSet = { count: number; src: (index: number) => string };

/** A lighter set for small screens and a larger one for the rest. */
export type FrameSources = { mobile: FrameSet; desktop: FrameSet };

/**
 * Frames of the ascent from Lake Geneva through the clouds. `null` until the footage is shot:
 * the hero then plays a placeholder sky, so the layout and the scroll behaviour ship first.
 */
export const genevaAscent: FrameSources | null = null;
