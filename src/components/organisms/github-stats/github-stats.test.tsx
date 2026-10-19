import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import en from "../../../../messages/en.json";
import { GithubStats } from "./github-stats";

const messages = en.home.contact.github;

describe("GithubStats", () => {
  it("renders nothing when GitHub could not be reached", () => {
    const { container } = render(<GithubStats locale="en" messages={messages} stats={null} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("lists the figures as a definition list, formatted for the language", () => {
    render(
      <GithubStats
        locale="en"
        messages={messages}
        stats={{ repositories: 12, stars: 1200, lastPush: "2026-09-12T08:30:00Z" }}
      />,
    );

    expect(screen.getByText(messages.repositories).closest("div")).toHaveTextContent("12");
    expect(screen.getByText(messages.stars).closest("div")).toHaveTextContent("1,200");
    expect(screen.getByText(messages.lastPush).closest("div")).toHaveTextContent("September 2026");
  });

  it("leaves out figures that are zero or missing", () => {
    render(
      <GithubStats
        locale="en"
        messages={messages}
        stats={{ repositories: 4, stars: 0, lastPush: null }}
      />,
    );

    expect(screen.getByText(messages.repositories)).toBeInTheDocument();
    expect(screen.queryByText(messages.stars)).not.toBeInTheDocument();
    expect(screen.queryByText(messages.lastPush)).not.toBeInTheDocument();
  });

  it("renders nothing when every figure is empty", () => {
    const { container } = render(
      <GithubStats
        locale="en"
        messages={messages}
        stats={{ repositories: 0, stars: 0, lastPush: null }}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
