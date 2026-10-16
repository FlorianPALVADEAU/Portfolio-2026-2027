#!/usr/bin/env bash
# Formats and lints a file right after an agent edits it.
file=$(jq -r '.tool_input.file_path // empty')
case "$file" in
  *.ts | *.tsx | *.js | *.jsx | *.mjs | *.cjs | *.json | *.jsonc | *.css)
    npx --no-install biome check --write --no-errors-on-unmatched "$file" >&2 || exit 2
    ;;
esac
