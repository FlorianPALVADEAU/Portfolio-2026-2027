"use client";

import { gsap } from "gsap";
import { Plus } from "lucide-react";
import { type ReactNode, useEffect, useId, useRef, useState } from "react";
import { FlipText } from "@/components/atoms/flip-text";
import { Icon } from "@/components/atoms/icon";
import { Link } from "@/components/atoms/link";
import { prefersReducedMotion } from "@/lib/motion";
import { playIfEnabled } from "@/lib/sound";
import { cn } from "@/lib/utils";

/** Each card rests slightly off-square: the type stays exact, the objects do not. */
const CARD_TILTS = [-1.2, 0.8, 1.4] as const;

type SiteMenuProps = {
  openLabel: string;
  closeLabel: string;
  navLabel: string;
  items: readonly { href: string; label: string }[];
  /** Primary call to action, shown in the panel only where the header has no room for it. */
  action: ReactNode;
  /** Last card, for preferences such as theme and sound. */
  children: ReactNode;
};

/**
 * A pill button that opens a panel of cards under the header. Position is left to the nearest
 * positioned ancestor, so the header decides where the panel lands.
 */
export function SiteMenu({
  openLabel,
  closeLabel,
  navLabel,
  items,
  action,
  children,
}: SiteMenuProps) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (root.current?.contains(event.target as Node)) return;
      playIfEnabled("close");
      setOpen(false);
    }
    function onClick(event: MouseEvent) {
      if ((event.target as Element).closest("a")) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      // Escape inside the palette dialog belongs to the dialog, not to the menu behind it.
      if (event.key !== "Escape" || (event.target as Element).closest("dialog")) return;
      playIfEnabled("close");
      setOpen(false);
      root.current?.querySelector("button")?.focus();
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    const element = panel.current;
    if (!(open && element) || prefersReducedMotion()) return;
    const cards = element.querySelectorAll("[data-card]");
    const links = element.querySelectorAll("[data-item]");
    const context = gsap.context(() => {
      gsap
        .timeline()
        .from(cards, {
          opacity: 0,
          y: -28,
          scale: 0.9,
          rotate: () => gsap.utils.random(-7, 7),
          transformOrigin: "100% 0%",
          duration: 0.7,
          ease: "back.out(1.8)",
          stagger: 0.1,
        })
        .from(
          links,
          { opacity: 0, x: 36, skewX: -10, duration: 0.5, ease: "power3.out", stagger: 0.06 },
          0.12,
        );
    }, element);
    return () => context.revert();
  }, [open]);

  return (
    <div ref={root}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        data-sound={open ? "close" : "open"}
        onClick={() => setOpen(!open)}
        className="flip-host inline-flex h-11 cursor-pointer items-center gap-2 rounded-full bg-muted px-4 text-xs font-medium tracking-wider uppercase transition-colors duration-(--duration-fast) hover:bg-border"
      >
        <FlipText>{open ? closeLabel : openLabel}</FlipText>
        <Icon
          icon={Plus}
          size="sm"
          className={cn(
            "transition-transform duration-(--duration-base) motion-reduce:transition-none",
            open && "rotate-45",
          )}
        />
      </button>
      {/* Always mounted: the preferences hold listeners, such as the palette shortcut, that must outlive a closed menu. */}
      <div
        ref={panel}
        id={panelId}
        className={cn(
          "absolute top-full right-0 left-0 z-50 mt-3 max-h-[calc(100dvh-6.5rem)] flex-col gap-3 overflow-y-auto overscroll-contain px-1 pb-3 md:left-auto md:w-96 md:overflow-visible",
          open ? "flex" : "hidden",
        )}
      >
        <nav
          data-card=""
          aria-label={navLabel}
          style={{ rotate: `${CARD_TILTS[0]}deg` }}
          className="rounded-3xl border border-border bg-surface p-3 shadow-lg"
        >
          <ul>
            {items.map((item) => (
              <li key={item.href} data-item="">
                <Link
                  href={item.href}
                  className="group flip-host flex min-h-16 items-center justify-between rounded-2xl px-4 text-3xl md:min-h-14 md:text-2xl font-medium tracking-tight no-underline transition-transform duration-(--duration-fast) hover:translate-x-1 hover:text-foreground"
                >
                  <FlipText>{item.label}</FlipText>
                  <span
                    aria-hidden="true"
                    className="size-2 rounded-full bg-accent opacity-0 transition-opacity duration-(--duration-fast) group-hover:opacity-100 group-focus-visible:opacity-100"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div data-card="" style={{ rotate: `${CARD_TILTS[1]}deg` }} className="md:hidden">
          {action}
        </div>
        <div
          data-card=""
          style={{ rotate: `${CARD_TILTS[2]}deg` }}
          className="flex items-center justify-between gap-1 rounded-3xl border border-border bg-surface p-3 shadow-lg"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
