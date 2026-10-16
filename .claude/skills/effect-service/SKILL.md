---
name: effect-service
description: Add a server capability with Effect (schema, service, layer, adapter). Use for contact, Turnstile, Spotify, GitHub stats or content loading.
---

# Effect service

1. Domain: define schemas and tagged errors in `src/server/domain`.
2. Service: define the interface as a `Context.Tag` and the logic in `src/server/services`, depending only on domain and other services.
3. Infrastructure: implement the adapter (HTTP, Resend, filesystem) as a `Layer` in `src/server/infrastructure`.
4. Validate all external input with Effect Schema at the boundary; model failures as typed errors, never throw.
5. Read secrets from environment variables through a config service; never hard-code them or personal data.
6. Provide a test layer and unit test the service without network.
7. Effect stays server-side: expose results to the client as plain serializable data.
