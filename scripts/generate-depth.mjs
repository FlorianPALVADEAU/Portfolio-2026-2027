// Offline depth map generator for project covers, run by hand when a cover changes.
//   npm install --no-save @huggingface/transformers
//   node scripts/generate-depth.mjs public/projects/overbound/cover.png
// Writes depth.webp beside the cover: grayscale, white is near, 512 px wide, lightly blurred so
// depth edges slide rather than tear. Then add `depth: "<path>"` to the project's cover.
import { dirname, join } from "node:path";
import { pipeline } from "@huggingface/transformers";
import sharp from "sharp";

const WIDTH = 512;
const SOFTEN = 1.5;

const sources = process.argv.slice(2);
if (sources.length === 0) {
  process.stderr.write("usage: node scripts/generate-depth.mjs <cover> [<cover>...]\n");
  process.exit(1);
}

const estimate = await pipeline("depth-estimation", "onnx-community/depth-anything-v2-small");

for (const source of sources) {
  const { depth } = await estimate(source);
  const target = join(dirname(source), "depth.webp");
  const { width, height } = await sharp(source).metadata();
  await sharp(depth.data, { raw: { width: depth.width, height: depth.height, channels: 1 } })
    .resize(WIDTH, Math.round((WIDTH * height) / width))
    .normalise()
    .blur(SOFTEN)
    .webp({ quality: 80 })
    .toFile(target);
  process.stdout.write(`${source} -> ${target}\n`);
}
