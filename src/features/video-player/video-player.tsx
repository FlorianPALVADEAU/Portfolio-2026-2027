"use client";

import { Loader2, Maximize, Minimize, Pause, Play, Volume2, VolumeX } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/atoms/icon";
import { formatTime } from "./format-time";

/** Seconds the arrow keys jump. */
const SKIP_SECONDS = 5;

type VideoPlayerProps = {
  src: string;
  poster: { src: string; width: number; height: number };
  /** Names the player for assistive technology, and the picture it opens on. */
  label: string;
  labels: {
    play: string;
    pause: string;
    mute: string;
    unmute: string;
    fullscreen: string;
    exitFullscreen: string;
    seek: string;
    loading: string;
  };
};

/** The furthest second already downloaded around the playhead. */
function bufferedEnd(video: HTMLVideoElement): number {
  const { buffered, currentTime } = video;
  for (let index = 0; index < buffered.length; index++) {
    if (buffered.start(index) <= currentTime && currentTime <= buffered.end(index)) {
      return buffered.end(index);
    }
  }
  return currentTime;
}

/**
 * A video that costs nothing until it is played: it shows its poster, downloads nothing, and
 * streams from the first request with the browser's own range requests, so any length starts at
 * once if the file has its index up front (see content/AGENTS.md). Controls are ours and keyboard
 * reachable; nothing ever starts by itself.
 */
export function VideoPlayer({ src, poster, label, labels }: VideoPlayerProps) {
  const box = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [muted, setMuted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  const toggle = () => {
    const element = video.current;
    if (!element) return;
    if (element.paused) {
      setStarted(true);
      element.play().catch(() => setPlaying(false));
    } else {
      element.pause();
    }
  };

  const toggleMute = () => {
    const element = video.current;
    if (element) element.muted = !element.muted;
  };

  const toggleFullscreen = () => {
    const element = video.current;
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else if (box.current?.requestFullscreen) {
      void box.current.requestFullscreen();
    } else if (element && "webkitEnterFullscreen" in element) {
      // iPhones only open their own player for a video element.
      (element as HTMLVideoElement & { webkitEnterFullscreen: () => void }).webkitEnterFullscreen();
    }
  };

  const jump = (seconds: number) => {
    const element = video.current;
    if (element)
      element.currentTime = Math.min(Math.max(element.currentTime + seconds, 0), duration);
  };

  // Kept in a ref so the listeners below, added once, always run the latest closures.
  const actions = useRef<Record<string, () => void>>({});
  actions.current = {
    k: toggle,
    m: toggleMute,
    f: toggleFullscreen,
    ArrowLeft: () => jump(-SKIP_SECONDS),
    ArrowRight: () => jump(SKIP_SECONDS),
  };

  useEffect(() => {
    const element = box.current;
    if (!element) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey
      )
        return;
      const action = actions.current[event.key];
      if (!action) return;
      event.preventDefault();
      action();
    };
    const onFullscreenChange = () => setFullscreen(document.fullscreenElement === element);
    element.addEventListener("keydown", onKeyDown);
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => {
      element.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, []);

  const played = duration > 0 ? (current / duration) * 100 : 0;
  const loaded = duration > 0 ? (buffered / duration) * 100 : 0;

  return (
    // biome-ignore lint/a11y/useSemanticElements: a group of controls around a video, not a form fieldset.
    <div
      ref={box}
      role="group"
      aria-label={label}
      className="group/player relative aspect-video w-full overflow-hidden rounded-3xl bg-black text-white"
    >
      <video
        ref={video}
        src={src}
        preload="none"
        playsInline
        onClick={toggle}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onDurationChange={(event) => setDuration(event.currentTarget.duration)}
        onTimeUpdate={(event) => {
          setCurrent(event.currentTarget.currentTime);
          setBuffered(bufferedEnd(event.currentTarget));
        }}
        onProgress={(event) => setBuffered(bufferedEnd(event.currentTarget))}
        onWaiting={() => setWaiting(true)}
        onPlaying={() => {
          setWaiting(false);
          setPlaying(true);
        }}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onVolumeChange={(event) => setMuted(event.currentTarget.muted)}
        className="size-full object-contain"
      >
        <track kind="captions" />
      </video>

      {!started && (
        <Image
          src={poster.src}
          width={poster.width}
          height={poster.height}
          alt=""
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="pointer-events-none absolute inset-0 size-full object-cover"
        />
      )}

      {!started && (
        <button
          type="button"
          onClick={toggle}
          aria-label={labels.play}
          className="absolute inset-0 grid place-items-center focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white"
        >
          <span className="grid size-16 place-items-center rounded-full bg-white text-black transition-transform motion-safe:duration-(--duration-base) group-hover/player:scale-105">
            <Icon icon={Play} size="lg" className="translate-x-0.5 fill-current" />
          </span>
        </button>
      )}

      {waiting && (
        <div role="status" className="pointer-events-none absolute inset-0 grid place-items-center">
          <Icon icon={Loader2} size="lg" className="motion-safe:animate-spin" />
          <span className="sr-only">{labels.loading}</span>
        </div>
      )}

      {started && (
        <div
          className={`absolute inset-x-0 bottom-0 flex items-center gap-3 bg-linear-to-t from-black/80 to-transparent px-4 pt-10 pb-3 transition-opacity motion-safe:duration-(--duration-base) group-focus-within/player:opacity-100 group-hover/player:opacity-100 ${playing ? "opacity-0" : "opacity-100"}`}
        >
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? labels.pause : labels.play}
            className="grid size-11 shrink-0 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-white"
          >
            <Icon icon={playing ? Pause : Play} className="fill-current" />
          </button>
          <span className="w-24 shrink-0 font-mono text-xs tabular-nums">
            {formatTime(current)} / {formatTime(duration)}
          </span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={current}
            aria-label={labels.seek}
            aria-valuetext={`${formatTime(current)} / ${formatTime(duration)}`}
            onChange={(event) => {
              if (video.current) video.current.currentTime = Number(event.target.value);
            }}
            style={{
              background: `linear-gradient(to right, #fff ${played}%, rgb(255 255 255 / 0.5) ${played}%, rgb(255 255 255 / 0.5) ${loaded}%, rgb(255 255 255 / 0.2) ${loaded}%)`,
            }}
            className="h-1 min-w-0 flex-1 cursor-pointer appearance-none rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white [&::-moz-range-thumb]:size-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white [&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
          />
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? labels.unmute : labels.mute}
            className="grid size-11 shrink-0 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-white"
          >
            <Icon icon={muted ? VolumeX : Volume2} />
          </button>
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label={fullscreen ? labels.exitFullscreen : labels.fullscreen}
            className="grid size-11 shrink-0 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-white"
          >
            <Icon icon={fullscreen ? Minimize : Maximize} />
          </button>
        </div>
      )}
    </div>
  );
}
