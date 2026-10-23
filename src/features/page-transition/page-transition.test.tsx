import { fireEvent, render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockMatchMedia } from "@/test/match-media";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }), usePathname: () => "/en" }));

const to = vi.fn((_: unknown, vars: { onComplete?: () => void }) => vars.onComplete?.());
vi.mock("gsap", () => ({ gsap: { to, fromTo: vi.fn(), set: vi.fn(), killTweensOf: vi.fn() } }));

let reduced = false;

beforeEach(() => {
  reduced = false;
  vi.clearAllMocks();
  mockMatchMedia(() => reduced);
});

async function mount() {
  const { PageTransition } = await import("./page-transition");
  const view = render(
    <>
      <a href="/fr">French</a>
      <a href="#contact">Anchor</a>
      <PageTransition />
    </>,
  );
  return view;
}

describe("PageTransition", () => {
  it("covers the page, then navigates with the router", async () => {
    const { getByText } = await mount();

    fireEvent.click(getByText("French"));

    expect(to).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith("/fr", { scroll: true });
  });

  it("navigates without covering a link that brings its own transition", async () => {
    const { getByText } = await mount();
    getByText("French").setAttribute("data-no-cover", "");
    getByText("French").setAttribute("data-keep-scroll", "");

    fireEvent.click(getByText("French"));

    expect(to).not.toHaveBeenCalled();
    expect(push).toHaveBeenCalledWith("/fr", { scroll: false });
  });

  it("leaves a link that plays its own transition alone", async () => {
    const { getByText } = await mount();
    getByText("French").setAttribute("data-own-transition", "");

    fireEvent.click(getByText("French"));

    expect(to).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
  });

  it("leaves hash links to the browser", async () => {
    const { getByText } = await mount();

    fireEvent.click(getByText("Anchor"));

    expect(to).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
  });

  it("does nothing when reduced motion is preferred", async () => {
    reduced = true;
    const { getByText } = await mount();

    fireEvent.click(getByText("French"));

    expect(to).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
  });

  it("hides the overlay from assistive technology", async () => {
    const { container } = await mount();

    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  });
});
