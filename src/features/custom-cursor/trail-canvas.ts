import { extendTrail, type TrailPoint, trailStrength } from "@/lib/cursor";

const MAX_WIDTH = 5;
const MAX_ALPHA = 0.55;
const MAX_PIXEL_RATIO = 2;
const LIFETIME_MS = 380;

/** Keeps the pointer's recent path and draws it as a fading tail on a viewport-sized canvas. */
export function createTrailCanvas(canvas: HTMLCanvasElement) {
  const context = canvas.getContext("2d");

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
    canvas.width = Math.round(window.innerWidth * ratio);
    canvas.height = Math.round(window.innerHeight * ratio);
    context?.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  let points: TrailPoint[] = [];

  const clear = () => context?.clearRect(0, 0, window.innerWidth, window.innerHeight);

  const reset = () => {
    if (points.length > 0) clear();
    points = [];
  };

  const draw = (now: number) => {
    if (!context) return;
    clear();
    // Read every frame so a theme switch repaints the tail in the new foreground at once.
    context.strokeStyle = getComputedStyle(canvas).color;
    context.lineCap = "round";
    for (let i = 1; i < points.length; i++) {
      const from = points[i - 1];
      const to = points[i];
      if (!(from && to)) continue;
      const strength = trailStrength(to, now, LIFETIME_MS);
      context.globalAlpha = strength * MAX_ALPHA;
      context.lineWidth = strength * MAX_WIDTH;
      context.beginPath();
      context.moveTo(from.x, from.y);
      context.lineTo(to.x, to.y);
      context.stroke();
    }
  };

  /** Lays the next point of the path and redraws; the tail shrinks by itself when none is laid. */
  const follow = (x: number, y: number) => {
    const now = performance.now();
    const before = points.length;
    points = extendTrail(points, { x, y, time: now }, LIFETIME_MS);
    if (points.length > 1) draw(now);
    else if (before > 1) clear();
  };

  resize();
  window.addEventListener("resize", resize);
  return {
    follow,
    reset,
    destroy: () => window.removeEventListener("resize", resize),
  };
}
