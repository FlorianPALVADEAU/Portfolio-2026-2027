# Source layout

| Path | Role | May import |
| --- | --- | --- |
| `app/` | Routes. Pages and layouts are pure assemblies of templates and organisms. | templates, organisms, feature public APIs |
| `components/atoms` | Smallest UI units (button, icon, text). | `lib`, styles |
| `components/molecules` | Small groups of atoms. | atoms |
| `components/organisms` | Self-contained page sections. | molecules, atoms, feature public APIs |
| `components/templates` | Page layouts that arrange organisms. | organisms and below |
| `features/<name>` | Vertical capabilities (theme, sound, i18n...). Expose only `index.ts`. | components, `lib` |
| `server/domain` | Effect schemas and domain types. | nothing outside `lib` |
| `server/services` | Effect services and layers. | `server/domain` |
| `server/infrastructure` | Adapters (Resend, Turnstile, content loader). | `server/domain`, `server/services` |
| `lib` | Framework-free helpers. | nothing |

Imports only point downward. The rules are enforced by dependency-cruiser (`npm run lint:arch`).
