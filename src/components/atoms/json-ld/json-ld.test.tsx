import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { JsonLd } from "./json-ld";

describe("JsonLd", () => {
  it("renders a ld+json script and escapes angle brackets", () => {
    const { container } = render(<JsonLd data={{ name: "</script><b>" }} />);
    const script = container.querySelector('script[type="application/ld+json"]');

    expect(script?.innerHTML).not.toContain("<");
    expect(JSON.parse(script?.innerHTML ?? "")).toEqual({ name: "</script><b>" });
  });
});
