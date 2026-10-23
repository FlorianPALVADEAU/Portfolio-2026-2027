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

/**
 * A scene that moves with the pointer but never scrolls with the page, so touch screens may have
 * it: only a visitor who asked for less motion or less data, or a browser without WebGL, is left out.
 */
export function canRenderStage(): boolean {
  const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
  if (prefersReducedMotion() || connection?.saveData) return false;
  return hasWebGl();
}
