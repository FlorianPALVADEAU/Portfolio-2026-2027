/** Point-cloud shapes the scene morphs between, one per stage of the page. */
export const SHAPE_COUNT = 5;

type Shape = (index: number, count: number, random: () => number) => [number, number, number];

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

const sphere: Shape = (i, n) => {
  const y = 1 - (i / (n - 1)) * 2;
  const radius = Math.sqrt(1 - y * y);
  const angle = i * GOLDEN_ANGLE;
  return [Math.cos(angle) * radius * 2.2, y * 2.2, Math.sin(angle) * radius * 2.2];
};

/** A (2,3) torus knot: a single thread that reads as a product, not a ball. */
const knot: Shape = (i, n, random) => {
  const t = (i / n) * Math.PI * 2 * 3;
  const r = 1.2 + 0.6 * Math.cos(1.5 * t);
  const spread = 0.12;
  return [
    r * Math.cos(t) * 1.6 + (random() - 0.5) * spread,
    r * Math.sin(t) * 1.6 + (random() - 0.5) * spread,
    0.9 * Math.sin(1.5 * t) * 1.6 + (random() - 0.5) * spread,
  ];
};

/** A rippled lattice, the calm "infrastructure" stage. */
const lattice: Shape = (i, n) => {
  const side = Math.ceil(Math.sqrt(n));
  const x = ((i % side) / side - 0.5) * 6;
  const z = (Math.floor(i / side) / side - 0.5) * 6;
  return [x, Math.sin(x * 1.4) * Math.cos(z * 1.4) * 0.5 - 0.6, z];
};

const galaxy: Shape = (i, n, random) => {
  const t = i / n;
  const arm = (i % 3) * ((Math.PI * 2) / 3);
  const radius = 0.2 + t * 3.2;
  const angle = arm + t * 6.5;
  return [
    Math.cos(angle) * radius + (random() - 0.5) * 0.25,
    (random() - 0.5) * 0.35 * (1 - t),
    Math.sin(angle) * radius + (random() - 0.5) * 0.25,
  ];
};

/** Ends where it began, tighter: the call to action closes the loop. */
const closing: Shape = (i, n, random) => {
  const [x, y, z] = sphere(i, n, random);
  return [x * 0.55, y * 0.55, z * 0.55];
};

export const shapes: readonly Shape[] = [sphere, knot, lattice, galaxy, closing];

/** Horizontal offset per shape on wide screens, alternating so the cloud never sits under the copy. */
export const SHAPE_OFFSETS = [0.8, -2.4, 2.2, -2.4, 2.4] as const;
