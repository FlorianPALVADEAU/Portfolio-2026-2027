import { gsap } from "gsap";

const FOLLOW = { duration: 0.35, ease: "power3.out" } as const;
const SHOW = { duration: 0.3, ease: "power3.out", overwrite: "auto" } as const;

/**
 * Makes `element` (fixed to the top left of the screen) follow the pointer with a soft lag and
 * pop in and out, the same way for every tag that rides beside the mouse. It starts hidden, and
 * while hidden it jumps to the pointer instead of sliding, so it never swoops in from a corner.
 */
export function trailPointer(element: HTMLElement) {
  gsap.set(element, { scale: 0, visibility: "visible" });
  const moveX = gsap.quickTo(element, "x", FOLLOW);
  const moveY = gsap.quickTo(element, "y", FOLLOW);
  let shown = false;

  return {
    move(x: number, y: number) {
      if (shown) {
        moveX(x);
        moveY(y);
      } else {
        gsap.set(element, { x, y });
      }
    },
    show(visible: boolean) {
      shown = visible;
      gsap.to(element, { scale: visible ? 1 : 0, ...SHOW });
    },
    release() {
      gsap.killTweensOf(element);
    },
  };
}
