"use client";

import { type ReactNode, useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/atoms/button";
import { cn } from "@/lib/utils";

type DropdownProps = {
  /** Which edge of the trigger the panel lines up with, so it opens toward the free side of the screen. */
  align?: "start" | "end";
  /** Accessible name of the round trigger, which only shows an icon or a flag. */
  label: string;
  trigger: ReactNode;
  children: ReactNode;
};

/** A disclosure panel under a round button. Choosing an item closes it, so items stay plain links or buttons. */
export function Dropdown({ label, trigger, align = "end", children }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const outside = (target: EventTarget | null) => !root.current?.contains(target as Node);
    function onPointerDown(event: PointerEvent) {
      if (outside(event.target)) setOpen(false);
    }
    function onFocusIn(event: FocusEvent) {
      if (outside(event.target)) setOpen(false);
    }
    function onClick(event: MouseEvent) {
      const item = (event.target as Element).closest("a, button");
      if (item && item !== root.current?.querySelector("button")) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(false);
      root.current?.querySelector("button")?.focus();
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={root} className="relative">
      <Button
        variant="secondary"
        size="icon"
        aria-label={label}
        aria-expanded={open}
        data-sound={open ? "close" : "open"}
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpen(!open)}
      >
        {trigger}
      </Button>
      {open && (
        <div
          id={panelId}
          data-hover-sound="item"
          className={cn(
            "absolute top-full z-50 mt-2 min-w-44 rounded-lg border border-border bg-background/90 p-1 shadow-lg backdrop-blur-md",
            align === "end" ? "right-0" : "left-0",
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}
