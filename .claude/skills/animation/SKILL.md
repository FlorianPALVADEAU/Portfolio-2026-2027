---
name: animation
description: Implement motion with GSAP (timelines, ScrollTrigger, page transition overlay) with performance and reduced-motion support. Use for any animation work.
---

# Animation

1. GSAP is the only animation library. CSS only for trivial hover and focus states.
2. Create animations in a hook using `gsap.context` or `useGSAP`, scoped to a ref, and revert on unmount.
3. Animate `transform` and `opacity` only; avoid layout properties.
4. Wrap motion in `gsap.matchMedia()`; with `prefers-reduced-motion: reduce` provide a static or instant alternative and disable smooth scroll.
5. Keep durations short and purposeful. Content must be readable and operable without animation.
6. Never hide essential content until JavaScript runs; avoid layout shift.
7. Lazy-load heavy plugins and 3D code; check the bundle impact.
