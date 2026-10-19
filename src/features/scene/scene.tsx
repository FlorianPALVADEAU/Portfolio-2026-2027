"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { canRenderScene } from "@/lib/scene";
import { cn } from "@/lib/utils";

const SceneCanvas = dynamic(() => import("./scene-canvas"), { ssr: false });

/**
 * Page-wide decorative WebGL backdrop: one fixed canvas, so one GL context for the whole page.
 * Three.js loads only after hydration and only when the device and preferences allow it; otherwise
 * nothing is drawn. Rendering pauses while the tab is hidden.
 */
export function Scene({ className }: { className?: string }) {
  const [enabled, setEnabled] = useState(false);
  const [foreground, setForeground] = useState(true);

  useEffect(() => {
    setEnabled(canRenderScene());
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const onVisibility = () => setForeground(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [enabled]);

  return (
    <div
      aria-hidden="true"
      data-scene={enabled ? "webgl" : "poster"}
      className={cn("pointer-events-none fixed inset-0 -z-10", className)}
    >
      {enabled && <SceneCanvas active={foreground} />}
    </div>
  );
}
