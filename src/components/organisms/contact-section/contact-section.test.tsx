import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import en from "../../../../messages/en.json";
import { ContactSection } from "./contact-section";

describe("ContactSection", () => {
  it("links the approved profiles in a new tab and exposes the slot", () => {
    render(
      <ContactSection
        index={6}
        title="Contact"
        messages={en.home.contact}
        form={<p>form slot</p>}
      />,
    );

    const github = screen.getByRole("link", { name: /GitHub/ });
    expect(github).toHaveAttribute("href", "https://github.com/FlorianPALVADEAU");
    expect(github).toHaveAttribute("target", "_blank");
    expect(github).toHaveAttribute("rel", expect.stringContaining("noopener"));
    expect(screen.getByRole("link", { name: /LinkedIn/ })).toBeInTheDocument();
    expect(screen.getByText("form slot")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Contact" })).toHaveAttribute("id", "contact");
  });

  it("lists the CV after the profiles as a download, and nothing without the file", () => {
    const cv = { label: "Download CV (PDF)", href: "/cv/en/Florian_PALVADEAU_CV.pdf" };
    const { rerender } = render(
      <ContactSection index={6} title="Contact" messages={en.home.contact} cv={cv} />,
    );

    const links = within(screen.getByRole("list", { name: en.home.contact.profiles })).getAllByRole(
      "link",
    );
    expect(links.map((link) => link.textContent)).toEqual([
      expect.stringContaining("GitHub"),
      expect.stringContaining("LinkedIn"),
      expect.stringContaining("Download CV (PDF)"),
    ]);
    const download = screen.getByRole("link", { name: "Download CV (PDF)" });
    expect(download).toHaveAttribute("download");
    expect(download).not.toHaveAttribute("target");

    rerender(
      <ContactSection
        index={6}
        title="Contact"
        messages={en.home.contact}
        cv={{ ...cv, href: null }}
      />,
    );
    expect(screen.queryByRole("link", { name: "Download CV (PDF)" })).not.toBeInTheDocument();
  });

  it("ends the index with a mail link when an address is given", () => {
    render(
      <ContactSection
        index={6}
        title="Contact"
        messages={en.home.contact}
        cv={{ label: "Download CV (PDF)", href: "/cv/en/Florian_PALVADEAU_CV.pdf" }}
        email="owner@example.test"
      />,
    );

    const links = within(screen.getByRole("list", { name: en.home.contact.profiles })).getAllByRole(
      "link",
    );
    const mail = links.at(-1);
    expect(mail).toHaveAttribute("href", "mailto:owner@example.test");
    expect(mail).not.toHaveAttribute("target");
    expect(mail).toHaveTextContent("(04)Write me an email");
  });

  it("sits on paper, so a dark page turns light here", () => {
    render(<ContactSection index={6} title="Contact" messages={en.home.contact} />);

    expect(screen.getByRole("region", { name: "Contact" })).toHaveAttribute("data-paper");
  });

  it("publishes no email address or phone number", () => {
    const { container } = render(
      <ContactSection index={6} title="Contact" messages={en.home.contact} />,
    );

    expect(container.innerHTML).not.toMatch(/@[\w-]+\.\w+|mailto:|tel:/);
  });
});
