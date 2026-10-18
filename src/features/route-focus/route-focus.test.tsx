import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { RouteFocus } from "./route-focus";

let pathname = "/en";
vi.mock("next/navigation", () => ({ usePathname: () => pathname }));

describe("RouteFocus", () => {
  it("focuses main after the path changes, not on first render", () => {
    document.body.innerHTML = '<main id="main" tabindex="-1"></main>';
    const main = document.getElementById("main");

    const { rerender } = render(<RouteFocus />);
    expect(main).not.toHaveFocus();

    pathname = "/fr";
    rerender(<RouteFocus />);
    expect(main).toHaveFocus();
  });
});
