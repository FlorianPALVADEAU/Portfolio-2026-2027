import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HeroSection } from "./hero-section";

const messages = {
  badge: "Open to positions",
  role: "Full-stack software engineer",
  tagline: "I build web applications.",
  cta: "Get in touch",
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
});
