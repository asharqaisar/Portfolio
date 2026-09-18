#!/usr/bin/env sh
# setup-mcp.sh — wire the project's MCP servers into your agent.
#
#   ./scripts/setup-mcp.sh              # project scope (writes .mcp.json keys into your client)
#   ./scripts/setup-mcp.sh --user       # user scope (available in every project)
#
# Safe to re-run: `claude mcp add` overwrites the named server.
# Requires the `claude` CLI in PATH. Keys are read from .env if it exists.

set -e
cd "$(dirname "$0")/.."

SCOPE="project"
[ "$1" = "--user" ] && SCOPE="user"

if [ -f .env ]; then
  # shellcheck disable=SC1091
  . ./.env
fi

echo "Configuring MCP servers (scope: $SCOPE)…"

# --- context7: live, version-correct library docs -----------------------------
if [ -n "$CONTEXT7_API_KEY" ]; then
  claude mcp add --scope "$SCOPE" --transport http \
    --header "CONTEXT7_API_KEY: $CONTEXT7_API_KEY" \
    context7 https://mcp.context7.com/mcp
  echo "  context7  http (authenticated, higher rate limits)"
else
  claude mcp add --scope "$SCOPE" context7 -- npx -y @upstash/context7-mcp@latest
  echo "  context7  stdio (unauthenticated — set CONTEXT7_API_KEY in .env for higher limits)"
fi

# --- 21st.dev: search + retrieve React/Tailwind components --------------------
if [ -n "$API_KEY_21ST" ]; then
  claude mcp add --scope "$SCOPE" --transport http \
    --header "x-api-key: $API_KEY_21ST" \
    21st https://21st.dev/api/mcp
  echo "  21st      http (API key from .env)"
else
  echo "  21st      SKIPPED — no API_KEY_21ST."
  echo "            Get one at https://21st.dev/settings/api-keys and put it in .env,"
  echo "            then re-run this script. Or authenticate with a browser session:"
  echo "              npx @21st-dev/cli@latest login"
  echo "            (the key is still required for the MCP header; .mcp.json already"
  echo "             references \${API_KEY_21ST}, so filling .env is enough)"
fi

echo
echo "Restart Claude Code (or run: claude mcp list) to confirm."
