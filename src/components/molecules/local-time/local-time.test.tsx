import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LocalTime } from "./local-time";

describe("LocalTime", () => {
  afterEach(() => vi.useRealTimers());

  it("shows the clock of the given zone once mounted", () => {
    vi.useFakeTimers({ now: new Date("2027-01-15T11:30:00Z") });

    render(<LocalTime locale="en-GB" timeZone="Europe/Zurich" />);

    expect(screen.getByText("12:30")).toBeInTheDocument();
  });
});
