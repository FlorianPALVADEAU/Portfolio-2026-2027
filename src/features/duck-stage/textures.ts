import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from "three";

function drawing(
  size: number,
  paint: (context: CanvasRenderingContext2D) => void,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (context) paint(context);
  return canvas;
}

/** A tiny fish, nose to the right, drawn at the origin. */
function fish(context: CanvasRenderingContext2D, color: string) {
  context.scale(1.9, 1.9);
  context.fillStyle = color;
  context.beginPath();
  context.ellipse(0, 0, 15, 8, 0, 0, Math.PI * 2);
  context.fill();
  context.beginPath();
  context.moveTo(-12, 0);
  context.lineTo(-24, -9);
  context.lineTo(-24, 9);
  context.closePath();
  context.fill();
}

/** A loud print for the bow tie: mustard, with a shoal of pink and teal fish and white polka dots. */
export function bowTieTexture(): CanvasTexture {
  const canvas = drawing(256, (context) => {
    context.fillStyle = "#f2b705";
    context.fillRect(0, 0, 256, 256);
    context.fillStyle = "#ffffff";
    for (const [x, y] of [
      [30, 40],
      [140, 24],
      [220, 90],
      [70, 130],
      [180, 170],
      [20, 220],
      [120, 232],
    ] as const) {
      context.beginPath();
      context.arc(x, y, 11, 0, Math.PI * 2);
      context.fill();
    }
    const shoal = [
      [64, 80, 0.3, "#e8337a"],
      [180, 56, -0.4, "#0f8b8d"],
      [120, 130, 0.1, "#0f8b8d"],
      [210, 140, 0.5, "#e8337a"],
      [50, 190, -0.2, "#e8337a"],
      [160, 214, 0.2, "#0f8b8d"],
    ] as const;
    for (const [x, y, angle, color] of shoal) {
      context.save();
      context.translate(x, y);
      context.rotate(angle);
      fish(context, color);
      context.restore();
    }
  });
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

/** Speckled grey noise used as a bump map, so the feathers read as soft felt rather than plastic. */
export function feltTexture(): CanvasTexture {
  const canvas = drawing(256, (context) => {
    context.fillStyle = "#808080";
    context.fillRect(0, 0, 256, 256);
    for (let index = 0; index < 9000; index++) {
      const shade = 90 + Math.floor(Math.random() * 90);
      context.fillStyle = `rgb(${shade} ${shade} ${shade})`;
      context.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
    }
  });
  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}
