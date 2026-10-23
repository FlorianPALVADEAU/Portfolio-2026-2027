import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import en from "../../../../messages/en.json";
import fr from "../../../../messages/fr.json";
import { NotFoundPage } from "./not-found-page";

describe("NotFoundPage", () => {
  it("offers every language, with one main heading and a way home in each", () => {
    render(
      <NotFoundPage
        entries={[
          { locale: "en", messages: en.status },
          { locale: "fr", messages: fr.status },
        ]}
      />,
    );

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("link", { name: en.status.home })).toHaveAttribute("href", "/en");
    expect(screen.getByRole("link", { name: fr.status.home })).toHaveAttribute("href", "/fr");
    expect(screen.getByText(fr.status.notFound.title).closest("section")).toHaveAttribute(
      "lang",
      "fr",
    );
  });
});
