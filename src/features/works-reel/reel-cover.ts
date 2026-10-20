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
  /** 1 while the shutter dips the exposure, 0 otherwise. */
  shutter: number;
  /** Strength of the hand-held shake, 0 is steady. */
  shake: number;
};

/** A DOM cover and the plane that replaces it on screen. */
export type ReelCover = {
  id: string;
  frame: HTMLElement;
  image: HTMLImageElement;
  state: CoverState;
};

export function restingState(): CoverState {
  return { tilt: 0, grow: 1, zoom: 1, hover: 0, blur: 0, focus: 0.5, shutter: 0, shake: 0 };
}

/**
 * Texture scale that reproduces `object-fit: cover`: the axis that overflows the box is cropped,
 * the other one is shown in full.
 */
export function coverRatio(imageAspect: number, boxAspect: number): [number, number] {
  if (imageAspect > boxAspect) return [boxAspect / imageAspect, 1];
  return [1, imageAspect / boxAspect];
}
