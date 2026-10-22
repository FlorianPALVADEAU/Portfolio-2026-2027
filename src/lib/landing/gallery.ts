export const galleryIds = [
  "portrait",
  "studio",
  "golf",
  "desk",
  "rome",
  "helmet",
  "newyork",
  "geneva",
  "mic",
  "summit",
  "code",
  "triathlon",
  "build",
  "whiteboard",
] as const;

type GalleryId = (typeof galleryIds)[number];

/** A photo, or a muted looping video whose poster is shown until it plays. */
type GalleryMedia = { kind: "image"; src: string } | { kind: "video"; src: string; poster: string };

export type GalleryItem = GalleryMedia & {
  id: GalleryId;
  /**
   * Where the item sits in the scene, in half-widths and half-heights of the stage from its
   * centre, as seen from a distance of 1.
   */
  ox: number;
  oy: number;
  /** Distance ahead of the viewer at the start; above 3.4 the item is hidden until it nears. */
  depth: number;
  /** Width as a share of the stage width on desktop, scaled up on small screens. */
  width: number;
  ratio: string;
};

/** Optimised files under `public/gallery`: a photo is a WebP, a video an H.264 clip with a WebP poster. */
const image = (name: string): GalleryMedia => ({ kind: "image", src: `/gallery/${name}.webp` });
const video = (name: string): GalleryMedia => ({
  kind: "video",
  src: `/gallery/${name}.mp4`,
  poster: `/gallery/${name}-poster.webp`,
});

/**
 * The first eight are on screen when the section opens; the rest come out of the distance
 * while the visitor scrolls. Positions keep clear of the centre, where the title sits.
 */
export const galleryItems: readonly GalleryItem[] = [
  {
    id: "code",
    ...video("code"),
    ox: -1.248,
    oy: -0.72,
    depth: 1.6,
    width: 0.32,
    ratio: "4 / 5",
  },
  {
    id: "studio",
    ...image("studio"),
    ox: 1.152,
    oy: 0.8,
    depth: 1.6,
    width: 0.32,
    ratio: "5 / 4",
  },
  {
    id: "golf",
    ...video("golf"),
    ox: -0.146,
    oy: 1.381,
    depth: 1.9,
    width: 0.18,
    ratio: "9 / 16",
  },
  {
    id: "desk",
    ...image("desk"),
    ox: 1.28,
    oy: -0.75,
    depth: 2.1,
    width: 0.238,
    ratio: "3 / 2",
  },
  {
    id: "rome",
    ...image("rome"),
    ox: -1.61,
    oy: 1.12,
    depth: 2.1,
    width: 0.19,
    ratio: "3 / 4",
  },
  {
    id: "helmet",
    ...video("helmet"),
    ox: 0.133,
    oy: -1.867,
    depth: 2.4,
    width: 0.2,
    ratio: "9 / 16",
  },
  {
    id: "newyork",
    ...image("newyork"),
    ox: 2.275,
    oy: 0.195,
    depth: 2.6,
    width: 0.23,
    ratio: "3 / 4",
  },
  {
    id: "portrait",
    ...image("portrait"),
    ox: -2.015,
    oy: -0.13,
    depth: 2.6,
    width: 0.13,
    ratio: "3 / 4",
  },
  {
    id: "mic",
    ...video("mic"),
    ox: -0.55,
    oy: 0.3,
    depth: 3.5,
    width: 0.22,
    ratio: "9 / 16",
  },
  {
    id: "summit",
    ...image("summit"),
    ox: 0.7,
    oy: -0.4,
    depth: 3.9,
    width: 0.24,
    ratio: "3 / 4",
  },
  {
    id: "geneva",
    ...image("geneva"),
    ox: -0.35,
    oy: -0.9,
    depth: 4.2,
    width: 0.2,
    ratio: "9 / 16",
  },
  {
    id: "triathlon",
    ...video("triathlon"),
    ox: 0.75,
    oy: 0.45,
    depth: 4.5,
    width: 0.21,
    ratio: "9 / 16",
  },
  {
    id: "build",
    ...video("build"),
    ox: -0.1,
    oy: 1.65,
    depth: 4.7,
    width: 0.2,
    ratio: "9 / 16",
  },
  {
    id: "whiteboard",
    ...image("whiteboard"),
    ox: 0.2,
    oy: 0.05,
    depth: 4.85,
    width: 0.3,
    ratio: "16 / 9",
  },
];
