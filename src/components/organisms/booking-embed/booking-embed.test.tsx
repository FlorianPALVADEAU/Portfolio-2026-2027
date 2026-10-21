import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import en from "../../../../messages/en.json";
import { BookingEmbed } from "./booking-embed";

const messages = en.home.contact.booking;
const url = "https://calendly.com/someone/intro";

describe("BookingEmbed", () => {
  it("renders nothing without a booking URL", () => {
    const { container } = render(<BookingEmbed messages={messages} url={undefined} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("embeds the calendar at once in a titled, lazy frame", () => {
    render(<BookingEmbed messages={messages} url={url} />);

    const frame = screen.getByTitle(messages.frame);
    expect(frame).toHaveAttribute("src", expect.stringContaining(url));
    expect(frame.getAttribute("src")).toContain("embed_type=Inline");
    expect(frame.getAttribute("src")).toContain("hide_gdpr_banner=1");
    expect(frame).toHaveAttribute("loading", "lazy");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
