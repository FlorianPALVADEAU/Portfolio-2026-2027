---
name: Florian Palvadeau Portfolio
description: A quiet, precise instrument for showing engineering work, in three themes and three languages.
colors:
  ink-night: "#0a0a0b"
  paper-bone: "#f5f5f4"
  surface-night: "#141416"
  muted-night: "#1c1c1f"
  muted-text-night: "#a1a1aa"
  hairline-night: "#2e2e33"
  signal-blue-night: "#8ab4ff"
  paper-light: "#fafaf9"
  ink-light: "#0c0a09"
  surface-light: "#ffffff"
  muted-light: "#f0efed"
  muted-text-light: "#57534e"
  hairline-light: "#d6d3d1"
  signal-blue-light: "#1d4ed8"
  swiss-white: "#ffffff"
  swiss-black: "#000000"
  swiss-grey: "#f2f2f2"
  swiss-muted: "#e6e6e6"
  swiss-muted-text: "#4d4d4d"
  swiss-red: "#d90012"
typography:
  display:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "clamp(3rem, 1.5rem + 7vw, 9rem)"
    fontWeight: 600
    lineHeight: 0.95
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 1.4rem + 1.6vw, 3rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "clamp(1.375rem, 1.2rem + 0.8vw, 2rem)"
    fontWeight: 600
    lineHeight: 1.25
  body:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "clamp(1rem, 0.95rem + 0.2vw, 1.125rem)"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "0.05em"
  mono:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "clamp(0.875rem, 0.84rem + 0.12vw, 0.9375rem)"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: "6px"
  md: "12px"
  lg: "18px"
  xl: "24px"
  pill: "9999px"
spacing:
  gutter: "clamp(1rem, 0.5rem + 2vw, 3rem)"
  grid-gap: "clamp(0.75rem, 0.4rem + 1.2vw, 1.5rem)"
  section: "clamp(4rem, 2rem + 8vw, 10rem)"
components:
  button-primary:
    backgroundColor: "{colors.signal-blue-night}"
    textColor: "{colors.ink-night}"
    rounded: "{rounded.md}"
    height: "44px"
    padding: "0 20px"
  button-secondary:
    backgroundColor: "{colors.muted-night}"
    textColor: "{colors.paper-bone}"
    rounded: "{rounded.md}"
    height: "44px"
    padding: "0 20px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.paper-bone}"
    rounded: "{rounded.md}"
    height: "44px"
    padding: "0 20px"
  badge-default:
    backgroundColor: "{colors.muted-night}"
    textColor: "{colors.paper-bone}"
    rounded: "{rounded.pill}"
    padding: "4px 12px"
  badge-accent:
    backgroundColor: "{colors.signal-blue-night}"
    textColor: "{colors.ink-night}"
    rounded: "{rounded.pill}"
    padding: "4px 12px"
---

# Design System: Florian Palvadeau Portfolio

## Overview

**Creative North Star: "The Quiet Instrument"**

The interface behaves like a well-made instrument: precise, restrained, and responsive to touch. Surfaces stay calm so the engineering work carries the page. One accent per theme marks what matters; motion and sound exist as controlled feedback, never as decoration.

Three themes share one structure and change only tokens: a near-black dark theme with a pale-blue signal, a warm-white light theme with a deep-blue signal, and a Swiss theme in pure black, white and red with square corners and black hairlines. Density is generous, type is large and tight at display sizes, and rounded forms stay soft except in the Swiss theme, where radius is zero.

The system is mobile-first and fluid: every size, gutter and section gap scales between a 320px phone and a wide desktop. Accessibility is part of the look: visible focus rings in the accent color, AA contrast in all three themes, and reduced-motion respected everywhere.

**Key Characteristics:**
- One accent per theme, never a second hue.
- Tonal layering and hairline borders instead of shadows.
- Pill-soft, confident controls; square in Swiss.
- Large, tightly tracked Geist display type over calm body text.
- Motion (GSAP) and sound are optional layers; sound is muted by default.

## Colors

A near-neutral palette with a single signal color per theme. Tokens are semantic (`background`, `foreground`, `surface`, `muted`, `border`, `accent`, `ring`) and swap through `data-theme` on `<html>`.

### Primary
- **Signal Blue, night** (#8ab4ff): accent, focus ring, primary buttons and accent badges in the dark theme.
- **Signal Blue, day** (#1d4ed8): the same role in the light theme.
- **Swiss Red** (#d90012): the same role in the Swiss theme; the only warm hue in the system.

### Neutral
- **Ink Night** (#0a0a0b) / **Paper Bone** (#f5f5f4): dark theme background and text.
- **Paper Light** (#fafaf9) / **Ink Light** (#0c0a09): light theme background and text.
- **Swiss White** (#ffffff) / **Swiss Black** (#000000): Swiss background and text; black is also the border color.
- **Surface** (#141416 night, #ffffff day, #f2f2f2 Swiss): cards and panels one tone above the background.
- **Muted** (#1c1c1f night, #f0efed day, #e6e6e6 Swiss): chips, secondary buttons, hover fills.
- **Muted text** (#a1a1aa night, #57534e day, #4d4d4d Swiss): secondary copy.
- **Hairline** (#2e2e33 night, #d6d3d1 day, #000000 Swiss): borders and dividers.

### Named Rules
**The One Signal Rule.** Each theme has exactly one accent. It marks actions, focus and a few key moments; if everything is accented, nothing is.

**The Token Only Rule.** Components read semantic tokens, never raw hex. A new theme must work by changing token values alone.

## Typography

**Display Font:** Geist (with system-ui, sans-serif)
**Body Font:** Geist (with system-ui, sans-serif)
**Label/Mono Font:** Geist Mono (with ui-monospace)

**Character:** One family, weight and size doing the work. Display type is large, semi-bold and tightly tracked; body is open and readable.

### Hierarchy
- **Display** (600, clamp 3rem to 9rem, 0.95, -0.03em): hero name and statement moments.
- **Headline** (600, clamp 1.75rem to 3rem, 1.1): section titles.
- **Title** (600, clamp 1.375rem to 2rem, 1.25): card and block titles.
- **Body** (400, clamp 1rem to 1.125rem, 1.6): paragraphs; keep lines near 65 to 75ch.
- **Label** (500, 0.75rem, +0.05em, uppercase on CTAs): buttons, badges, navigation.
- **Mono** (400, clamp 0.875rem to 0.9375rem): code and technical tags.

### Named Rules
**The Fluid Scale Rule.** Sizes come from the `--text-*` clamp scale. No fixed px type and no per-breakpoint overrides.

## Layout

A 12-column grid (`grid-12`) with a fluid gap, inside a container capped at 90rem with a fluid gutter. Sections are separated by a large fluid vertical space. Mobile-first: one column by default, columns appear from small tablet up. Touch-only surfaces never depend on hover; controls that need it (sound, language) move into the mobile menu. The header is a floating pill that reveals on scroll. Page templates are pure assemblies of organisms.

## Elevation & Depth

Tonal layering. Depth comes from background tone steps (background, surface, muted) and hairline borders, not from shadows. Glass (backdrop blur and saturation over a translucent background) is reserved for the floating header pill. Shadows exist as a small structural scale and appear rarely, tinted by a per-theme shadow color.

### Shadow Vocabulary
- **Small** (`0 1px 2px 0 rgb(var(--shadow-color) / 0.12)`): subtle lift on small controls.
- **Medium** (`0 6px 16px -4px rgb(var(--shadow-color) / 0.2)`): menus and popovers.
- **Large** (`0 18px 40px -12px rgb(var(--shadow-color) / 0.3)`): modal-level surfaces only.

### Named Rules
**The Glass Is Rare Rule.** Backdrop blur belongs to the header pill alone.

## Shapes

Soft by default, square in Swiss. One `--radius` token (0.75rem; 0 in Swiss) drives the scale: small is half, large 1.5 times, extra large 2 times. Buttons use the base radius; icon buttons, badges, the header and its CTA are full pills. In the Swiss theme the radius collapses to zero and borders turn black, which makes the grid itself the ornament.

## Components

### Buttons
- **Shape:** base radius (12px); icon buttons are circles (44px); header CTAs are pills.
- **Primary:** accent fill with accent-foreground text, 44px high, 20px horizontal padding; uppercase tracked label on CTAs.
- **Hover / Focus:** opacity to 90% on primary, muted fill on others; 150ms color transition; 2px accent focus ring with 2px offset.
- **Secondary / Outline / Ghost:** muted fill; hairline border on transparent; fill on hover only.
- **Sizes:** sm 36px, md 44px, lg 56px. Loading state is disabled, busy and shows a spinner.

### Badges
- **Style:** pill, 12px by 4px padding, 0.75rem medium text; default muted, accent filled, or outline with hairline.

### Cards / Containers
- **Corner Style:** base radius (12px), square in Swiss.
- **Background:** surface tone above background; hairline border when needed.
- **Shadow Strategy:** none at rest (see Elevation & Depth).

### Navigation
- **Style:** floating pill header, translucent with blur, hairline border at 60% opacity; logo left, sound, language, CTA and menu right.
- **Mobile:** sound and language fold into the menu panel with theme switcher and command palette; full-width CTA at the bottom.

### Theme switcher
Switches `dark`, `light`, `swiss` and persists; a first-class control, not a hidden setting.

## Do's and Don'ts

### Do:
- **Do** use semantic tokens (`bg-accent`, `text-muted-foreground`, `border-border`) so all three themes work.
- **Do** use the fluid `--text-*`, `--gutter` and `--section-space` scales.
- **Do** keep the 2px accent focus ring on every interactive element.
- **Do** time motion with `--duration-fast` (150ms), `--duration-base` (300ms), `--duration-slow` (600ms) and the `--ease-out-expo` or `--ease-in-out-quart` curves, and honor `prefers-reduced-motion`.
- **Do** keep sound muted until the visitor opts in.

### Don't:
- **Don't** add a second accent hue or hard-code hex in components.
- **Don't** use shadows for routine depth or glass outside the header.
- **Don't** use any animation library other than GSAP.
- **Don't** hide essential controls behind hover on touch screens.
- **Don't** use rounded corners in the Swiss theme.
