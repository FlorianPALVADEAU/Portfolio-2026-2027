import type { UiSound } from "./engine";
import { getSoundEnabled } from "./preference";

/** Plays a sound only when the visitor opted in; the engine loads on first use so muted visitors never download it. */
export function playIfEnabled(sound: UiSound, pan?: number): void {
  if (!getSoundEnabled()) return;
  void import("./engine").then((engine) => engine.playUiSound(sound, pan));
}

/** Warms the focus recordings up for visitors who opted in to sound; muted visitors download nothing. */
export function preloadFocusIfEnabled(): void {
  if (!getSoundEnabled()) return;
  void import("./engine").then((engine) => engine.preloadFocusSounds());
}

/** Fetches the music engine ahead of the click that needs it, so turning sound on starts at once. */
export function warmMusic(): void {
  void import("./music");
}
