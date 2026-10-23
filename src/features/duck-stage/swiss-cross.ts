import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from "three";

export const SWISS_RED = "#d52b1e";

/** The Swiss flag as a texture: a white, equal-armed cross on red, with the proportions of the flag. */
export function swissCrossTexture(): CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (context) {
    context.fillStyle = SWISS_RED;
    context.fillRect(0, 0, size, size);
    context.fillStyle = "#ffffff";
    const arm = size * 0.2;
    const length = size * 0.6;
    context.fillRect((size - arm) / 2, (size - length) / 2, arm, length);
    context.fillRect((size - length) / 2, (size - arm) / 2, length, arm);
  }
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

/** Speckled grey noise used as a bump map, so the feathers read as soft felt rather than plastic. */
export function feltTexture(): CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (context) {
    context.fillStyle = "#808080";
    context.fillRect(0, 0, size, size);
    for (let index = 0; index < 9000; index++) {
      const shade = 90 + Math.floor(Math.random() * 90);
      context.fillStyle = `rgb(${shade} ${shade} ${shade})`;
      context.fillRect(Math.random() * size, Math.random() * size, 2, 2);
    }
  }
  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}
