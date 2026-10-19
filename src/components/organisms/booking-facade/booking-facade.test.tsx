import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import en from "../../../../messages/en.json";
import { BookingFacade } from "./booking-facade";

const messages = en.home.contact.booking;
const url = "https://calendly.com/someone/intro";

describe("BookingFacade", () => {
  it("renders nothing without a booking URL", () => {
    const { container } = render(<BookingFacade messages={messages} url={undefined} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("shows a button and loads nothing from Calendly until it is clicked", () => {
    const { container } = render(<BookingFacade messages={messages} url={url} />);

    expect(screen.getByRole("button", { name: messages.action })).toBeInTheDocument();
    expect(container.querySelector("iframe")).toBeNull();
  });

  it("embeds the calendar in a titled frame after the click and moves focus to it", async () => {
    render(<BookingFacade messages={messages} url={url} />);

    await userEvent.click(screen.getByRole("button", { name: messages.action }));

    const frame = screen.getByTitle(messages.frame);
    expect(frame).toHaveAttribute("src", expect.stringContaining(url));
    expect(frame.getAttribute("src")).toContain("embed_type=Inline");
    expect(frame).toHaveFocus();
    expect(screen.queryByRole("button", { name: messages.action })).not.toBeInTheDocument();
  });
});
