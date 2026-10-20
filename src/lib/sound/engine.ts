export type UiSound = "hover" | "item" | "click" | "pop" | "open" | "close" | "focus";

/** Sounds made of tuned notes; `focus` plays recordings instead. */
type ToneSound = Exclude<UiSound, "focus">;

type Note = {
  frequency: number;
  /** Seconds after the sound starts. */
  at: number;
  duration: number;
  volume: number;
  sweepTo?: number;
};

// C major pentatonic: any two notes sound consonant, so random variation never clashes.
const C4 = 261.63;
const E4 = 329.63;
const G4 = 392;
const A4 = 440;
const C5 = 523.25;
const D5 = 587.33;
const E5 = 659.25;
const G5 = 783.99;

/** Each sound owns one or more variants; repeated triggers rotate so it is never the same twice in a row. */
const sounds: Record<ToneSound, readonly (readonly Note[])[]> = {
  hover: [
    [{ frequency: G4, at: 0, duration: 0.16, volume: 0.014 }],
    [{ frequency: A4, at: 0, duration: 0.16, volume: 0.014 }],
    [{ frequency: C5, at: 0, duration: 0.14, volume: 0.012 }],
    [{ frequency: D5, at: 0, duration: 0.14, volume: 0.012 }],
  ],
  // Sweeping across a list fires this many times a second, so it stays a faint, very short tick.
  item: [
    [{ frequency: 520, at: 0, duration: 0.02, volume: 0.008 }],
    [{ frequency: 590, at: 0, duration: 0.02, volume: 0.008 }],
    [{ frequency: 460, at: 0, duration: 0.02, volume: 0.008 }],
  ],
  // A dry, tiny tick: a falling tap reads as an error and a rising pair as a jingle.
  click: [
    [{ frequency: 400, at: 0, duration: 0.035, volume: 0.03 }],
    [{ frequency: 470, at: 0, duration: 0.035, volume: 0.03 }],
  ],
  // Two glides, falling to open and rising to close, each settling on a scale note.
  open: [
    [
      { frequency: G5, at: 0, duration: 0.22, volume: 0.024 },
      { frequency: D5, at: 0.05, duration: 0.3, volume: 0.022 },
      { frequency: G4, at: 0.1, duration: 0.45, volume: 0.024 },
    ],
  ],
  close: [
    [
      { frequency: C5, at: 0, duration: 0.32, volume: 0.03 },
      { frequency: E5, at: 0.06, duration: 0.32, volume: 0.026 },
      { frequency: G5, at: 0.12, duration: 0.5, volume: 0.024 },
    ],
  ],
  // A single soft bell: light enough to sit under the text appearing.
  pop: [
    [{ frequency: G4, at: 0, duration: 0.3, volume: 0.02 }],
    [{ frequency: C4, at: 0, duration: 0.3, volume: 0.024 }],
    [{ frequency: E4, at: 0, duration: 0.3, volume: 0.022 }],
  ],
};

const ATTACK = 0.008;
const DETUNE_CENTS = 7;
const REVERB_SECONDS = 0.6;
const REVERB_MIX = 0.15;
// One knob for every interaction sound, so the music level stays independent.
const UI_VOLUME = 1.35;

type Graph = { context: AudioContext; input: GainNode };

let graph: Graph | null = null;
const lastVariant = new Map<ToneSound, number>();

/** A decaying noise burst is a cheap, asset-free room reverb. */
function createImpulse(context: AudioContext): AudioBuffer {
  const length = Math.floor(context.sampleRate * REVERB_SECONDS);
  const impulse = context.createBuffer(2, length, context.sampleRate);
  for (let channel = 0; channel < impulse.numberOfChannels; channel += 1) {
    const data = impulse.getChannelData(channel);
    for (let i = 0; i < length; i += 1) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 3;
    }
  }
  return impulse;
}

function createGraph(): Graph {
  const context = new AudioContext();
  const input = context.createGain();
  const reverb = context.createConvolver();
  const wet = context.createGain();
  reverb.buffer = createImpulse(context);
  input.gain.value = UI_VOLUME;
  wet.gain.value = REVERB_MIX;
  input.connect(context.destination);
  input.connect(reverb).connect(wet).connect(context.destination);
  return { context, input };
}

function pickVariant(sound: ToneSound): readonly Note[] {
  const variants = sounds[sound];
  const previous = lastVariant.get(sound);
  let index = Math.floor(Math.random() * variants.length);
  if (variants.length > 1 && index === previous) index = (index + 1) % variants.length;
  lastVariant.set(sound, index);
  return variants[index] ?? [];
}

/** Two slightly detuned sines make one soft, chorused tone instead of a bare beep. */
function playNote({ context, input }: Graph, note: Note, origin: number): void {
  const start = origin + note.at;
  const end = start + note.duration;
  const gain = context.createGain();
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.linearRampToValueAtTime(note.volume, start + ATTACK);
  gain.gain.exponentialRampToValueAtTime(0.0001, end);
  gain.connect(input);

  for (const detune of [-DETUNE_CENTS, DETUNE_CENTS]) {
    const oscillator = context.createOscillator();
    oscillator.frequency.setValueAtTime(note.frequency, start);
    if (note.sweepTo) oscillator.frequency.exponentialRampToValueAtTime(note.sweepTo, end);
    oscillator.detune.value = detune;
    oscillator.connect(gain);
    oscillator.start(start);
    oscillator.stop(end);
  }
}

type Recording = {
  url: string;
  /** Evens the files out: their peaks sit between 0 dB and -6 dB, and the UI sounds are much quieter. */
  volume: number;
};

type Placement = {
  recording: Recording;
  /** Seconds after the hover starts at which the file starts playing. */
  at: number;
};

/** Playback speed of the recordings; it matches the pace of the focus pull on screen. */
const FOCUS_RATE = 1.4;
/**
 * Every recording is cut to this many seconds, whatever its length, so that all variants feel the
 * same: the click and a hint of its tail, with the long mechanism whirr dropped.
 */
const FOCUS_CLIP_SECONDS = 0.2;
const FOCUS_CLIP_FADE_SECONDS = 0.07;
/** Seconds to fade out a focus sound that a newer hover cuts short. */
const FOCUS_CUT_SECONDS = 0.04;

const MECHANISM: Recording = { url: "/sfx/projects/classic-camera-click-1440.wav", volume: 0.07 };
const SHUTTER: Recording = { url: "/sfx/projects/vintage-camera-shutter-1438.wav", volume: 0.08 };
const SOFT_CLICK: Recording = { url: "/sfx/projects/camera-shutter-click-1133.wav", volume: 0.08 };

// Each file clicks a little after its start (0.15 s, 0.1 s and 0.15 s, before the speed up), so
// `at` is early enough that the clicks land on the two dips of the shutter in the picture, about
// 0.21 s and 0.56 s into the pull. Hovers rotate between these so it is never the same twice.
const FOCUS_VARIANTS: readonly (readonly Placement[])[] = [
  [
    { recording: MECHANISM, at: 0.1 },
    { recording: SHUTTER, at: 0.49 },
  ],
  [
    { recording: SHUTTER, at: 0.14 },
    { recording: SOFT_CLICK, at: 0.45 },
  ],
  [
    { recording: SOFT_CLICK, at: 0.1 },
    { recording: MECHANISM, at: 0.45 },
  ],
];

let lastFocusVariant = -1;

function pickFocusVariant(): readonly Placement[] {
  let index = Math.floor(Math.random() * FOCUS_VARIANTS.length);
  if (index === lastFocusVariant) index = (index + 1) % FOCUS_VARIANTS.length;
  lastFocusVariant = index;
  return FOCUS_VARIANTS[index] ?? [];
}

const samples = new Map<string, Promise<AudioBuffer | null>>();

function loadSample(context: AudioContext, url: string): Promise<AudioBuffer | null> {
  let sample = samples.get(url);
  if (!sample) {
    sample = fetch(url)
      .then((response) => response.arrayBuffer())
      .then((bytes) => context.decodeAudioData(bytes))
      .catch(() => null);
    samples.set(url, sample);
  }
  return sample;
}

/**
 * Warms the HTTP cache with the focus recordings so that the first hover is not heard late. It does
 * not open an audio context, which browsers refuse to start before a user gesture.
 */
export function preloadFocusSounds(): void {
  for (const { url } of [MECHANISM, SHUTTER, SOFT_CLICK]) void fetch(url).catch(() => undefined);
}

let focusVoice: GainNode | null = null;

/** One focus sound at a time: sweeping over projects fades the previous one instead of stacking. */
async function playFocus({ context, input }: Graph): Promise<void> {
  const placements = pickFocusVariant();
  const buffers = await Promise.all(
    placements.map(({ recording }) => loadSample(context, recording.url)),
  );
  const origin = context.currentTime;
  if (focusVoice) {
    focusVoice.gain.cancelScheduledValues(origin);
    focusVoice.gain.setValueAtTime(focusVoice.gain.value, origin);
    focusVoice.gain.linearRampToValueAtTime(0, origin + FOCUS_CUT_SECONDS);
  }
  const voice = context.createGain();
  voice.connect(input);
  focusVoice = voice;

  placements.forEach(({ recording, at }, index) => {
    const buffer = buffers[index];
    if (!buffer) return;
    const source = context.createBufferSource();
    const gain = context.createGain();
    source.buffer = buffer;
    source.playbackRate.value = FOCUS_RATE;
    const start = origin + at;
    const end = start + FOCUS_CLIP_SECONDS;
    gain.gain.setValueAtTime(recording.volume, start);
    gain.gain.setValueAtTime(recording.volume, end - FOCUS_CLIP_FADE_SECONDS);
    gain.gain.linearRampToValueAtTime(0, end);
    source.connect(gain).connect(voice);
    source.start(start);
    source.stop(end);
  });
}

/** Interaction tones are synthesized; only the focus sound plays recordings. */
export function playUiSound(sound: UiSound): void {
  // Browsers only allow audio after a user gesture; never try before one.
  if (!navigator.userActivation?.hasBeenActive) return;
  graph ??= createGraph();
  if (graph.context.state === "suspended") void graph.context.resume();

  const origin = graph.context.currentTime;
  if (sound === "focus") {
    void playFocus(graph);
    return;
  }
  for (const note of pickVariant(sound)) playNote(graph, note, origin);
}
