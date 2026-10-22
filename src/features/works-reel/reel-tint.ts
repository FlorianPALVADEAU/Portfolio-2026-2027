/**
 * The page background as sRGB channels from 0 to 1. A 1px canvas does the parsing, because the
 * computed style may come back in a colour space (oklch) that WebGL cannot read directly.
 */
export function pageBackground(): [number, number, number] {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const context = canvas.getContext("2d");
  if (!context) return [0, 0, 0];
  context.fillStyle = getComputedStyle(document.body).backgroundColor;
  context.fillRect(0, 0, 1, 1);
  const [red = 0, green = 0, blue = 0] = context.getImageData(0, 0, 1, 1).data;
  return [red / 255, green / 255, blue / 255];
}
