"use client";

import dynamic from "next/dynamic";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { canRenderStage } from "@/lib/scene";
import { playIfEnabled } from "@/lib/sound";
import type { Input } from "./duck-animation";

const DuckCanvas = dynamic(() => import("./duck-canvas"), { ssr: false });

type DuckStageProps = {
  className?: string;
  /** Shown instead of the duck when the visitor or the browser cannot have a 3D scene. */
  fallback: ReactNode;
};

/**
 * Where the duck lives. The 3D code is a large download, so it loads only here, after the page is
 * interactive, and only when the scene is allowed (see `canRenderStage`); otherwise the fallback
 * takes its place. The pointer is read from the whole page, and a press on the stage makes the duck quack.
 */
export function DuckStage({ className, fallback }: DuckStageProps) {
  const [mode, setMode] = useState<"pending" | "on" | "off">("pending");
  const input = useRef<Input>({
    gaze: { x: 0, y: 0 },
    movedAt: Number.NEGATIVE_INFINITY,
    quackedAt: Number.NEGATIVE_INFINITY,
  });

  useEffect(() => {
    const allowed = canRenderStage();
    setMode(allowed ? "on" : "off");
    if (!allowed) return;

    const follow = (event: PointerEvent) => {
      input.current.gaze = {
        x: (event.clientX / window.innerWidth - 0.5) * 2,
        y: (event.clientY / window.innerHeight - 0.5) * 2,
      };
      input.current.movedAt = performance.now() / 1000;
    };
    window.addEventListener("pointermove", follow, { passive: true });
    return () => window.removeEventListener("pointermove", follow);
  }, []);

  if (mode === "off") return fallback;

  return (
    <div
      aria-hidden="true"
      className={className}
      onPointerDown={() => {
        input.current.quackedAt = performance.now() / 1000;
        playIfEnabled("pop");
      }}
    >
      {mode === "on" && <DuckCanvas input={input} />}
    </div>
  );
}
