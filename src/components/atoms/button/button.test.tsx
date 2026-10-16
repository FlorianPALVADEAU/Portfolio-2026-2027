import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./button";

describe("Button", () => {
  it("calls onClick and defaults to type button", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Send</Button>);

    await userEvent.click(screen.getByRole("button", { name: "Send" }));

    expect(onClick).toHaveBeenCalledOnce();
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("is disabled and busy while loading", async () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Send
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Send" });

    await userEvent.click(button);

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(onClick).not.toHaveBeenCalled();
  });

  it("applies button styles to its child with asChild", () => {
    render(
      <Button asChild>
        <a href="/contact">Contact</a>
      </Button>,
    );

    expect(screen.getByRole("link", { name: "Contact" })).toHaveClass("bg-accent");
  });

  it("is reachable and operable with the keyboard", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Send</Button>);

    await userEvent.tab();
    await userEvent.keyboard("{Enter}");

    expect(screen.getByRole("button")).toHaveFocus();
    expect(onClick).toHaveBeenCalledOnce();
  });
});
