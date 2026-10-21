import { describe, expect, it } from "vitest";
import { galleryItems } from "@/lib/landing";
import { hasPassed, pose, smoothstep, TRAVEL, wordReveal } from "./zoom-pose";

describe("wordReveal", () => {
  it("shows nothing before the reveal and everything after it", () => {
    expect(wordReveal(0, 10, 0)).toBe(0);
    expect(wordReveal(9, 10, 1)).toBe(1);
    expect(wordReveal(0, 10, 1)).toBe(1);
  });

  it("brings words in reading order, overlapping", () => {
    const at = (index: number) => wordReveal(index, 10, 0.4);
    expect(at(0)).toBeGreaterThan(at(4));
    expect(at(4)).toBeGreaterThan(at(9));
    expect(at(3)).toBeGreaterThan(0);
    expect(at(3)).toBeLessThan(1);
  });

  it("handles a single word", () => {
    expect(wordReveal(0, 1, 1)).toBe(1);
  });
});

const half = { x: 600, y: 400 };
const still = { x: 0, y: 0 };

function item(id: string) {
  const found = galleryItems.find((candidate) => candidate.id === id);
  if (!found) throw new Error(`No gallery item ${id}`);
  return found;
}

describe("smoothstep", () => {
  it("eases between the bounds, in either direction", () => {
    expect(smoothstep(0, 1, -1)).toBe(0);
    expect(smoothstep(0, 1, 0.5)).toBe(0.5);
    expect(smoothstep(0, 1, 2)).toBe(1);
    expect(smoothstep(2.6, 2, 2.8)).toBe(0);
    expect(smoothstep(2.6, 2, 1)).toBe(1);
  });
});

describe("pose", () => {
  it("shows the opening photos and hides the ones still in the distance", () => {
    expect(pose(item("peak"), 0, half, still).opacity).toBeGreaterThan(0.9);
    expect(pose(item("ridge"), 0, half, still).opacity).toBe(0);
  });

  it("brings a far photo into view and past the frame as the visitor goes on", () => {
    const ridge = item("ridge");
    const mid = pose(ridge, 0.3, half, still);
    expect(mid.opacity).toBeGreaterThan(0.9);
    expect(mid.scale).toBeGreaterThan(pose(ridge, 0.1, half, still).scale);
    expect(pose(ridge, (ridge.depth - 0.2) / TRAVEL, half, still).opacity).toBe(0);
  });

  it("blurs and fades a photo more the closer it gets to leaving the frame", () => {
    const peak = item("peak");
    const early = pose(peak, 0, half, still);
    const late = pose(peak, 0.1, half, still);
    expect(early.blur).toBe(0);
    expect(late.blur).toBeGreaterThan(early.blur);
    expect(late.opacity).toBeLessThan(early.opacity);
  });

  it("shifts near photos further than distant ones with the pointer", () => {
    const right = { x: 1, y: 0 };
    const shift = (id: string) =>
      pose(item(id), 0, half, right).x - pose(item(id), 0, half, still).x;
    expect(Math.abs(shift("peak"))).toBeGreaterThan(Math.abs(shift("ocean")));
  });

  it("leaves no photo on screen by the time the closing text appears", () => {
    for (const { id } of galleryItems) {
      expect(pose(item(id), 0.85, half, still).opacity, id).toBe(0);
    }
  });
});

describe("hasPassed", () => {
  const item = { ox: 0, oy: 0, depth: 2 };

  it("flips once the viewer has come level with the item, in both directions", () => {
    expect(hasPassed(item, 0)).toBe(false);
    expect(hasPassed(item, 2 / TRAVEL)).toBe(true);
    expect(hasPassed(item, 1 / TRAVEL)).toBe(false);
  });
});
