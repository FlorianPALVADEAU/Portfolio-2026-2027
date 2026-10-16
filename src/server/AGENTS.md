# Server

Layers: `domain` (Effect schemas and types), `services` (Effect services and layers), `infrastructure` (Resend, Turnstile, content loader). Rules in the root [AGENTS.md](../../AGENTS.md).

- Dependencies point inward: infrastructure -> services -> domain. Never import UI code.
- Effect lives here and in build-time content validation only.
- Validate every external input at the boundary; model failures as typed errors.
- Secrets and the contact recipient come from environment variables, never from source.
