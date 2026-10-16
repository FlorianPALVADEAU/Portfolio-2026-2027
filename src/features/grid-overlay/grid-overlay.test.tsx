import { act, fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GridOverlay } from "./grid-overlay";

const toggle = () => act(() => void fireEvent.keyDown(window, { altKey: true, code: "KeyG" }));

describe("GridOverlay", () => {
  it("is hidden until Alt+G is pressed and toggles off again", () => {
    const { container } = render(<GridOverlay />);
    expect(container).toBeEmptyDOMElement();

    toggle();
    expect(container.querySelectorAll("[aria-hidden='true'] .grid-12 > div")).toHaveLength(12);

    toggle();
    expect(container).toBeEmptyDOMElement();
  });
});
