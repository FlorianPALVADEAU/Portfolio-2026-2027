import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LinksBlock } from "./links-block";

describe("LinksBlock", () => {
  it("renders translated external links", () => {
    render(
      <LinksBlock
        title="Links"
        items={[{ id: "source", href: "https://example.com" }]}
        labels={{ source: "Source code" }}
      />,
    );

    const link = screen.getByRole("link", { name: "Source code" });
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
