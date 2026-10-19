import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HeroSection } from "./hero-section";

const messages = {
  badge: "Open to positions",
  role: "Full-stack software engineer",
  headline: "From Geneva, I build software that holds.",
  cv: "Download CV (PDF)",
  scroll: "Scroll",
};

describe("HeroSection", () => {
  it("exposes one h1 that carries the owner's name and the headline", () => {
    render(<HeroSection messages={messages} />);

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Florian Palvadeau. From Geneva, I build software that holds.",
      }),
    ).toBeInTheDocument();
  });

  it("shows the role and the availability", () => {
    render(<HeroSection messages={messages} />);

    expect(screen.getByText("Full-stack software engineer")).toBeInTheDocument();
    expect(screen.getByText("Open to positions")).toBeInTheDocument();
  });

  it("offers the CV only when a file exists for the language", () => {
    const { rerender } = render(<HeroSection messages={messages} />);
    expect(screen.queryByRole("link", { name: "Download CV (PDF)" })).not.toBeInTheDocument();

    rerender(<HeroSection messages={messages} cvHref="/cv/cv-en.pdf" />);
    const link = screen.getByRole("link", { name: "Download CV (PDF)" });
    expect(link).toHaveAttribute("href", "/cv/cv-en.pdf");
    expect(link).toHaveAttribute("download");
  });

  it("scatters decorative photos into the slots and ignores the surplus", () => {
    const photos = ["/a.jpg", "/b.jpg", "/c.jpg", "/d.jpg", "/e.jpg"];
    const { container } = render(<HeroSection messages={messages} photos={photos} />);

    const pictures = container.querySelectorAll("img");
    expect(pictures).toHaveLength(4);
    for (const picture of pictures) expect(picture).toHaveAttribute("alt", "");
  });

  it("renders no photo when none was added", () => {
    const { container } = render(<HeroSection messages={messages} />);

    expect(container.querySelectorAll("img")).toHaveLength(0);
  });
});
