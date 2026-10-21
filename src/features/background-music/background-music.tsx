"use client";

import { useEffect, useSyncExternalStore } from "react";
import { getServerSoundEnabled, getSoundEnabled, subscribeSound, warmMusic } from "@/lib/sound";

const GESTURES = ["pointerdown", "keydown", "touchend"] as const;

// Module scope survives a remount, and lets a muted visitor skip loading the engine just to stop it.
let requested = false;

/**
 * Plays the lo-fi loop whenever sound is on: music and effects share one switch. The loop belongs
 * to the engine, not to this component, so a remount (a language or theme change) never restarts it.
 */
export function BackgroundMusic() {
  const enabled = useSyncExternalStore(subscribeSound, getSoundEnabled, getServerSoundEnabled);

  useEffect(() => {
    if (!enabled) {
      if (requested) void import("@/lib/sound/music").then((music) => music.stopMusic());
      requested = false;
      return;
    }
    requested = true;
    warmMusic();
    const start = () => {
      for (const gesture of GESTURES) document.removeEventListener(gesture, start);
      void import("@/lib/sound/music").then((music) => music.startMusic());
    };

    // A stored preference cannot start audio before the first gesture of the visit.
    if (navigator.userActivation?.hasBeenActive) start();
    else for (const gesture of GESTURES) document.addEventListener(gesture, start);

    return () => {
      for (const gesture of GESTURES) document.removeEventListener(gesture, start);
    };
  }, [enabled]);

  return null;
}
