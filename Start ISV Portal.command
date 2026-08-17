#!/bin/bash
# ============================================================
#  ISV Member Portal — start the prototype
#  Double-click this file. Close the Terminal window to stop.
# ============================================================

cd "$(dirname "$0")/portal" || exit 1

PLATFORM="$(uname -s)-$(uname -m)"
MARKER="node_modules/.installed-on"

printf '\n  ISV Member Portal — prototype\n'
printf '  ─────────────────────────────────────────────\n\n'

fail() {
  printf '\n  %s\n\n' "$1"
  read -r -p '  Press return to close. '
  exit 1
}

# --- Node check -------------------------------------------------
command -v node >/dev/null 2>&1 || fail \
  'Node.js is not installed. Get the LTS build from https://nodejs.org, then run this again.'

NODE_MAJOR=$(node -p "process.versions.node.split('.')[0]")
[ "$NODE_MAJOR" -ge 18 ] || fail \
  "Node $(node -v) found. This needs Node 18 or later. Update from https://nodejs.org."

printf '  Node %s on %s\n' "$(node -v)" "$PLATFORM"

# --- Housekeeping -----------------------------------------------
rm -rf tmp .next 2>/dev/null

# --- Dependencies -----------------------------------------------
# The packages were first installed on Linux. npm does not reliably swap
# platform-specific binaries when a lockfile came from another OS, so the
# only dependable fix is a clean install with a fresh lockfile. The marker
# records which platform the current tree was built for.
NEEDS_INSTALL=1
if [ -f "$MARKER" ] && [ "$(cat "$MARKER")" = "$PLATFORM" ]; then
  NEEDS_INSTALL=0
fi

if [ "$NEEDS_INSTALL" -eq 0 ]; then
  # Trust but verify: both native modules must actually load.
  node -e "require('lightningcss'); require('next/package.json')" >/dev/null 2>&1 \
    || NEEDS_INSTALL=1
fi

if [ "$NEEDS_INSTALL" -eq 1 ]; then
  printf '\n  Installing dependencies for %s.\n' "$PLATFORM"
  printf '  Two to three minutes, and only on the first run.\n\n'

  rm -rf node_modules package-lock.json

  npm install --no-audit --no-fund || fail \
    'Install failed. Check your internet connection and run this again.'

  # Confirm the native binaries resolve before starting the server, so a
  # broken tree fails here with a clear message rather than mid-build.
  node -e "require('lightningcss'); require('next/package.json')" >/dev/null 2>&1 || fail \
    'Dependencies installed but the native modules will not load. Run: cd portal && rm -rf node_modules package-lock.json && npm install'

  printf '%s' "$PLATFORM" > "$MARKER"
  printf '\n  Dependencies installed and verified.\n'
fi

# --- Free the port ----------------------------------------------
if lsof -ti :3000 >/dev/null 2>&1; then
  printf '  Port 3000 was busy. Stopping the old server.\n'
  lsof -ti :3000 | xargs kill -9 2>/dev/null
  sleep 1
fi

# --- Go ---------------------------------------------------------
printf '\n  Starting on http://localhost:3000\n'
printf '  Close this window when you are finished.\n\n'
printf '  ─────────────────────────────────────────────\n'
printf '  The demo, in order:\n'
printf '    1. Sign in\n'
printf '    2. Switch role in the header, then switch back\n'
printf '    3. Press Cmd+K and ask about the Child Safe Standards\n'
printf '    4. Follow the related service, request it, submit\n'
printf '    5. Return to the portal and find your request\n'
printf '  Ask something off-script to see the refusal state.\n'
printf '  ─────────────────────────────────────────────\n\n'

( sleep 6 && open http://localhost:3000 ) &

npm run dev
