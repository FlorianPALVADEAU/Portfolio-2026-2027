import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ErrorPage } from "./error-page";

const params = vi.hoisted(() => ({ locale: "de" as string | undefined }));
vi.mock("next/navigation", () => ({ useParams: () => params }));

describe("ErrorPage", () => {
  it("speaks the language of the URL and retries on request", async () => {
    params.locale = "de";
    const retry = vi.fn();
    render(<ErrorPage retry={retry} />);

    expect(
      await screen.findByRole("heading", { level: 1, name: "Etwas ist schiefgelaufen" }),
    ).toBeVisible();
    screen.getByRole("button", { name: "Erneut versuchen" }).click();
    expect(retry).toHaveBeenCalledOnce();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/de");
  });

  it("falls back to English when the URL carries no language", async () => {
    params.locale = undefined;
    render(<ErrorPage retry={() => {}} />);

    expect(await screen.findByRole("link", { name: "Back to the home page" })).toHaveAttribute(
      "href",
      "/en",
    );
  });
});
