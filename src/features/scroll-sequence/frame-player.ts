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

/**
 * Loads every frame at once and draws the nearest one already decoded, so a fast scroll over
 * frames still in flight shows an earlier picture instead of a blank canvas.
 */
export function createFramePlayer(canvas: HTMLCanvasElement, set: FrameSet): FramePlayer {
  const context = canvas.getContext("2d");
  let progress = 0;

  const images = Array.from({ length: set.count }, (_, index) => {
    const image = new Image();
    image.decoding = "async";
    image.src = `${set.directory}/${String(index).padStart(4, "0")}.webp`;
    return image;
  });

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
  for (const image of images) image.addEventListener("load", draw);

  return {
    show(next) {
      progress = next;
      draw();
    },
    destroy() {
      observer.disconnect();
      for (const image of images) image.removeEventListener("load", draw);
    },
  };
}
