/** Where an item is in the scene; see `GalleryItem` for the units. */
type ZoomItem = { ox: number; oy: number; depth: number };

type Pose = {
  /** Offset of the item centre from the stage centre, in px. */
  x: number;
  y: number;
  scale: number;
  opacity: number;
  /** In px. */
  blur: number;
  /** 1 is the photo as it is; distant items are darker. */
  brightness: number;
};

/** Distance the viewer covers over the whole scroll, in the units of `ZoomItem.depth`. */
export const TRAVEL = 5.4;

/** An item is gone once it is this close, and fully there from the second distance. */
const NEAR_GONE = 0.3;
const NEAR_FULL = 0.55;
/** An item is hidden beyond the first distance and fully there from the second. */
const FAR_GONE = 3.4;
const FAR_FULL = 2.6;
/** Projected distance from the centre, in half-stage units, where the leaving blur starts. */
const EDGE_START = 0.9;
const EDGE_SPAN = 0.9;
const MAX_BLUR = 22;
const EDGE_FADE = 0.3;
/** Pointer shift of an item at scale 1, in half-stage units. */
const PARALLAX = 0.08;

/** An item is level with the viewer, and goes by, once it is this close. */
const PASS_DISTANCE = 0.9;

const HIDDEN: Pose = { x: 0, y: 0, scale: 1, opacity: 0, blur: 0, brightness: 1 };

function clamp(value: number): number {
  return Math.min(1, Math.max(0, value));
}

/** Whether the viewer, `progress` of the way in, has gone level with the item. */
export function hasPassed(item: ZoomItem, progress: number): boolean {
  return item.depth - progress * TRAVEL < PASS_DISTANCE;
}

/** 0 up to `from`, 1 from `to`, eased between; also works when `from` is above `to`. */
export function smoothstep(from: number, to: number, value: number): number {
  const t = clamp((value - from) / (to - from));
  return t * t * (3 - 2 * t);
}

/** Share of the whole reveal during which one word travels; the rest is spent waiting its turn. */
const WORD_SPAN = 0.3;

/**
 * How far word `index` of `count` has come, 0 to 1, once the reveal as a whole has reached
 * `arrived`. Words go in reading order and overlap, so the text writes itself in one flow.
 */
export function wordReveal(index: number, count: number, arrived: number): number {
  const start = count > 1 ? (index / (count - 1)) * (1 - WORD_SPAN) : 0;
  return smoothstep(start, start + WORD_SPAN, arrived);
}

/**
 * Pose of an item once the viewer has covered `progress` (0 to 1) of the way. The viewer moves
 * straight ahead, so an item grows as 1 / distance and drifts outwards from the centre, leaving
 * the frame at its edge. It blurs and fades the further out it is, to pull the eye to the middle.
 * `look` is the pointer in -1..1 and shifts near items more than far ones.
 */
export function pose(
  item: ZoomItem,
  progress: number,
  half: { x: number; y: number },
  look: { x: number; y: number },
): Pose {
  const distance = item.depth - progress * TRAVEL;
  if (distance <= NEAR_GONE) return HIDDEN;

  const scale = 1 / distance;
  const reach = Math.max(Math.abs(item.ox), Math.abs(item.oy)) * scale;
  const edge = smoothstep(EDGE_START, EDGE_START + EDGE_SPAN, reach);

  return {
    x: half.x * (item.ox - look.x * PARALLAX) * scale,
    y: half.y * (item.oy - look.y * PARALLAX) * scale,
    scale,
    opacity:
      smoothstep(FAR_GONE, FAR_FULL, distance) *
      smoothstep(NEAR_GONE, NEAR_FULL, distance) *
      (1 - EDGE_FADE * edge),
    blur: edge * edge * MAX_BLUR,
    brightness: 0.55 + 0.45 * smoothstep(3.2, 1.6, distance),
  };
}
