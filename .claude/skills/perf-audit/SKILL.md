---
name: perf-audit
description: Audit performance (Core Web Vitals, bundle, images, fonts, 3D). Use before merging features that add assets, scripts or animation.
---

# Performance audit

1. Run a production build and Lighthouse (mobile) on the affected pages; compare with the previous result.
2. JavaScript: check route bundle sizes; lazy-load 3D, GSAP plugins and other heavy code.
3. Images and video: `next/image`, correct sizes, modern formats, explicit dimensions; video lazy and muted with posters.
4. Fonts: `next/font`, subset, `display: swap`, few weights.
5. Layout stability: no shift from late content, fonts or embeds.
6. Rendering: prefer static and cached output; keep client components small.
7. Third parties load on interaction (facades); analytics stays Vercel's.
8. Report metrics before and after with the action taken.
