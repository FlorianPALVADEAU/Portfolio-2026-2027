"use client";

import { useEffect } from "react";
import { playIfEnabled } from "@/lib/sound";

const INTERACTIVE = "a[href], button, summary, [role='button'], input, select, textarea, label";

function interactiveTarget(event: Event): Element | null {
  return event.target instanceof Element ? event.target.closest(INTERACTIVE) : null;
}

/**
 * Plays soft feedback on hover and click once the visitor has opted in. An element picks its own
 * click sound with `data-sound` ("open", "close") or silences it with `data-sound="none"`.
 * A container with `data-hover-sound="item"` swaps the hover sound for a much shorter one.
 */
export function UiSound() {
  useEffect(() => {
    let hovered: Element | null = null;

    const onPointerOver = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const target = interactiveTarget(event);
      if (target === hovered) return;
      hovered = target;
      if (!target) return;
      const inList =
        target.closest("[data-hover-sound]")?.getAttribute("data-hover-sound") === "item";
      playIfEnabled(inList ? "item" : "hover");
    };
    const onClick = (event: MouseEvent) => {
      const target = interactiveTarget(event);
      if (!target) return;
      const sound = target.closest<HTMLElement>("[data-sound]")?.dataset.sound;
      if (sound === "open" || sound === "close") playIfEnabled(sound);
      else if (sound !== "none") playIfEnabled("click");
    };

    document.addEventListener("pointerover", onPointerOver);
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  return null;
}
