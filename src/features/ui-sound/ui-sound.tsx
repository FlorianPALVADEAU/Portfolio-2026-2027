"use client";

import { useEffect } from "react";
import { playIfEnabled } from "@/lib/sound";

const INTERACTIVE = "a[href], button, summary, [role='button'], input, select, textarea, label";

function interactiveTarget(event: Event): Element | null {
  return event.target instanceof Element ? event.target.closest(INTERACTIVE) : null;
}

/** Plays soft feedback on hover and click once the visitor has opted in. */
export function UiSound() {
  useEffect(() => {
    let hovered: Element | null = null;

    const onPointerOver = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const target = interactiveTarget(event);
      if (target === hovered) return;
      hovered = target;
      if (target) playIfEnabled("hover");
    };
    const onClick = (event: MouseEvent) => {
      if (interactiveTarget(event)) playIfEnabled("click");
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
