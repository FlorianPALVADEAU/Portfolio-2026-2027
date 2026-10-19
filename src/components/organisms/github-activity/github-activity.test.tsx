import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import en from "../../../../messages/en.json";
import { GithubActivity } from "./github-activity";

const messages = en.home.contact.github;

// 2026-10-18 is a Sunday, 2026-10-21 a Wednesday.
const activity = {
  total: 1234,
  weeks: [
    [
      { date: "2026-10-18", count: 0, level: 0 as const },
      { date: "2026-10-21", count: 9, level: 4 as const },
    ],
  ],
};

describe("GithubActivity", () => {
  it("renders nothing when GitHub could not be read", () => {
    const { container } = render(
      <GithubActivity locale="en" messages={messages} activity={null} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("states the total in the page language", () => {
    render(<GithubActivity locale="de" messages={messages} activity={activity} />);

    expect(screen.getByText("1.234")).toBeInTheDocument();
    expect(screen.getByText(messages.total)).toBeInTheDocument();
  });

  it("hides the graph from assistive technology and places each day on its weekday", () => {
    const { container } = render(
      <GithubActivity locale="en" messages={messages} activity={activity} />,
    );

    const graph = container.querySelector('[aria-hidden="true"]');
    expect(graph).not.toBeNull();
    const cells = [...container.querySelectorAll<HTMLElement>("[title]")];
    expect(cells.map((cell) => cell.style.gridRow)).toEqual(["1", "4"]);
    expect(cells[1]).toHaveClass("bg-accent");
    expect(cells[1]).toHaveAttribute("title", "2026-10-21: 9");
  });
});
