import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Marquee } from "./marquee";

const props = {
  items: [
    { id: "react", content: "React" },
    { id: "nest", content: "NestJS" },
  ],
  label: "Tech",
  pauseLabel: "Pause",
  playLabel: "Play",
};

function mockMotion(reduced: boolean) {
  window.matchMedia = vi.fn().mockReturnValue({
    matches: reduced,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }) as unknown as typeof window.matchMedia;
}

describe("Marquee", () => {
  it("is static, single and without a control under reduced motion", () => {
    mockMotion(true);
    render(<Marquee {...props} />);

    expect(screen.getAllByText("React")).toHaveLength(2);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Tech" })).toBeInTheDocument();
  });

  it("hides the loop copy from assistive technology and toggles playback", async () => {
    mockMotion(false);
    render(<Marquee {...props} />);

    expect(screen.getAllByRole("list")).toHaveLength(1);
    const button = screen.getByRole("button", { name: "Pause" });
    await userEvent.click(button);
    expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
  });
});
