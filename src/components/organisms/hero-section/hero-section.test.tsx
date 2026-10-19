import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HeroSection } from "./hero-section";

const messages = {
  badge: "Open to positions",
  role: "Full-stack software engineer",
  tagline: "I build web applications.",
  cta: "Get in touch",
  cv: "Download CV (PDF)",
  scroll: "Scroll",
  portraitAlt: "Portrait of Florian",
};

describe("HeroSection", () => {
  it("exposes the name as the only h1 and the portrait with alt text", () => {
    render(<HeroSection locale="en" messages={messages} />);

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("img", { name: "Portrait of Florian" })).toBeVisible();
  });

  it("lists the stack and links the call to action to the contact section", () => {
    render(<HeroSection locale="de" messages={messages} />);

    expect(screen.getByText("Kubernetes")).toBeVisible();
    expect(screen.getByRole("link", { name: "Get in touch" })).toHaveAttribute(
      "href",
      "/de#contact",
    );
  });

  it("offers the CV only when a file exists for the language", () => {
    const { rerender } = render(<HeroSection locale="en" messages={messages} />);
    expect(screen.queryByRole("link", { name: "Download CV (PDF)" })).not.toBeInTheDocument();

    rerender(<HeroSection locale="en" messages={messages} cvHref="/cv/cv-en.pdf" />);
    const link = screen.getByRole("link", { name: "Download CV (PDF)" });
    expect(link).toHaveAttribute("href", "/cv/cv-en.pdf");
    expect(link).toHaveAttribute("download");
  });
});
