import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { galleryIds } from "@/lib/landing";
import en from "../../../../messages/en.json";
import { GallerySection } from "./gallery-section";

function renderSection() {
  return render(
    <GallerySection
      index={5}
      title="Gallery"
      closingTitle="Let's work together"
      messages={en.home.gallery}
    />,
  );
}

describe("GallerySection", () => {
  it("is labelled by its title and describes every photo", () => {
    renderSection();

    expect(screen.getByRole("region", { name: "Gallery" })).toHaveAttribute("id", "gallery");
    for (const id of galleryIds) {
      expect(screen.getByRole("img", { name: en.home.gallery.images[id] })).toBeInTheDocument();
    }
  });

  it("ends on the invitation, under its own heading", () => {
    const { container } = renderSection();

    expect(screen.getByRole("heading", { level: 2, name: "Let's work together" })).toBeVisible();
    expect(container).toHaveTextContent(en.home.gallery.invitation);
  });
});
