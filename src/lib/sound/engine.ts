export type UiSound = "hover" | "click" | "pop";

type Tone = { frequency: number; duration: number; volume: number; sweepTo?: number };

const tones: Record<UiSound, Tone> = {
  hover: { frequency: 1800, duration: 0.025, volume: 0.015 },
  click: { frequency: 660, duration: 0.07, volume: 0.04 },
  // A falling pitch reads as a bubble pop rather than a beep.
  pop: { frequency: 720, sweepTo: 260, duration: 0.09, volume: 0.05 },
};

let context: AudioContext | null = null;

/** Tones are synthesized, so there is no audio asset to download. */
export function playUiSound(sound: UiSound): void {
  // Browsers only allow audio after a user gesture; never try before one.
  if (!navigator.userActivation?.hasBeenActive) return;
  context ??= new AudioContext();
  if (context.state === "suspended") void context.resume();

  const { frequency, duration, volume, sweepTo } = tones[sound];
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const now = context.currentTime;
  oscillator.frequency.value = frequency;
  if (sweepTo) oscillator.frequency.exponentialRampToValueAtTime(sweepTo, now + duration);
  gain.gain.setValueAtTime(volume, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + duration);
}
