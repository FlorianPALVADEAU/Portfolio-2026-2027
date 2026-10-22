import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { type Block, BlockList } from "./block-list";

const blocks: Block[] = [
  { id: "a", type: "text", title: "First", paragraphs: ["Hello"] },
  { id: "b", type: "stack", title: "Stack", items: ["TypeScript"] },
  { id: "c", type: "results", title: "Results", items: [{ label: "Locales", value: "3" }] },
];

describe("BlockList", () => {
  it("renders blocks in the given order", () => {
    render(<BlockList blocks={blocks} />);

    const headings = screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent);
    expect(headings).toEqual(["First", "Stack", "Results"]);
  });

  it("keeps the blocks around a picture together and gives the picture its own panel", () => {
    const picture: Block = {
      id: "m",
      type: "media",
      image: { src: "/shot.png", width: 800, height: 600 },
      alt: "Screenshot",
    };
    const text: Block = { id: "t", type: "text", title: "Text", paragraphs: ["Hello"] };
    const results: Block = { id: "r", type: "results", title: "Results", items: [] };
    const { container } = render(<BlockList blocks={[text, results, picture, text]} />);

    const panels = Array.from(container.querySelectorAll("[data-story-panel]"));
    expect(panels).toHaveLength(3);
    expect(panels[0]?.querySelectorAll("h2")).toHaveLength(2);
    expect(panels[1]?.querySelector("img")).not.toBeNull();
  });
});
