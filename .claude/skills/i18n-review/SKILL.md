---
name: i18n-review
description: Review French, English and German copy for completeness, accuracy and natural wording. Use after adding or changing any translated text.
---

# Review translations

Check, for every changed key:

1. **Completeness**: the key exists in `fr`, `en` and `de` with no placeholder text.
2. **Parity**: same facts, numbers, names and links in all locales; nothing added or dropped.
3. **German**: Swiss Standard German. Use `ss`, never `ß`. Prefer natural phrasing over word-for-word translation, correct compounds, consistent formal tone (Sie), Swiss conventions (dates 16.10.2026, CHF).
4. **French**: correct accents and typography (narrow no-break space before `:;!?`), consistent register.
5. **English**: neutral and concise, consistent spelling variant.
6. **Layout**: German strings run long; confirm they do not overflow at mobile width.
7. **Interpolation**: placeholders and plural forms match across locales.

Report issues per key with a proposed fix. Do not silently rewrite meaning.
