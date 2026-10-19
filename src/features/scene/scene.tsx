"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { canRenderScene } from "@/lib/scene";
import { cn } from "@/lib/utils";

const SceneCanvas = dynamic(() => import("./scene-canvas"), { ssr: false });

/**
 * Decorative WebGL backdrop. Three.js loads only after the page is interactive and only when the
 * visitor's device and preferences allow it; otherwise a static radial glow stays. Rendering stops
 * while the scene is off screen or the tab is hidden.
 */
export function Scene({ className }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [foreground, setForeground] = useState(true);

  useEffect(() => {
    setEnabled(canRenderScene());
  }, []);

  useEffect(() => {
    const element = root.current;
    if (!(element && enabled)) return;
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry?.isIntersecting ?? true),
    );
    const onVisibility = () => setForeground(document.visibilityState === "visible");
    observer.observe(element);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [enabled]);

  return (
    <div
      ref={root}
      aria-hidden="true"
      data-scene={enabled ? "webgl" : "poster"}
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 md:[mask-image:linear-gradient(to_left,black_35%,transparent_90%)]",
        !enabled &&
          "bg-[radial-gradient(circle_at_70%_40%,var(--accent)_0,transparent_55%)] opacity-15",
        className,
      )}
    >
      {enabled && <SceneCanvas active={visible && foreground} />}
    </div>
  );
}
