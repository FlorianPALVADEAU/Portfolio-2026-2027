import { hasFinePointer, prefersReducedMotion } from "@/lib/motion";

type NetworkInformation = { saveData?: boolean };

function hasWebGl(): boolean {
  try {
    return document.createElement("canvas").getContext("webgl2") !== null;
  } catch {
    return false;
  }
}

/**
 * The scene is decorative, so it only mounts when it costs the visitor nothing they objected to.
 * A touch screen is left out: a fixed canvas trails the browser's own touch scroll, so the planes
 * slide against the page, and its pictures cost a phone more than it can spare.
 */
export function canRenderScene(): boolean {
  const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
  if (prefersReducedMotion() || connection?.saveData || !hasFinePointer()) return false;
  return hasWebGl();
}
