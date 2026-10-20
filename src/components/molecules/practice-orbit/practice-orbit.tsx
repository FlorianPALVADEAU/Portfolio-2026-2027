"use client";

import { type ReactNode, useEffect, useId, useRef, useState } from "react";
import { Pop } from "@/components/atoms/pop";
import { Text } from "@/components/atoms/text";
import { SkillChip } from "@/components/molecules/skill-chip";
import { cn } from "@/lib/utils";

type PracticeOrbitProps = {
  practices: readonly { name: string; note: string }[];
  /** What sits in the middle of the ring. */
  children: ReactNode;
};

const STAGGER_SECONDS = 0.18;
const FIRST_ANGLE_DEG = -90;
/** Radius of the ring, in the 100-unit square of the drawing. */
const RING_RADIUS = 49.5;
/** Radius where the spokes start, clear of the centrepiece. */
const SPOKE_START = 22;

/** Where a practice sits on the ring, as a share of the width and height of the orbit. */
function place(order: number, count: number, radius = RING_RADIUS) {
  const angle = ((FIRST_ANGLE_DEG + order * (360 / count)) * Math.PI) / 180;
  return { x: 50 + radius * Math.cos(angle), y: 50 + radius * Math.sin(angle) };
}

const draw =
  "transition-[stroke-dashoffset,opacity,color] duration-[1400ms] ease-out [stroke-dasharray:1] in-data-[reveal=off]:[stroke-dashoffset:1]";

/**
 * Practices placed evenly on a ring around a centrepiece. The ring draws itself, a spoke reaches
 * out to each practice, and each practice then pops in. Hovering, focusing or tapping a practice
 * lights its spoke and pops a note open beside it. On small screens there is no room for popovers:
 * the ring is dropped and every practice is a row with its note showing.
 */
export function PracticeOrbit({ practices, children }: PracticeOrbitProps) {
  const [active, setActive] = useState<number | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const noteId = useId();

  useEffect(() => {
    if (active === null) return;
    const close = (event: Event) => {
      const outside = event.target instanceof Node && !root.current?.contains(event.target);
      if (outside || (event instanceof KeyboardEvent && event.key === "Escape")) setActive(null);
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", close);
    };
  }, [active]);

  const count = practices.length;
  return (
    <div ref={root} className="flex flex-col gap-4 md:gap-6">
      <div className="relative mx-auto flex w-full flex-col items-center md:aspect-square md:w-[min(34rem,100%,62svh)] md:justify-center md:gap-0">
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 100 100"
          className="absolute inset-0 hidden size-full text-border md:block"
        >
          <circle
            cx="50"
            cy="50"
            r={RING_RADIUS}
            pathLength="1"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.3"
            className={draw}
          />
          {practices.map(({ name }, order) => {
            const end = place(order, count);
            const start = place(order, count, SPOKE_START);
            return (
              <line
                key={name}
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                pathLength="1"
                stroke="currentColor"
                strokeWidth={active === order ? 0.5 : 0.2}
                className={cn(draw, active === order && "text-accent")}
                style={{ transitionDelay: `${0.5 + order * STAGGER_SECONDS}s` }}
              />
            );
          })}
          <circle
            cx="50"
            cy="50"
            r="34"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.3"
            strokeDasharray="1 2"
            className="origin-center transition-opacity duration-1000 in-data-[reveal=off]:opacity-0 motion-safe:animate-[spin_120s_linear_infinite]"
          />
        </svg>
        <Pop from="pop" delay={0.2} className="relative">
          {children}
        </Pop>
        <ul className="flex flex-wrap justify-center gap-2 max-md:hidden md:static md:contents">
          {practices.map(({ name, note }, order) => {
            const { x, y } = place(order, count);
            const open = active === order;
            return (
              <li
                key={name}
                className={cn(
                  "md:absolute md:-translate-x-1/2 md:-translate-y-1/2",
                  open && "z-10",
                )}
                style={{ left: `${x}%`, top: `${y}%` }}
                onPointerEnter={(event) => event.pointerType === "mouse" && setActive(order)}
                onPointerLeave={(event) => event.pointerType === "mouse" && setActive(null)}
              >
                <Pop from="pop" delay={0.7 + order * STAGGER_SECONDS}>
                  <button
                    type="button"
                    aria-describedby={`${noteId}-${order}`}
                    aria-expanded={open}
                    onClick={() => setActive(open ? null : order)}
                    className="cursor-pointer rounded-full"
                  >
                    <SkillChip name={name} icon={null} active={open} />
                  </button>
                </Pop>
                <span
                  id={`${noteId}-${order}`}
                  role="tooltip"
                  data-open={open}
                  className={cn(
                    "pointer-events-none absolute left-1/2 z-20 w-64 -translate-x-1/2 rounded-2xl border border-border bg-surface p-4 text-left text-sm text-pretty shadow-lg max-md:hidden",
                    "scale-90 opacity-0 transition-[scale,opacity] duration-(--duration-base) ease-[cubic-bezier(0.34,1.56,0.64,1)] data-[open=true]:scale-100 data-[open=true]:opacity-100",
                    y < 50 ? "top-full mt-3 origin-top" : "bottom-full mb-3 origin-bottom",
                  )}
                >
                  {note}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
      <ul className="flex flex-col md:hidden">
        {practices.map(({ name, note }, order) => (
          <li key={name} className="flex flex-col gap-0.5 border-t border-border py-2">
            <Pop from="rise" delay={0.5 + order * 0.1}>
              <p className="font-semibold">{name}</p>
              <Text size="sm" tone="muted" className="text-pretty">
                {note}
              </Text>
            </Pop>
          </li>
        ))}
      </ul>
    </div>
  );
}
