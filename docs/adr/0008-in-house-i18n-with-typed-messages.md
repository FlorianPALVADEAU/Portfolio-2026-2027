# 0008. In-house i18n with typed messages

- Status: accepted
- Date: 2026-10-18

## Context

The site ships in French, English and German with locale in the URL. It has a small set of UI strings, static rendering with Cache Components, and no need for plural-heavy or ICU-formatted copy.

## Decision

Locale routing is a `[locale]` segment plus `src/proxy.ts`, which redirects unprefixed paths using `Accept-Language`. Strings live in `messages/{fr,en,de}.json`; the English file defines the `Messages` type, so a missing key in another locale is a type error at the loader and a failing parity test. The route passes the relevant slice of messages to templates and organisms as props, which keeps components pure and testable in Storybook. Helpers live in `src/lib/i18n`. No i18n library is added.

## Consequences

No dependency to track and no runtime in client bundles beyond the switcher. Features a library provides for free (plural rules, ICU formatting, translated pathnames) are not available; if the copy outgrows plain strings, this decision should be revisited.
