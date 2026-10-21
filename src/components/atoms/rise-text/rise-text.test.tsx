import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RiseText } from "./rise-text";

describe("RiseText", () => {
  it("keeps the sentence readable and wraps every word for the script to move", () => {
    const { container } = render(<RiseText>Let's build something</RiseText>);

    expect(container).toHaveTextContent("Let's build something");
    expect(container.querySelectorAll("[data-rise-word]")).toHaveLength(3);
  });
});
