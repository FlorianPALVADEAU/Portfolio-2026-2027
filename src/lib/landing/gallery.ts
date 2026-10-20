export const galleryIds = [
  "peak",
  "meadow",
  "forest",
  "fog",
  "lake",
  "shore",
  "ocean",
  "field",
  "ridge",
  "falls",
  "valley",
  "road",
  "light",
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

const unsplash = (photo: string): GalleryMedia => ({
  kind: "image",
  src: `https://images.unsplash.com/photo-${photo}?auto=format&fit=crop&w=900&q=80`,
});

/**
 * Placeholder photos from Unsplash, to replace with local files under `public/photos`. The first
 * eight are on screen when the section opens; the last five come out of the distance while the
 * visitor scrolls. Positions keep clear of the centre, where the title sits.
 */
export const galleryItems: readonly GalleryItem[] = [
  {
    id: "peak",
    ...unsplash("1506905925346-21bda4d32df4"),
    ox: -1.248,
    oy: -0.72,
    depth: 1.6,
    width: 0.32,
    ratio: "4 / 5",
  },
  {
    id: "meadow",
    ...unsplash("1469474968028-56623f02e42e"),
    ox: 1.152,
    oy: 0.8,
    depth: 1.6,
    width: 0.32,
    ratio: "1 / 1",
  },
  {
    id: "forest",
    ...unsplash("1441974231531-c6227db76b6e"),
    ox: -0.146,
    oy: 1.681,
    depth: 1.9,
    width: 0.234,
    ratio: "3 / 4",
  },
  {
    id: "fog",
    ...unsplash("1470071459604-3b5ec3a7fe05"),
    ox: 1.68,
    oy: -1.05,
    depth: 2.1,
    width: 0.238,
    ratio: "4 / 3",
  },
  {
    id: "lake",
    ...unsplash("1501785888041-af3ef285b470"),
    ox: -1.61,
    oy: 1.12,
    depth: 2.1,
    width: 0.21,
    ratio: "1 / 1",
  },
  {
    id: "shore",
    ...unsplash("1507525428034-b723cf961d3e"),
    ox: 0.133,
    oy: -1.867,
    depth: 2.4,
    width: 0.16,
    ratio: "4 / 5",
  },
  {
    id: "ocean",
    ...unsplash("1518837695005-2083093ee35b"),
    ox: 2.275,
    oy: 0.195,
    depth: 2.6,
    width: 0.13,
    ratio: "3 / 4",
  },
  {
    id: "field",
    ...unsplash("1472214103451-9374bd1c798e"),
    ox: -2.015,
    oy: -0.13,
    depth: 2.6,
    width: 0.13,
    ratio: "1 / 1",
  },
  {
    id: "ridge",
    ...unsplash("1464822759023-fed622ff2c3b"),
    ox: -0.55,
    oy: 0.3,
    depth: 3.5,
    width: 0.3,
    ratio: "4 / 5",
  },
  {
    id: "falls",
    ...unsplash("1433086966358-54859d0ed716"),
    ox: 0.7,
    oy: -0.4,
    depth: 3.9,
    width: 0.3,
    ratio: "4 / 3",
  },
  {
    id: "valley",
    ...unsplash("1426604966848-d7adac402bff"),
    ox: -0.65,
    oy: -0.6,
    depth: 4.2,
    width: 0.26,
    ratio: "1 / 1",
  },
  {
    id: "road",
    ...unsplash("1447752875215-b2761acb3c5d"),
    ox: 0.75,
    oy: 0.45,
    depth: 4.5,
    width: 0.28,
    ratio: "3 / 4",
  },
  {
    id: "light",
    ...unsplash("1500382017468-9049fed747ef"),
    ox: -0.1,
    oy: 0.65,
    depth: 4.7,
    width: 0.3,
    ratio: "4 / 3",
  },
];
