# 0006. Three locales from day one

- Status: accepted
- Date: 2026-10-16

## Context

The portfolio targets employers in Switzerland and abroad. Retrofitting translations later touches every component and content file.

## Decision

French, English and German (Swiss Standard German, without ß) are supported from the first commit. All user-facing copy goes through message files and typed content, and an `i18n-review` skill checks translation quality.

## Consequences

Layouts are tested against longer German strings early and no hard-coded copy accumulates. Every content change requires three translations.
