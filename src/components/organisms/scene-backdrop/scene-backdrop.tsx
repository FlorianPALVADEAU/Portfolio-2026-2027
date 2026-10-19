import { Scene } from "@/features/scene";

/** Page-wide decorative layer; the single canvas lives here so sections stay free of 3D. */
export function SceneBackdrop() {
  return <Scene />;
}
