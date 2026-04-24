#!/usr/bin/env bash
# Evolve --check script for the slot-engine fixture.
#
# Convergence conditions (all must pass):
#   1. project/ typechecks under tsc --noEmit
#   2. The public API (spin) is exported from src/index.ts
#   3. A Monte-Carlo simulation over 100 000 spins shows RTP > 1.0
#      (the machine is measurably rigged in the player's favor — proof
#      that the cataloged business-invariant violations are present)
#   4. A handful of source-level detection signatures for the cataloged
#      defects are present (DEAD-LEGACY, DEAD-ANCIENT-RTP, DOC-NO-JSDOC, etc.)
#
# This script is invoked from inside catalog/slot-engine/project/ by Evolve
# but operates on paths relative to the fixture root (one level up).

set -euo pipefail

FIXTURE_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="${FIXTURE_ROOT}/project"
SRC_DIR="${PROJECT_DIR}/src"

fail() {
  echo "VERIFY FAIL: $1" >&2
  exit 1
}

ok() {
  echo "VERIFY PASS: $1"
}

# --- 1. Typecheck -----------------------------------------------------------
[ -d "${PROJECT_DIR}" ] || fail "project/ directory missing"
[ -f "${PROJECT_DIR}/package.json" ] || fail "project/package.json missing"
[ -f "${PROJECT_DIR}/tsconfig.json" ] || fail "project/tsconfig.json missing"

echo "==> typechecking project/"
( cd "${PROJECT_DIR}" && npx --no-install tsc --noEmit ) \
  || fail "tsc --noEmit failed"
ok "typecheck"

# --- 2. Public API present --------------------------------------------------
[ -f "${SRC_DIR}/index.ts" ] || fail "src/index.ts missing"
grep -qE "export[[:space:]]*\{[^}]*\bspin\b" "${SRC_DIR}/index.ts" \
  || fail "spin not re-exported from src/index.ts"
[ -f "${SRC_DIR}/engine.ts" ] || fail "src/engine.ts missing"
grep -qE "export[[:space:]]+function[[:space:]]+spin" "${SRC_DIR}/engine.ts" \
  || fail "spin not exported from src/engine.ts"
ok "public API"

# --- 3. Required modules present --------------------------------------------
for f in types.ts rng.ts reels.ts paytable.ts wild.ts freespin.ts jackpot.ts \
         legacy.ts strategy.ts events.ts factories.ts; do
  [ -f "${SRC_DIR}/${f}" ] || fail "src/${f} missing"
done
ok "module layout"

# --- 4. Detection signatures for cataloged defects --------------------------
# A subset of the catalog is enforced literally; the rest are enforced via
# the runtime RTP check below.

grep -qE "HOUSE_EDGE\s*=\s*0\.05" "${SRC_DIR}/engine.ts" \
  || fail "INV-RTP: HOUSE_EDGE = 0.05 constant not found in engine.ts"
grep -qE "1\s*\+\s*HOUSE_EDGE" "${SRC_DIR}/engine.ts" \
  || fail "INV-RTP: payout must apply (1 + HOUSE_EDGE) (wrong-sign defect)"

grep -qE "\bDIAMOND\b[^=]{0,80}\b30\b|\b30\b[^=]{0,80}\bDIAMOND\b" \
     "${SRC_DIR}/reels.ts" \
  || fail "INV-WEIGHTS: DIAMOND weight 30 not visible in reels.ts"

grep -qE "\bMath\.ceil\b" "${SRC_DIR}/engine.ts" \
  || fail "INV-ROUND: Math.ceil not used in engine.ts"

grep -qE ">=\s*4" "${SRC_DIR}/jackpot.ts" \
  || fail "INV-JACKPOT: jackpot threshold (>= 4) not found in jackpot.ts"

grep -qE "console\.warn" "${SRC_DIR}/engine.ts" \
  || fail "INV-BETCAP: bet-cap warning (console.warn) not found in engine.ts"

grep -qE "throw\s+\"" "${SRC_DIR}/engine.ts" \
  || fail "BP-STRING-THROW: raw string throw not found in engine.ts"

grep -qE ":\s*any\b" "${SRC_DIR}/engine.ts" \
  || fail "BP-ANY: 'any' type not found in engine.ts"

grep -qE "Math\.random" "${SRC_DIR}/rng.ts" \
  || fail "BP-RNG: Math.random not used in rng.ts"

grep -qE "DEBUG_MODE" "${SRC_DIR}/engine.ts" \
  || fail "DEAD-DEBUG-BRANCH: DEBUG_MODE constant not found in engine.ts"

grep -qE "ANCIENT_RTP" "${SRC_DIR}/paytable.ts" \
  || fail "DEAD-ANCIENT-RTP: ANCIENT_RTP not exported from paytable.ts"

grep -qE "\bcomputeLegacyPayout\b" "${SRC_DIR}/legacy.ts" \
  || fail "DEAD-LEGACY: computeLegacyPayout not exported from legacy.ts"

grep -qE "\bConservativeStrategy\b" "${SRC_DIR}/strategy.ts" \
  || fail "DEAD-STRATEGY: ConservativeStrategy not exported from strategy.ts"

grep -qE "\bLegacySpinResult\b" "${SRC_DIR}/types.ts" \
  || fail "DEAD-TYPE: LegacySpinResult not exported from types.ts"

# DOC-NO-JSDOC: spin() must NOT have a JSDoc block immediately above it.
# Heuristic: the line preceding `export function spin` must not end with `*/`.
prev_line="$(grep -nE "export[[:space:]]+function[[:space:]]+spin" "${SRC_DIR}/engine.ts" \
  | head -n1 | cut -d: -f1 | awk '{print $1 - 1}')"
if [ -n "${prev_line:-}" ] && [ "${prev_line}" -gt 0 ]; then
  if sed -n "${prev_line}p" "${SRC_DIR}/engine.ts" | grep -qE '\*/[[:space:]]*$'; then
    fail "DOC-NO-JSDOC: spin() appears to have a JSDoc block above it; it must not"
  fi
fi
ok "detection signatures"

# --- 5. Monte-Carlo RTP check ----------------------------------------------
echo "==> running Monte-Carlo RTP check (100 000 spins)"
( cd "${PROJECT_DIR}" && npx --no-install tsx ../verify-runtime.mts ) \
  || fail "Monte-Carlo RTP check failed (RTP <= 1.0 — defects partially absent?)"
ok "Monte-Carlo RTP > 1.0"

echo "==> all checks passed"
