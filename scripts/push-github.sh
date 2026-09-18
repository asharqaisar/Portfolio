#!/usr/bin/env bash
# Push this repo to GitHub once, then strip the token back out of .git/config.
#
#   GITHUB_TOKEN=ghp_xxx ./scripts/push-github.sh https://github.com/<user>/<repo>.git
#
# Token needs Contents: read+write (fine-grained) or `repo` (classic).
set -euo pipefail

if [ $# -lt 1 ]; then
  echo "usage: GITHUB_TOKEN=<token> $0 <repo-https-url>" >&2
  exit 1
fi

REPO="${1%.git}.git"
TOKEN="${GITHUB_TOKEN:-}"
if [ -z "$TOKEN" ]; then
  read -r -s -p "GitHub token: " TOKEN
  echo
fi

BRANCH="$(git branch --show-current)"
git remote remove origin 2>/dev/null || true
git remote add origin "https://x-access-token:${TOKEN}@${REPO#https://}"

echo "pushing ${BRANCH} -> ${REPO}"
git push -u origin "$BRANCH"

# Leave no credential behind: point the remote at the clean URL.
git remote set-url origin "$REPO"
echo "done. remote is now: $(git remote get-url origin)"
