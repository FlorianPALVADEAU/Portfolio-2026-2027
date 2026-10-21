import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import en from "../../../../messages/en.json";
import { ContactDetails } from "./contact-details";

const messages = en.home.contact.details;
const setup = (phone?: string) =>
  render(<ContactDetails locale="en" messages={messages} timeZone="Europe/Zurich" phone={phone} />);

describe("ContactDetails", () => {
  it("shows the city on a lazy, titled map", () => {
    setup();

    const map = screen.getByTitle(messages.map);
    expect(map).toHaveAttribute("src", expect.stringContaining("openstreetmap.org"));
    expect(map).toHaveAttribute("loading", "lazy");
  });

  it("leaves the phone out when none is given", () => {
    setup();

    expect(screen.queryByText(messages.phone)).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("links the phone number in its dialled form", () => {
    setup("+33 6 12 34 56 78");

    expect(screen.getByRole("link", { name: "+33 6 12 34 56 78" })).toHaveAttribute(
      "href",
      "tel:+33612345678",
    );
  });
});
