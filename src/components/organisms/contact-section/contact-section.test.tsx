import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import en from "../../../../messages/en.json";
import { ContactSection } from "./contact-section";

describe("ContactSection", () => {
  it("links the approved profiles in a new tab and exposes the slot", () => {
    render(
      <ContactSection title="Contact" messages={en.home.contact} photo={en.home.photos.closing}>
        <p>form slot</p>
      </ContactSection>,
    );

    const github = screen.getByRole("link", { name: /GitHub/ });
    expect(github).toHaveAttribute("href", "https://github.com/FlorianPALVADEAU");
    expect(github).toHaveAttribute("target", "_blank");
    expect(github).toHaveAttribute("rel", expect.stringContaining("noopener"));
    expect(screen.getByRole("link", { name: /LinkedIn/ })).toBeInTheDocument();
    expect(screen.getByText("form slot")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Contact" })).toHaveAttribute("id", "contact");
  });

  it("publishes no email address or phone number", () => {
    const { container } = render(
      <ContactSection title="Contact" messages={en.home.contact} photo={en.home.photos.closing} />,
    );

    expect(container.innerHTML).not.toMatch(/@[\w-]+\.\w+|mailto:|tel:/);
  });
});
