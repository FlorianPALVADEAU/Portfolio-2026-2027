// A chill study-beat loop synthesized live: warm electric piano on mellow jazz chords, a sparse
// kalimba melody that varies every pass, a soft bass, a lazy swung drum groove and vinyl dust.
// Nothing is downloaded.

const BPM = 78;
const BEAT = 60 / BPM;
const STEP = BEAT / 4;
const STEPS_PER_BAR = 16;
const SWING = 0.28;
const HUMANIZE = 0.016;
const LOOKAHEAD = 0.4;
const TICK_MS = 100;
const MASTER_VOLUME = 0.42;
const FADE_SECONDS = 2.5;
const REVERB_SECONDS = 2.4;

// Eight bars so the loop takes ~19 seconds to come around: the ear stops predicting it.
// F, Em, Dm, C, F, Am, Dm, G sus: the bass walks down F-E-D-C then turns home through A and G.
const bars = [
  { root: 87.31, keys: [220, 261.63, 329.63, 392] },
  { root: 82.41, keys: [196, 246.94, 293.66, 329.63] },
  { root: 73.42, keys: [174.61, 220, 261.63, 329.63] },
  { root: 65.41, keys: [196, 246.94, 293.66, 329.63] },
  { root: 87.31, keys: [220, 261.63, 329.63, 392] },
  { root: 110, keys: [261.63, 329.63, 392, 493.88] },
  { root: 73.42, keys: [174.61, 220, 261.63, 329.63] },
  { root: 98, keys: [174.61, 261.63, 293.66, 329.63] },
] as const;

// C major pentatonic over two octaves: it fits every chord above, so the melody can wander freely.
const SCALE = [392, 440, 523.25, 587.33, 659.25, 783.99, 880, 1046.5] as const;

// Where the melody may land inside a bar (16 steps). Offbeat shapes keep it from sounding square.
const MELODY_RHYTHMS = [
  [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0],
  [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
] as const;

// Steps where the piano strikes its chord; a long hit on the downbeat, short syncopated ones after.
const COMPING = [
  [0, 6, 10],
  [0, 7, 11, 14],
  [0, 3, 10],
  [0, 6, 9, 14],
] as const;

const KICKS = [
  [0, 6, 10],
  [0, 7, 10, 13],
  [0, 3, 8, 11],
] as const;

type Bar = (typeof bars)[number];

type Engine = {
  context: AudioContext;
  melodyBus: GainNode;
  drumBus: GainNode;
  master: GainNode;
  noise: AudioBuffer;
  hiss: AudioBufferSourceNode;
  timer: number;
  nextTime: number;
  step: number;
  /** Scale index per step of the current bar's melody; -1 is a rest. */
  phrase: number[];
};

let engine: Engine | null = null;

const jitter = () => (Math.random() - 0.5) * HUMANIZE;
const accent = (volume: number) => volume * (0.75 + Math.random() * 0.5);
const pick = <T>(items: readonly T[]): T => items[Math.floor(Math.random() * items.length)] as T;

function noiseBuffer(
  context: AudioContext,
  seconds: number,
  shape: (i: number, n: number) => number,
) {
  const length = Math.floor(context.sampleRate * seconds);
  const buffer = context.createBuffer(2, length, context.sampleRate);
  for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
    const data = buffer.getChannelData(channel);
    for (let i = 0; i < length; i += 1) data[i] = (Math.random() * 2 - 1) * shape(i, length);
  }
  return buffer;
}

function vinylBuffer(context: AudioContext, seconds: number): AudioBuffer {
  const length = Math.floor(context.sampleRate * seconds);
  const buffer = context.createBuffer(1, length, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i += 1) {
    const pop = Math.random() < 0.0003 ? (Math.random() * 2 - 1) * 0.5 : 0;
    data[i] = (Math.random() * 2 - 1) * 0.006 + pop * 0.12;
  }
  return buffer;
}

function envelope(context: AudioContext, start: number, peak: number, attack: number, end: number) {
  const gain = context.createGain();
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.linearRampToValueAtTime(peak, start + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, end);
  return gain;
}

type Tine = { frequency: number; start: number; duration: number; volume: number; bell: number };

/**
 * Two-operator FM: the modulator adds a bright strike that dies fast, which is the tine of an
 * electric piano. A higher `bell` ratio turns it into a kalimba.
 */
function tine({ context, melodyBus }: Engine, t: Tine): void {
  const end = t.start + t.duration;
  const carrier = context.createOscillator();
  const modulator = context.createOscillator();
  const depth = context.createGain();
  carrier.frequency.value = t.frequency;
  modulator.frequency.value = t.frequency * t.bell;
  depth.gain.setValueAtTime(t.frequency * 1.6, t.start);
  depth.gain.exponentialRampToValueAtTime(t.frequency * 0.05, t.start + 0.25);
  modulator.connect(depth).connect(carrier.frequency);
  carrier.connect(envelope(context, t.start, t.volume, 0.004, end)).connect(melodyBus);
  for (const oscillator of [carrier, modulator]) {
    oscillator.start(t.start);
    oscillator.stop(end);
  }
}

function sine(
  { context, melodyBus }: Engine,
  frequency: number,
  start: number,
  duration: number,
  volume: number,
) {
  const end = start + duration;
  const filter = context.createBiquadFilter();
  const oscillator = context.createOscillator();
  filter.type = "lowpass";
  filter.frequency.value = 420;
  oscillator.frequency.value = frequency;
  oscillator
    .connect(filter)
    .connect(envelope(context, start, volume, 0.012, end))
    .connect(melodyBus);
  oscillator.start(start);
  oscillator.stop(end);
}

function playComp(current: Engine, bar: Bar, time: number, long: boolean): void {
  bar.keys.forEach((frequency, index) => {
    tine(current, {
      frequency,
      start: time + index * 0.012,
      duration: long ? BEAT * 2.2 : BEAT * 0.9,
      volume: accent(long ? 0.034 : 0.026),
      bell: 1,
    });
  });
}

function drum(
  { context, drumBus, noise }: Engine,
  time: number,
  duration: number,
  volume: number,
  filterType: BiquadFilterType,
  frequency: number,
): void {
  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  source.buffer = noise;
  filter.type = filterType;
  filter.frequency.value = frequency;
  source
    .connect(filter)
    .connect(envelope(context, time, volume, 0.002, time + duration))
    .connect(drumBus);
  source.start(time, Math.random() * 2);
  source.stop(time + duration);
}

function kick({ context, drumBus }: Engine, time: number, volume: number): void {
  const end = time + 0.3;
  const oscillator = context.createOscillator();
  oscillator.frequency.setValueAtTime(115, time);
  oscillator.frequency.exponentialRampToValueAtTime(46, time + 0.12);
  oscillator.connect(envelope(context, time, volume, 0.003, end)).connect(drumBus);
  oscillator.start(time);
  oscillator.stop(end);
}

function snare(current: Engine, time: number, volume: number): void {
  drum(current, time, 0.18, volume, "bandpass", 1500);
}

function playDrums(current: Engine, bar: number, position: number, time: number): void {
  const kicks: readonly number[] = KICKS[Math.floor(bar / 2) % KICKS.length] ?? [0];
  if (kicks.includes(position)) kick(current, time, position === 0 ? 0.3 : 0.17);
  if (position === 4 || position === 12) snare(current, time, 0.065);
  if (position % 4 === 0) drum(current, time, 0.04, 0.02, "bandpass", 6500);
  else if (position % 2 === 0) drum(current, time, 0.03, 0.012, "bandpass", 6500);
  else if (Math.random() < 0.2) drum(current, time, 0.025, 0.007, "bandpass", 7000);
}

function playBass(current: Engine, bar: Bar, position: number, time: number): void {
  if (position === 0) sine(current, bar.root, time, BEAT * 1.5, 0.13);
  if (position === 10) sine(current, bar.root * 1.5, time, BEAT * 0.7, 0.09);
  if (position === 7) sine(current, bar.root * 2, time, BEAT * 0.4, 0.06);
}

/** Repeats the previous bar's contour on odd bars so it feels like a phrase, else invents one. */
function composePhrase(current: Engine, bar: number): void {
  const mirror = bar % 2 === 1 && Math.random() < 0.7;
  if (mirror) return;
  let index = 2 + Math.floor(Math.random() * 4);
  current.phrase = pick(MELODY_RHYTHMS).map((hit) => {
    if (!hit) return -1;
    index = Math.min(SCALE.length - 1, Math.max(0, index + pick([-2, -1, -1, 1, 1, 2])));
    return index;
  });
}

function playMelody(current: Engine, position: number, time: number): void {
  if (Math.random() < 0.3) return;
  const frequency = SCALE[current.phrase[position] ?? -1];
  if (frequency === undefined) return;
  tine(current, { frequency, start: time, duration: 0.9, volume: accent(0.024), bell: 2 });
}

function scheduleStep(current: Engine, step: number, base: number): void {
  const bar = Math.floor(step / STEPS_PER_BAR) % bars.length;
  const position = step % STEPS_PER_BAR;
  const chord = bars[bar];
  if (!chord) return;
  // Odd sixteenths lag behind the grid: that lag is the swing.
  const time = base + (position % 2 === 1 ? STEP * SWING : 0) + jitter();

  if (position === 0) composePhrase(current, bar);
  const stab = (COMPING[bar % COMPING.length] ?? COMPING[0]) as readonly number[];
  if (stab.includes(position)) playComp(current, chord, time, position === 0);
  playBass(current, chord, position, time);
  playDrums(current, bar, position, time);
  playMelody(current, position, time);
}

function schedule(current: Engine): void {
  while (current.nextTime < current.context.currentTime + LOOKAHEAD) {
    scheduleStep(current, current.step, current.nextTime);
    current.nextTime += STEP;
    current.step += 1;
  }
}

function build(): Engine {
  const context = new AudioContext();
  const master = context.createGain();
  const melodyBus = context.createGain();
  const drumBus = context.createGain();
  const reverb = context.createConvolver();
  const reverbLevel = context.createGain();
  const drumSend = context.createGain();
  const echo = context.createDelay(2);
  const feedback = context.createGain();
  const echoTone = context.createBiquadFilter();
  const echoLevel = context.createGain();
  const warmth = context.createBiquadFilter();

  reverb.buffer = noiseBuffer(context, REVERB_SECONDS, (i, n) => (1 - i / n) ** 2.5);
  reverbLevel.gain.value = 0.3;
  drumSend.gain.value = 0.18;
  // A dotted eighth echo darkens as it repeats, so the melody sparkles first and then melts away.
  echo.delayTime.value = BEAT * 0.75;
  feedback.gain.value = 0.34;
  echoTone.type = "lowpass";
  echoTone.frequency.value = 1800;
  echoLevel.gain.value = 0.25;
  master.gain.value = 0.0001;

  melodyBus.connect(master);
  melodyBus.connect(echo).connect(echoTone).connect(feedback).connect(echo);
  echoTone.connect(echoLevel).connect(master);
  melodyBus.connect(reverb);
  drumBus.connect(master);
  drumBus.connect(drumSend).connect(reverb);
  reverb.connect(reverbLevel).connect(master);
  // Rolling off the top is what makes it sound like tape.
  warmth.type = "lowpass";
  warmth.frequency.value = 4200;
  master.connect(warmth).connect(context.destination);

  // Hiss and sparse pops, the dust of a worn record.
  const hiss = context.createBufferSource();
  const hissGain = context.createGain();
  const noise = noiseBuffer(context, 4, () => 1);
  hiss.buffer = vinylBuffer(context, 6);
  hiss.loop = true;
  hissGain.gain.value = 0.35;
  hiss.connect(hissGain).connect(master);
  hiss.start();

  return {
    context,
    melodyBus,
    drumBus,
    master,
    noise,
    hiss,
    timer: 0,
    nextTime: context.currentTime + 0.1,
    step: 0,
    phrase: new Array<number>(STEPS_PER_BAR).fill(-1),
  };
}

export function startMusic(): void {
  if (engine) return;
  const current = build();
  engine = current;
  void current.context.resume();
  current.master.gain.exponentialRampToValueAtTime(
    MASTER_VOLUME,
    current.context.currentTime + FADE_SECONDS,
  );
  current.timer = window.setInterval(() => schedule(current), TICK_MS);
  schedule(current);
}

export function stopMusic(): void {
  const current = engine;
  if (!current) return;
  engine = null;
  window.clearInterval(current.timer);
  const now = current.context.currentTime;
  current.master.gain.cancelScheduledValues(now);
  current.master.gain.setValueAtTime(Math.max(current.master.gain.value, 0.0001), now);
  current.master.gain.exponentialRampToValueAtTime(0.0001, now + 1);
  // Notes already scheduled ring out under the fade before the context is released.
  window.setTimeout(() => {
    current.hiss.stop();
    void current.context.close();
  }, 1100);
}
