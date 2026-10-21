# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Swiss tech recruiters and hiring engineers (engineering leads, CTOs) evaluating a full-stack candidate. Recruiters scan fast on mobile or desktop; engineers then read case studies and the public repository. Visitors read in French, English or German.

## Product Purpose

Personal portfolio of Florian Palvadeau, full-stack software engineer, to be hired in Switzerland (Geneva/Vaud, French cross-border worker, available from September 2027). Success = a visitor contacts him (email form or Calendly booking) or downloads the CV. The public code is part of the proof.

## Positioning

A full-stack engineer who also ships and runs things: engineering plus delivery coordination, proven by Overbound Race (founded, 320+ participants in the first edition, ticketing platform built in Next.js / Supabase / Stripe / Sanity, 320+ registrations and EUR 16,500+ revenue in 2026, 11 partners). Badge: "Open to positions, Switzerland". No freelance or Malt wording.

## Operating Context

Content changes via redeploy only (no admin panel). Typed structured content blocks (`content/`, `messages/` fr/en/de) validated by Effect Schema. Hosted on Vercel, domain palvadeau.ch. Contact via Resend and Turnstile; Calendly embedded lazily (requested only near the viewport). Analytics: Vercel Web Analytics and Speed Insights only. A CV PDF per locale is served as is.

## Capabilities and Constraints

- Landing with sections (hero, intro, selected works, skills, about, contact), one page per project (3-4 case studies), tech-watch notes.
- Themes: dark, light, Swiss. Sound system (UI and ambient). GSAP is the only animation library; page transition overlay; gentle smooth scroll; lazy-loaded React Three Fiber 3D.
- Extras wanted: Spotify now playing, GitHub stats.
- FR, EN and DE ship together; no hard-coded copy.
- Never publish phone, email or birth date in source or page copy; contact recipient lives in an env var. No case studies for employer work (JCDecaux, Neurones IT); no client names or internal employer metrics.
- Stack and rules are fixed in AGENTS.md.

## Brand Commitments

- FPL logo SVG and the accent blue from the mockup.
- Three themes (dark, light, Swiss) are a permanent requirement.
- Sound is muted by default and never autoplays.
- Voice: confident, plain, first person, no hype or buzzwords.

## Evidence on Hand

Verified CV facts (Neurones IT, JCDecaux, Overbound Race; PSM I, CKAD 92%, AWS Developer Associate; IIM master, bachelor; French native, English C1, Spanish B1). Overbound may be detailed fully as the showcase case study. Portrait photo and FPL logo exist; gallery photos come later from the owner. Absent: testimonials, employer case studies; do not fabricate.

## Product Principles

1. Prove with work, not claims: Overbound and the public code carry the argument.
2. Fast to scan, rewarding to read: a recruiter gets the point in seconds, an engineer finds depth.
3. Quality is the showcase: accessibility (WCAG AA, full keyboard), performance and architecture are visible features.
4. Effects serve the story: motion, sound and 3D never block content and always respect user preferences.
5. Switzerland-ready: three languages from day one, availability and location stated plainly.

## Accessibility & Inclusion

WCAG AA, full keyboard navigation, `prefers-reduced-motion` respected, sound off by default, mobile-first from small screens.
