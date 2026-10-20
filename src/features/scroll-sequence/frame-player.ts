import type { FrameSet } from "@/lib/landing";

export type FramePlayer = {
  /** Draws the frame matching `progress`, from 0 (first) to 1 (last). */
  show: (progress: number) => void;
  destroy: () => void;
};

/** Fills the canvas with the image the way `object-fit: cover` would. */
function paintCover(context: CanvasRenderingContext2D, image: HTMLImageElement) {
  const { width, height } = context.canvas;
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
  const drawnWidth = image.naturalWidth * scale;
  const drawnHeight = image.naturalHeight * scale;
  context.drawImage(
    image,
    (width - drawnWidth) / 2,
    (height - drawnHeight) / 2,
    drawnWidth,
    drawnHeight,
  );
}

/** Frames requested at once; enough to fill the connection without starving the first ones. */
const CONCURRENCY = 6;
const STRIDES = [16, 4, 1];

/** Frame indexes ordered coarse to fine, so the whole length can be scrubbed after a few loads. */
function loadOrder(count: number) {
  const order: number[] = [];
  const queued = new Set<number>();
  for (const stride of STRIDES) {
    for (let index = 0; index < count; index += stride) {
      if (!queued.has(index)) {
        queued.add(index);
        order.push(index);
      }
    }
    if (!queued.has(count - 1)) {
      queued.add(count - 1);
      order.push(count - 1);
    }
  }
  return order;
}

/**
 * Loads the frames coarse to fine and draws the nearest one already decoded, so a slow connection
 * or a fast scroll over frames still in flight shows an earlier picture instead of a blank canvas.
 */
export function createFramePlayer(canvas: HTMLCanvasElement, set: FrameSet): FramePlayer {
  const context = canvas.getContext("2d");
  let progress = 0;
  let destroyed = false;

  const images: (HTMLImageElement | undefined)[] = Array.from({ length: set.count });
  const pending = loadOrder(set.count);

  function loadNext() {
    const index = pending.shift();
    if (destroyed || index === undefined) return;
    const image = new Image();
    image.decoding = "async";
    image.onload = () => {
      draw();
      loadNext();
    };
    image.onerror = loadNext;
    image.src = `${set.directory}/${String(index).padStart(4, "0")}.webp`;
    images[index] = image;
  }

  function draw() {
    if (!context) return;
    for (let index = Math.round(progress * (set.count - 1)); index >= 0; index--) {
      const image = images[index];
      if (image?.complete && image.naturalWidth > 0) {
        paintCover(context, image);
        return;
      }
    }
  }

  function fit() {
    const ratio = Math.min(window.devicePixelRatio, 2);
    canvas.width = Math.round(canvas.clientWidth * ratio);
    canvas.height = Math.round(canvas.clientHeight * ratio);
    draw();
  }

  const observer = new ResizeObserver(fit);
  observer.observe(canvas);
  for (let slot = 0; slot < CONCURRENCY; slot++) loadNext();

  return {
    show(next) {
      progress = next;
      draw();
    },
    destroy() {
      destroyed = true;
      observer.disconnect();
    },
  };
}
