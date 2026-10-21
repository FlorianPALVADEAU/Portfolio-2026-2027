import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Both drawings share this frame, so their tip sits on the same point: the pixel that clicks. */
const FRAME = { x: -12, y: -3, width: 30, height: 34 };
const SCALE = 1.3;

const INK = "#0a0a0b";
const PAPER = "#ffffff";

type ShapeProps = { name: "arrow" | "hand"; children: ReactNode };

/**
 * Stacked on the same tip, one shows at a time: the root's `data-shape` decides which, and the
 * pair swap with a small turn and scale around that tip so the change reads as one object morphing.
 */
function Shape({ name, children }: ShapeProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox={`${FRAME.x} ${FRAME.y} ${FRAME.width} ${FRAME.height}`}
      width={FRAME.width * SCALE}
      height={FRAME.height * SCALE}
      style={{ left: FRAME.x * SCALE, top: FRAME.y * SCALE }}
      className={cn(
        "absolute origin-[calc(12/30*100%)_calc(3/34*100%)] scale-50 opacity-0 transition-[opacity,scale,rotate] duration-300 ease-out motion-reduce:transition-none",
        "fill-white stroke-[#0a0a0b] [filter:drop-shadow(1.5px_2px_0_rgb(0_0_0/0.3))]",
        name === "arrow"
          ? "-rotate-12 group-data-[shape=arrow]:rotate-0 group-data-[shape=arrow]:scale-100 group-data-[shape=arrow]:opacity-100"
          : "rotate-12 group-data-[shape=hand]:rotate-0 group-data-[shape=hand]:scale-100 group-data-[shape=hand]:opacity-100",
      )}
      strokeWidth={1.5}
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      {children}
    </svg>
  );
}

export function ArrowShape() {
  return (
    <Shape name="arrow">
      <path d="M0 0 V21.5 L5.2 16.6 L9 25.4 L12.8 23.7 L9 15.4 H16.2 Z" fill={PAPER} stroke={INK} />
    </Shape>
  );
}

/** The old Macintosh glove: index finger up, three knuckles, thumb and a cuff. */
export function HandShape() {
  return (
    <Shape name="hand">
      <path
        fill={PAPER}
        stroke={INK}
        d="M-2.2 8 V2.4 C-2.2 1.1 -1.2 0.2 0 0.2 C1.2 0.2 2.2 1.1 2.2 2.4 V8 C2.9 7.5 4.4 7.5 5 8.5 C5.6 8 7.2 8 7.8 9 C8.5 8.7 10 9 10.4 10.3 V15.4 C10.4 19 9.5 21.4 8.4 23 V26.4 H-3.6 V23 C-4.8 21.4 -6.9 18.8 -8.3 16 C-8.9 14.8 -8.5 13.6 -7.3 13.2 C-6.3 12.9 -5.2 13.5 -4.2 14.8 L-2.2 17 Z"
      />
      <path
        d="M2.2 8.6 V12.6 M5 9.3 V12.6 M7.8 10 V12.6 M-3.6 23.4 H8.4"
        fill="none"
        stroke={INK}
      />
    </Shape>
  );
}
