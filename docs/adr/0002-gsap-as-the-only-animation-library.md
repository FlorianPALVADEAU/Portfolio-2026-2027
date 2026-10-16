# 0002. GSAP as the only animation library

- Status: accepted
- Date: 2026-10-16

## Context

The site needs scroll-driven animation, a custom page transition overlay and fine timeline control. Shipping two animation libraries would add weight and two mental models.

## Decision

GSAP is the only animation library. CSS handles trivial hover and focus states. Motion respects `prefers-reduced-motion`, and smooth scrolling (Lenis) is disabled in that case.

## Consequences

One API and one bundle to optimize, with strong timeline and ScrollTrigger support. React-specific conveniences from other libraries are not available, so GSAP lifecycles are wrapped in project hooks.
