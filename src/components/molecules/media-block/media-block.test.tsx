import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MediaBlock } from "./media-block";

describe("MediaBlock", () => {
  it("renders an image with alt text and a caption", () => {
    render(
      <MediaBlock
        image={{ src: "/shot.png", width: 800, height: 600 }}
        alt="Screenshot"
        caption="A caption"
      />,
    );

    expect(screen.getByRole("img", { name: "Screenshot" })).toBeVisible();
    expect(screen.getByText("A caption")).toBeVisible();
  });
});
