import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProjectDetail } from "./project-detail";

const project = {
  title: "Demo",
  summary: "A summary",
  role: "Developer",
  year: 2026,
  cover: { src: "/cover.png", width: 1600, height: 900, alt: "Cover" },
  blocks: [
    { id: "a", type: "text", title: "Overview", paragraphs: ["Hello"] },
    { id: "s", type: "stack", title: "Stack", items: ["Next.js", "Stripe"] },
    {
      id: "l",
      type: "links",
      title: "Links",
      items: [{ id: "site", href: "https://example.com" }],
      labels: { site: "Launch project" },
    },
  ],
} as const;

const playerLabels = {
  play: "Play video",
  pause: "Pause video",
  mute: "Mute",
  unmute: "Unmute",
  fullscreen: "Full screen",
  exitFullscreen: "Exit full screen",
  seek: "Position in the video",
  loading: "Loading",
};

const messages = {
  back: "Back to home",
  role: "Role",
  year: "Year",
  story: "Project story",
  next: "Next project",
  contact: "Let's work together",
  cv: "Download CV (PDF)",
};

describe("ProjectDetail", () => {
  it("has a single h1, facts, a back link and the blocks", () => {
    render(
      <ProjectDetail
        locale="en"
        messages={messages}
        playerLabels={playerLabels}
        next={{ slug: "another", title: "Another project" }}
        cvHref="/cv/cv-en.pdf"
        project={project}
      />,
    );

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByText("Role")).toBeVisible();
    expect(screen.getByText("Developer")).toBeVisible();
    expect(screen.getByText("2026")).toBeVisible();
    expect(screen.getByRole("link", { name: "Back to home" })).toHaveAttribute("href", "/en#works");
    expect(screen.getByRole("heading", { level: 2, name: "Overview" })).toBeVisible();
  });

  it("lifts the stack and the links into the intro instead of repeating them as panels", () => {
    render(
      <ProjectDetail
        locale="en"
        messages={messages}
        playerLabels={playerLabels}
        next={{ slug: "another", title: "Another project" }}
        cvHref="/cv/cv-en.pdf"
        project={project}
      />,
    );

    expect(screen.getByText("Next.js · Stripe")).toBeVisible();
    expect(screen.getByRole("link", { name: "Launch project" })).toHaveAttribute(
      "href",
      "https://example.com",
    );
    expect(screen.queryByRole("heading", { name: "Links" })).toBeNull();
    expect(document.querySelectorAll("[data-story-panel]")).toHaveLength(4);
  });

  it("ends on where to go next: the next project, the contact section and the CV", () => {
    render(
      <ProjectDetail
        locale="en"
        messages={messages}
        playerLabels={playerLabels}
        next={{ slug: "another", title: "Another project" }}
        cvHref="/cv/cv-en.pdf"
        project={project}
      />,
    );

    expect(screen.getByRole("link", { name: "Another project" })).toHaveAttribute(
      "href",
      "/en/projects/another",
    );
    expect(screen.getByRole("link", { name: "Let's work together" })).toHaveAttribute(
      "href",
      "/en#contact",
    );
    expect(screen.getByRole("link", { name: "Download CV (PDF)" })).toHaveAttribute(
      "href",
      "/cv/cv-en.pdf",
    );
  });

  it("leaves out the next project and the CV when there is none", () => {
    render(
      <ProjectDetail
        locale="en"
        messages={messages}
        playerLabels={playerLabels}
        next={null}
        cvHref={null}
        project={project}
      />,
    );

    expect(screen.queryByText("Next project")).toBeNull();
    expect(screen.queryByRole("link", { name: "Download CV (PDF)" })).toBeNull();
    expect(screen.getByRole("link", { name: "Let's work together" })).toBeVisible();
  });

  it("shows the teaser as a picture, or as a player that opens on it", () => {
    const poster = { src: "/poster.jpg", width: 1600, height: 900 };
    const { rerender } = render(
      <ProjectDetail
        locale="en"
        messages={messages}
        playerLabels={playerLabels}
        next={null}
        cvHref={null}
        project={{ ...project, teaser: { poster, label: "Race day" } }}
      />,
    );
    expect(screen.getByRole("img", { name: "Race day" })).toBeVisible();

    rerender(
      <ProjectDetail
        locale="en"
        messages={messages}
        playerLabels={playerLabels}
        next={null}
        cvHref={null}
        project={{ ...project, teaser: { poster, video: "/race.mp4", label: "Race day" } }}
      />,
    );
    expect(screen.getByRole("group", { name: "Race day" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Play video" })).toBeVisible();
  });
});
