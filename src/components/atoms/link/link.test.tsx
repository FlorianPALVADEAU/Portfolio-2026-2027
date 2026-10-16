import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Link } from "./link";

describe("Link", () => {
  it("renders an internal link without target", () => {
    render(<Link href="/projects">Projects</Link>);

    expect(screen.getByRole("link", { name: "Projects" })).not.toHaveAttribute("target");
  });

  it("opens external links in a new tab with safe rel values", () => {
    render(
      <Link href="https://github.com" external>
        GitHub
      </Link>,
    );

    const link = screen.getByRole("link", { name: "GitHub" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
