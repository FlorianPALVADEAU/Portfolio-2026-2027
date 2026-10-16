# 0004. Effect on server and build only

- Status: accepted
- Date: 2026-10-16

## Context

Effect gives typed errors, schema validation and dependency injection through layers, which suit the content pipeline and integrations (Resend, Turnstile, GitHub, Spotify). It also adds bundle weight, which matters for a performance-focused front end.

## Decision

Effect is used in `src/server` and in build-time content validation only. Client components do not import it.

## Consequences

Server code gets explicit errors and testable layers while the client bundle stays small. Data crossing to the client must be plain serializable values.
