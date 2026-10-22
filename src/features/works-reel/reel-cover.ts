/** Animated values of one cover: GSAP writes them, the canvas reads them every frame. */
export type CoverState = {
  /** Degrees the plane leans on its inner edge. */
  tilt: number;
  /** Size multiplier of the plane. */
  grow: number;
  /** Zoom of the picture inside the plane, 1 shows the whole cover-fit picture. */
  zoom: number;
  /** 0 at rest, 1 while the card is hovered or focused. */
  hover: number;
  /** Strength of the focus-pull blur, 1 is fully out of focus and 0 is sharp. */
  blur: number;
  /** Height of the focal line over the picture, 0 at the bottom and 1 at the top. */
  focus: number;
  /** Strength of the hand-held shake, 0 is steady. */
  shake: number;
  /** Where the pointer looks from over the cover, -1 to 1 on each axis, 0 at the centre. */
  lookX: number;
  lookY: number;
  /** 0 on its card, 1 once the plane fills the screen: the leave and return transition. */
  fill: number;
  /** Strength of the bowl that pulls the plane's edges toward the viewer, 0 is flat. */
  cup: number;
  /** Degrees the plane leans to the left during the transition, apart from the scroll `tilt`. */
  lean: number;
  /** How far the picture has faded into `tintColor`, 0 shows it and 1 hides it. */
  tint: number;
  /** sRGB colour the picture fades into: the background of the page it leads to. */
  tintColor: [number, number, number];
  /** Set by the canvas once the picture is on the GPU and drawn. */
  ready: boolean;
};

/** A DOM cover and the plane that replaces it on screen. */
export type ReelCover = {
  id: string;
  /** Path of the project page the cover leads to. */
  path: string;
  frame: HTMLElement;
  image: HTMLImageElement;
  /** Depth map of the picture; only set where the pointer can hover. */
  depthSrc: string | undefined;
  state: CoverState;
};

export function restingState(): CoverState {
  return {
    tilt: 0,
    grow: 1,
    zoom: 1,
    hover: 0,
    blur: 0,
    focus: 0.5,
    shake: 0,
    lookX: 0,
    lookY: 0,
    fill: 0,
    cup: 0,
    lean: 0,
    tint: 0,
    tintColor: [0, 0, 0],
    ready: false,
  };
}

/**
 * Texture scale that reproduces `object-fit: cover`: the axis that overflows the box is cropped,
 * the other one is shown in full.
 */
export function coverRatio(imageAspect: number, boxAspect: number): [number, number] {
  if (imageAspect > boxAspect) return [boxAspect / imageAspect, 1];
  return [1, imageAspect / boxAspect];
}

/** Widest size the image optimiser serves, enough for a cover that fills the screen. */
const SHARP_WIDTH = "1920";

/**
 * The address of the picture at the size the plane needs. The card's own `<img>` is cut for the
 * card, which looks soft once the plane grows to fill the screen; any other source is kept.
 */
export function sharpSource(current: string, base: string): string {
  const url = new URL(current, base);
  if (url.pathname !== "/_next/image") return current;
  url.searchParams.set("w", SHARP_WIDTH);
  return url.pathname + url.search;
}
