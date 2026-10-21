import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CreditsDialog } from "./credits-dialog";

describe("CreditsDialog", () => {
  it("opens the modal from the trigger and closes it from the close button", () => {
    const showModal = vi.fn();
    const close = vi.fn();
    HTMLDialogElement.prototype.showModal = showModal;
    HTMLDialogElement.prototype.close = close;
    render(
      <CreditsDialog triggerLabel="Credits" title="Credits of the site" closeLabel="Close">
        <p>Geist</p>
      </CreditsDialog>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Credits" }));
    expect(showModal).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole("button", { name: "Close", hidden: true }));
    expect(close).toHaveBeenCalledTimes(1);
  });
});
