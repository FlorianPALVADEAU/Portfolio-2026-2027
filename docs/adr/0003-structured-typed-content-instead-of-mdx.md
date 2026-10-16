# 0003. Structured typed content instead of MDX

- Status: accepted
- Date: 2026-10-16

## Context

Case studies are long, translated into three languages and made of recurring blocks (stack, challenges, media). Long MDX files mix prose and layout, are hard to validate and hard to translate consistently.

## Decision

Content lives in `content/` as typed data: a `project.ts` per project for structure and media, and `i18n/{fr,en,de}.json` for text. Blocks are validated with Effect Schema at build time. A missing translation or media file fails the build.

## Consequences

Content is checked like code and rendered by the design system, and translations cannot silently fall behind. Authors edit structured data rather than free-form documents, which is less flexible for one-off layouts.
