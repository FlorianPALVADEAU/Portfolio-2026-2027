"use client";

import { useEffect, useState } from "react";

const COLUMNS = Array.from({ length: 12 }, (_, index) => index + 1);

function isTypingTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLElement && target.matches("input, textarea, select, [contenteditable]")
  );
}

/** Development helper: Alt+G toggles a 12-column overlay matching the layout grid. */
export function GridOverlay() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.altKey && event.code === "KeyG" && !isTypingTarget(event.target)) {
        setVisible((current) => !current);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  if (!visible) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-(--z-toast)">
      <div className="mx-auto h-full w-full max-w-(--container-max) px-(--gutter)">
        <div className="grid-12 h-full">
          {COLUMNS.map((column) => (
            <div key={column} className="bg-accent/10 outline outline-accent/40" />
          ))}
        </div>
      </div>
    </div>
  );
}
