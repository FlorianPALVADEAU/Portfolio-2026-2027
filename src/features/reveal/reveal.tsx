"use client";

import { gsap } from "gsap";
import { type ComponentPropsWithoutRef, useLayoutEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Rises the direct children of a section in, one after the other, when it first enters the
 * viewport. Children start hidden only once the script runs, so content stays readable without it.
 */
export function Reveal(props: ComponentPropsWithoutRef<"div">) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = root.current;
    if (!element || prefersReducedMotion()) return;
    const parts = Array.from(element.children);
    const fold = window.innerHeight;
    const pending = parts.filter((part) => part.getBoundingClientRect().top >= fold * 0.85);
    if (pending.length === 0) return;

    gsap.set(pending, { autoAlpha: 0, y: 28 });
    const observer = new IntersectionObserver(
      (entries) => {
        const entering = entries.filter((entry) => entry.isIntersecting);
        entering.forEach((entry, order) => {
          observer.unobserve(entry.target);
          gsap.to(entry.target, {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            delay: order * 0.09,
            ease: "power3.out",
            clearProps: "all",
          });
        });
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    for (const part of pending) observer.observe(part);

    return () => {
      observer.disconnect();
      gsap.set(pending, { clearProps: "all" });
    };
  }, []);

  return <div ref={root} {...props} />;
}
