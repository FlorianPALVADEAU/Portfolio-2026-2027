import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import en from "../../../../messages/en.json";
import { StatusPage } from "./status-page";

describe("StatusPage", () => {
  it("names the problem and leads back to the home page and the work", () => {
    render(<StatusPage locale="en" code="404" copy={en.status.notFound} labels={en.status} />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      `${en.status.notFound.lead} ${en.status.notFound.accent}`,
    );
    expect(screen.getByRole("link", { name: en.status.home })).toHaveAttribute("href", "/en");
    expect(screen.getByRole("link", { name: en.status.work })).toHaveAttribute("href", "/en#works");
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("offers a retry on errors, with the home page as the way out", () => {
    const retry = vi.fn();
    render(
      <StatusPage locale="de" code="Err" copy={en.status.error} labels={en.status} retry={retry} />,
    );

    screen.getByRole("button", { name: en.status.retry }).click();
    expect(retry).toHaveBeenCalledOnce();
    expect(screen.getByRole("link", { name: en.status.home })).toHaveAttribute("href", "/de");
  });
});
