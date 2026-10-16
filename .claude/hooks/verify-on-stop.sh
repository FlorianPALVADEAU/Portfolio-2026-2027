#!/usr/bin/env bash
# Blocks the agent from stopping while types or the import hierarchy are broken.
cd "$CLAUDE_PROJECT_DIR" || exit 0
input=$(cat)
[ "$(echo "$input" | jq -r '.stop_hook_active // false')" = "true" ] && exit 0
out=$(npm run --silent typecheck 2>&1 && npm run --silent lint:arch 2>&1) || {
  echo "$out" >&2
  exit 2
}
