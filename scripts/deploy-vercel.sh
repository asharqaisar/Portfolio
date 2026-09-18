#!/usr/bin/env bash
#
# Deploy the portfolio to Vercel and print the .vercel.app URL.
#
#   VERCEL_TOKEN=xxxx ./scripts/deploy-vercel.sh
#
# Make the token at https://vercel.com/account/tokens (Scope: full account is
# simplest for a one-off). Nothing is committed here — the token stays in the
# calling shell.
#
# Two passes are normal on a first deploy: the first one creates the project
# and reports the URL, the second sets NEXT_PUBLIC_SITE_URL to that URL, which
# is baked in at build time and therefore cannot be known beforehand.

set -euo pipefail

cd "$(dirname "$0")/.."

if [ -z "${VERCEL_TOKEN:-}" ]; then
  echo "VERCEL_TOKEN is not set. Create one at https://vercel.com/account/tokens" >&2
  exit 1
fi

PROJECT="ashar-portfolio"

# Pass 1 — create the project and get its URL.
# --yes accepts the defaults, --prod promotes straight to the production alias.
URL=$(npx --yes vercel@latest deploy \
  --token "$VERCEL_TOKEN" \
  --name "$PROJECT" \
  --yes \
  --prod 2>&1 | tee /dev/stderr | grep -oE 'https://[a-z0-9.-]+\.vercel\.app' | tail -1)

if [ -z "$URL" ]; then
  echo "Could not read a deployment URL from the CLI output above." >&2
  exit 1
fi

echo ""
echo "Production URL: $URL"

# Pass 2 — bake the canonical URL in and rebuild, so metadata and OG tags
# point at the real domain instead of the asharqaisar.dev placeholder.
echo "Setting NEXT_PUBLIC_SITE_URL and redeploying..."
npx --yes vercel@latest deploy \
  --token "$VERCEL_TOKEN" \
  --name "$PROJECT" \
  --env "NEXT_PUBLIC_SITE_URL=$URL" \
  --yes \
  --prod 2>&1 | tee /dev/stderr | grep -oE 'https://[a-z0-9.-]+\.vercel\.app' | tail -1

echo ""
echo "Done. Note NEXT_PUBLIC_SITE_URL was also set on the project for future builds."
