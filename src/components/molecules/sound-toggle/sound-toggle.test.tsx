import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { SoundToggle } from "./sound-toggle";

describe("SoundToggle", () => {
  it("starts muted and toggles on click", async () => {
    render(<SoundToggle onLabel="Sound: on" offLabel="Sound: off" />);

    await userEvent.click(screen.getByRole("button", { name: "Sound: off" }));

    expect(screen.getByRole("button", { name: "Sound: on" })).toBeVisible();
  });
});
