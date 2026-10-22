"use client";

import { useEffect, useSyncExternalStore } from "react";
import {
  getServerSoundEnabled,
  getSoundEnabled,
  hasSoundChoice,
  setSoundEnabled,
  subscribeSound,
  warmMusic,
} from "@/lib/sound";

// `click` comes last in a press: some browsers count only it, or `touchend`, as the activation that
// lets audio start, and the earlier events of the same press would find the audio still locked.
const GESTURES = ["pointerdown", "keydown", "touchend", "click"] as const;

/** Keys that move around or modify without acting on the page. */
const PASSIVE_KEYS = new Set(["Tab", "Shift", "Control", "Alt", "Meta", "CapsLock", "Escape"]);

// Module scope survives a remount, and lets a muted visitor skip loading the engine just to stop it.
let requested = false;

/**
 * Plays the lo-fi loop whenever sound is on: music and effects share one switch. The loop belongs
 * to the engine, not to this component, so a remount (a language or theme change) never restarts it.
 * A visitor who has never chosen gets sound on at their first action, since a browser lets audio
 * start only after one; the switch in the header, and an earlier choice, always win.
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

  useEffect(() => {
    if (hasSoundChoice()) return;
    const stop = () => {
      for (const gesture of GESTURES) document.removeEventListener(gesture, onFirstAction, true);
    };
    function onFirstAction(event: Event) {
      if (event instanceof KeyboardEvent && PASSIVE_KEYS.has(event.key)) return;
      // The switch decides for itself, and must not be turned on and straight back off.
      if (event.target instanceof Element && event.target.closest("[data-sound-toggle]")) return;
      stop();
      if (!hasSoundChoice()) setSoundEnabled(true);
    }
    for (const gesture of GESTURES) document.addEventListener(gesture, onFirstAction, true);
    return stop;
  }, []);

  return null;
}
