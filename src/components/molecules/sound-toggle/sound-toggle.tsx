"use client";

import { gsap } from "gsap";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { Button } from "@/components/atoms/button";
import { prefersReducedMotion } from "@/lib/motion";
import {
  getServerSoundEnabled,
  getSoundEnabled,
  setSoundEnabled,
  subscribeSound,
} from "@/lib/sound";

const WIDTH = 24;
const MIDDLE = 6;
const AMPLITUDE = 4;
const CYCLES = 1.5;
const FLAT_LINE = `M0 ${MIDDLE}H${WIDTH}`;

function wavePath(amplitude: number, phase: number): string {
  const points: string[] = [];
  for (let x = 0; x <= WIDTH; x += 1) {
    const y = MIDDLE + amplitude * AMPLITUDE * Math.sin((x / WIDTH) * Math.PI * 2 * CYCLES + phase);
    points.push(`${x === 0 ? "M" : "L"}${x} ${y.toFixed(2)}`);
  }
  return points.join("");
}

type SoundToggleProps = {
  onLabel: string;
  offLabel: string;
};

/** A line that ripples while sound is on and settles flat when it is muted. */
export function SoundToggle({ onLabel, offLabel }: SoundToggleProps) {
  const enabled = useSyncExternalStore(subscribeSound, getSoundEnabled, getServerSoundEnabled);
  const path = useRef<SVGPathElement>(null);
  const wave = useRef({ amplitude: 0, phase: 0 });

  useEffect(() => {
    const state = wave.current;
    const draw = () => path.current?.setAttribute("d", wavePath(state.amplitude, state.phase));
    gsap.killTweensOf(state);

    gsap.to(state, {
      amplitude: enabled ? 1 : 0,
      duration: 0.5,
      ease: "power2.out",
      onUpdate: draw,
      onComplete: () => {
        if (!enabled) path.current?.setAttribute("d", FLAT_LINE);
      },
    });
    if (enabled && !prefersReducedMotion()) {
      gsap.to(state, {
        phase: `+=${Math.PI * 2}`,
        duration: 1.1,
        ease: "none",
        repeat: -1,
        onUpdate: draw,
      });
    }
    return () => {
      gsap.killTweensOf(state);
    };
  }, [enabled]);

  return (
    <Button
      variant="secondary"
      size="icon"
      aria-label={enabled ? onLabel : offLabel}
      onClick={() => setSoundEnabled(!enabled)}
    >
      <svg
        viewBox={`0 0 ${WIDTH} 12`}
        aria-hidden="true"
        className="h-3 w-6 overflow-visible"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path ref={path} d={FLAT_LINE} />
      </svg>
    </Button>
  );
}
