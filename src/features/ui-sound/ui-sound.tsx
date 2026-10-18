"use client";

import { useEffect } from "react";
import { getSoundEnabled, type UiSound as UiSoundName } from "@/lib/sound";

const INTERACTIVE = "a[href], button, summary, [role='button'], input, select, textarea, label";

function interactiveTarget(event: Event): Element | null {
  return event.target instanceof Element ? event.target.closest(INTERACTIVE) : null;
}

/** Plays soft feedback on hover and click once the visitor has opted in. */
export function UiSound() {
  useEffect(() => {
    let hovered: Element | null = null;

    // The engine is imported on first use so muted visitors never download it.
    const play = (sound: UiSoundName) => {
      if (!getSoundEnabled()) return;
      void import("@/lib/sound/engine").then((engine) => engine.playUiSound(sound));
    };

    const onPointerOver = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const target = interactiveTarget(event);
      if (target === hovered) return;
      hovered = target;
      if (target) play("hover");
    };
    const onClick = (event: MouseEvent) => {
      if (interactiveTarget(event)) play("click");
    };

    document.addEventListener("pointerover", onPointerOver);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}
