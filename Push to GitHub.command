#!/bin/bash
#
# Push to GitHub.
#
# Double-click it, or run it from a terminal. Anything uncommitted gets
# staged and committed; everything gets verified before it leaves your
# machine, and then it goes up and Vercel redeploys.
#
# The verification step is the point. A broken commit reaching Vercel costs
# a redeploy cycle and, if it happens on the day, credibility. Ninety
# seconds here is cheaper.
#
#   ./"Push to GitHub.command"                 verify, then push
#   ./"Push to GitHub.command" "Your message"  commit with that message
#   ./"Push to GitHub.command" --fast          skip verification
#

set -euo pipefail
cd "$(dirname "$0")"

BOLD=$'\033[1m'; DIM=$'\033[2m'; RED=$'\033[31m'; GREEN=$'\033[32m'
YELLOW=$'\033[33m'; RESET=$'\033[0m'

say()  { printf "\n%s%s%s\n" "$BOLD" "$1" "$RESET"; }
note() { printf "%s%s%s\n" "$DIM" "$1" "$RESET"; }
ok()   { printf "%s✓%s %s\n" "$GREEN" "$RESET" "$1"; }
warn() { printf "%s!%s %s\n" "$YELLOW" "$RESET" "$1"; }
die()  { printf "\n%s✗ %s%s\n\n" "$RED" "$1" "$RESET"; read -r -p "Press return to close. "; exit 1; }

FAST=false
MESSAGE=""
for arg in "$@"; do
  case "$arg" in
    --fast) FAST=true ;;
    *) MESSAGE="$arg" ;;
  esac
done

say "ISV prototype — push to GitHub"
note "$(pwd)"

# ---------------------------------------------------------------- commit
if [[ -n "$(git status --porcelain)" ]]; then
  say "Uncommitted changes"
  git status --short
  echo

  if [[ -z "$MESSAGE" ]]; then
    read -r -p "Commit message (return to cancel): " MESSAGE
    [[ -z "$MESSAGE" ]] && die "Cancelled. Nothing was committed or pushed."
  fi

  git add -A
  git commit -q -m "$MESSAGE"
  ok "Committed: $MESSAGE"
else
  ok "Working tree clean"
fi

# ---------------------------------------------------------------- verify
if [[ "$FAST" == false ]]; then
  say "Verifying"
  note "Types, lint, and the 24 content-integrity checks. Use --fast to skip."
  cd portal

  npm run typecheck --silent >/dev/null 2>&1 \
    && ok "Types" \
    || { npm run typecheck; die "Type errors. Nothing pushed."; }

  npx eslint src --quiet >/dev/null 2>&1 \
    && ok "Lint" \
    || { npx eslint src --quiet; die "Lint errors. Nothing pushed."; }

  # QA covers the voice rules: describes what ISV provides, never what a
  # regulation requires. Worth failing a push over.
  if node scripts/qa.mjs >/tmp/isv-qa.log 2>&1; then
    ok "$(grep -Eo '[0-9]+/[0-9]+ automated checks passed' /tmp/isv-qa.log || echo 'QA')"
  else
    grep -E "FAIL" /tmp/isv-qa.log || cat /tmp/isv-qa.log
    die "QA failed. Nothing pushed."
  fi

  cd ..
else
  warn "Verification skipped"
fi

# ------------------------------------------------------------------ push
say "Pushing"
AHEAD=$(git rev-list --count @{u}..HEAD 2>/dev/null || echo "?")

if [[ "$AHEAD" == "0" ]]; then
  ok "Already up to date. Nothing to push."
else
  git push
  ok "Pushed $AHEAD commit(s) to origin/main"
  note "Vercel builds from portal/ and redeploys automatically."
fi

say "Done"
git --no-pager log --oneline -3
echo
read -r -p "Press return to close. "
