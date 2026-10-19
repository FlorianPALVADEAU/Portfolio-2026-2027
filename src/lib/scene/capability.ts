import { prefersReducedMotion } from "@/lib/motion";

type NetworkInformation = { saveData?: boolean };

function hasWebGl(): boolean {
  try {
    return document.createElement("canvas").getContext("webgl2") !== null;
  } catch {
    return false;
  }
}

/** The scene is decorative, so it only mounts when it costs the visitor nothing they objected to. */
export function canRenderScene(): boolean {
  const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
  if (prefersReducedMotion() || connection?.saveData) return false;
  return hasWebGl();
}
