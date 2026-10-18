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
});
