"use client";

import type { LucideIcon } from "lucide-react";
import { Volume2, VolumeX } from "lucide-react";
import type { RefObject } from "react";
import { Icon } from "@/components/atoms/icon";
import { formatTime } from "./format-time";

const ALIGNMENTS = {
  start: "left-0",
  center: "left-1/2 -translate-x-1/2",
  end: "right-0",
} as const;

/** A round glass button that grows under the pointer, pops when its icon changes and names itself. */
export function ControlButton({
  label,
  icon,
  onClick,
  filled = false,
  align = "center",
}: {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  filled?: boolean;
  /** Which edge the name lines up with, so it never runs out of the player. */
  align?: "start" | "center" | "end";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="group/button relative grid size-11 cursor-pointer shrink-0 place-items-center rounded-full bg-on-scrim/15 text-on-scrim backdrop-blur-md transition-[transform,background-color,color] duration-200 hover:scale-110 hover:bg-on-scrim hover:text-scrim focus-visible:scale-110 focus-visible:bg-on-scrim focus-visible:text-scrim focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-on-scrim active:scale-95"
    >
      <span key={label} className="control-pop grid place-items-center">
        <Icon icon={icon} className={filled ? "fill-current" : ""} />
      </span>
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute bottom-full mb-2 -translate-y-1 whitespace-nowrap ${ALIGNMENTS[align]} rounded-full bg-on-scrim px-3 py-1 text-xs font-medium text-scrim opacity-0 transition duration-200 group-hover/button:translate-y-0 group-hover/button:opacity-100 group-focus-visible/button:translate-y-0 group-focus-visible/button:opacity-100`}
      >
        {label}
      </span>
    </button>
  );
}

const THUMB =
  "[&::-moz-range-thumb]:size-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-on-scrim [&::-webkit-slider-thumb]:size-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-on-scrim";

/** The position in the video: what is played, what is already downloaded, and what is left. */
export function SeekBar({
  video,
  current,
  duration,
  played,
  loaded,
  label,
}: {
  video: RefObject<HTMLVideoElement | null>;
  current: number;
  duration: number;
  played: number;
  loaded: number;
  label: string;
}) {
  return (
    <input
      type="range"
      min={0}
      max={duration || 0}
      step={0.1}
      value={current}
      aria-label={label}
      aria-valuetext={`${formatTime(current)} / ${formatTime(duration)}`}
      onChange={(event) => {
        if (video.current) video.current.currentTime = Number(event.target.value);
      }}
      style={{
        background: `linear-gradient(to right, #fff ${played}%, rgb(255 255 255 / 0.5) ${played}%, rgb(255 255 255 / 0.5) ${loaded}%, rgb(255 255 255 / 0.2) ${loaded}%)`,
      }}
      className={`h-1.5 min-w-0 flex-1 cursor-pointer appearance-none rounded-full transition-[height] duration-200 hover:h-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-on-scrim ${THUMB}`}
    />
  );
}

/** The mute button, and the volume slider that unfolds beside it when it is pointed at. */
export function VolumeControl({
  video,
  muted,
  volume,
  labels,
  onToggleMute,
}: {
  video: RefObject<HTMLVideoElement | null>;
  muted: boolean;
  volume: number;
  labels: { mute: string; unmute: string; volume: string };
  onToggleMute: () => void;
}) {
  const level = muted ? 0 : volume;
  return (
    <div className="group/volume flex items-center gap-2">
      <ControlButton
        label={muted ? labels.unmute : labels.mute}
        icon={muted ? VolumeX : Volume2}
        onClick={onToggleMute}
      />
      <input
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={level}
        aria-label={labels.volume}
        onChange={(event) => {
          const element = video.current;
          if (!element) return;
          element.volume = Number(event.target.value);
          element.muted = element.volume === 0;
        }}
        style={{
          background: `linear-gradient(to right, #fff ${level * 100}%, rgb(255 255 255 / 0.25) ${level * 100}%)`,
        }}
        className={`h-1.5 w-0 cursor-pointer appearance-none rounded-full opacity-0 transition-[width,opacity] duration-300 group-focus-within/volume:w-20 group-focus-within/volume:opacity-100 group-hover/volume:w-20 group-hover/volume:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-on-scrim ${THUMB}`}
      />
    </div>
  );
}
