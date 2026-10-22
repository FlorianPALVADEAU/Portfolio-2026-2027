import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { SoundToggle } from "./sound-toggle";

describe("SoundToggle", () => {
  it("starts muted and reports its pressed state while the name stays put", async () => {
    render(<SoundToggle label="Sound" />);
    const toggle = screen.getByRole("button", { name: "Sound" });
    expect(toggle).toHaveAttribute("aria-pressed", "false");

    await userEvent.click(toggle);

    expect(screen.getByRole("button", { name: "Sound" })).toHaveAttribute("aria-pressed", "true");
  });
});
