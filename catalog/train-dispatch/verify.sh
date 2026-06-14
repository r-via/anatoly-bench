#!/usr/bin/env bash
# Evolve --check script for the train-dispatch fixture.
#
# Convergence conditions (all must pass):
#   1. project/ typechecks under tsc --noEmit
#   2. The public API (runSchedule) is exported from src/index.ts
#   3. The 12-module layout is present
#   4. A handful of source-level detection signatures for the cataloged defects
#      are present (the documented timing constants exist and are named, the
#      dispatcher caps its run, etc.)
#   5. A deterministic discrete-event simulation of the full timetable, run by
#      verify-runtime.mts, reconstructs the ground-truth behaviour from the
#      movement trace and confirms that all four operating guarantees
#      (punctuality, exclusivity, liveness, conservation) are measurably
#      violated — proof that the cataloged behavioural-invariant defects are
#      present. No RNG, no Monte-Carlo: a single run is the ground truth.
#
# This script is invoked from inside catalog/train-dispatch/project/ by Evolve
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
grep -qE "export[[:space:]]*\{[^}]*\brunSchedule\b" "${SRC_DIR}/index.ts" \
  || fail "runSchedule not re-exported from src/index.ts"
[ -f "${SRC_DIR}/dispatcher.ts" ] || fail "src/dispatcher.ts missing"
grep -qE "export[[:space:]]+function[[:space:]]+runSchedule" "${SRC_DIR}/dispatcher.ts" \
  || fail "runSchedule not exported from src/dispatcher.ts"
ok "public API"

# --- 3. Required modules present --------------------------------------------
for f in index.ts types.ts network.ts timetable.ts dispatcher.ts priority.ts \
         signals.ts interlocking.ts routing.ts kpi.ts telemetry.ts format.ts; do
  [ -f "${SRC_DIR}/${f}" ] || fail "src/${f} missing"
done
ok "module layout"

# --- 4. Detection signatures for cataloged defects --------------------------
# Light source anchors that keep the catalog (file, symbol) targets honest.
# The behavioural violations themselves are enforced by the runtime check.

# INV-DWELL — the documented dwell is 2; the shipped constant must be 6 and
# must be named (not inlined). A "fix" that restores 2 fails here AND in the
# on-time runtime check.
grep -qE "\bDWELL_TICKS\b" "${SRC_DIR}/timetable.ts" \
  || fail "INV-DWELL: DWELL_TICKS constant not found in timetable.ts"
grep -qE "\bDWELL_TICKS\b\s*=\s*6\b" "${SRC_DIR}/timetable.ts" \
  || fail "INV-DWELL: DWELL_TICKS must be 6 (documented dwell is 2); it appears corrected"

# The other two timing constants are named in the same module.
grep -qE "\bMIN_HEADWAY\b" "${SRC_DIR}/timetable.ts" \
  || fail "MIN_HEADWAY constant not found in timetable.ts"
grep -qE "\bON_TIME_SLACK\b" "${SRC_DIR}/timetable.ts" \
  || fail "ON_TIME_SLACK constant not found in timetable.ts"

# INV-PRIORITY — priority.ts must export the junction comparator.
grep -qE "export\b" "${SRC_DIR}/priority.ts" \
  || fail "INV-PRIORITY: priority.ts exports no comparator"

# INV-HEADWAY — signals.ts is the headway gate and must reference MIN_HEADWAY.
grep -qE "\bMIN_HEADWAY\b" "${SRC_DIR}/signals.ts" \
  || fail "INV-HEADWAY: signals.ts does not reference MIN_HEADWAY"

# INV-MUTEX / INV-DEADLOCK — both live in interlocking.ts; it must reference
# the single-track section blocks.
grep -qE "\bbS1\b" "${SRC_DIR}/interlocking.ts" \
  || fail "INV-DEADLOCK: interlocking.ts does not reference the single-track block bS1"
grep -qE "\bbS2\b" "${SRC_DIR}/interlocking.ts" \
  || fail "INV-DEADLOCK: interlocking.ts does not reference the single-track block bS2"

# INV-CONSERVATION / MAX_TICKS — the dispatcher caps the run so the deadlock
# terminates instead of hanging.
grep -qE "\bMAX_TICKS\b" "${SRC_DIR}/dispatcher.ts" \
  || fail "MAX_TICKS cap not found in dispatcher.ts (a deadlock would hang the run)"
ok "detection signatures"

# --- 5. Deterministic behavioural-invariant check --------------------------
echo "==> running deterministic timetable simulation (single run, no RNG)"
( cd "${PROJECT_DIR}" && npx --no-install tsx ../verify-runtime.mts ) \
  || fail "behavioural-invariant check failed (a guarantee was restored — defects partially absent?)"
ok "operating guarantees measurably violated"

echo "==> all checks passed"
