#!/usr/bin/env bash
# Evolve --check script for the task-vault fixture.
#
# Convergence conditions (all must pass):
#   1. project/ typechecks under tsc --noEmit
#   2. The public barrel re-exports exactly the public surface, and exactly the
#      12-module layout is present (no extra modules, none missing)
#   3. The live internal helpers, mutators and effects are genuinely wired in
#      (referenced by >= 2 modules), so a correct audit never flags them dead
#   4. Each of the 10 cataloged dead exports is present in source AND referenced
#      by no other module (genuinely orphaned, which is what makes it dead)
#   5. Each defective flow keeps the exact structural shape its catalog entry
#      describes (a redundant twin still reaches the shared effect; an
#      inconsistent sibling reaches the effect but NOT the named guard; an
#      over-indirect chain keeps each pass-through hop; an unwired orphan reaches
#      no effect; the user store and the outbox stay asymmetric)
#   6. The public API behaves correctly when driven at runtime by
#      verify-runtime.mts (the convergence target; no RNG, single run)
#
# This script is invoked from inside catalog/task-vault/project/ by Evolve but
# operates on paths relative to the fixture root (one level up).

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

# files_with SYMBOL — lists the src modules that reference SYMBOL as a whole word.
files_with() {
  grep -rlE "\b$1\b" "${SRC_DIR}" 2>/dev/null || true
}

# func_body SYMBOL FILE — prints the body of a top-level function declaration,
# from its signature line to its closing brace at column zero. The SPEC mandates
# `function` declarations (no arrow consts) with the closing brace at column 0
# and nested braces indented, so the first `^}` is unambiguously the function's
# end. This is how we confirm which guards and effects a parcours reaches.
func_body() {
  local name="$1" file="$2"
  awk -v fn="$name" '
    $0 ~ "^(export )?(async )?function " fn "\\(" { capturing = 1 }
    capturing { print }
    capturing && /^}/ { exit }
  ' "$file"
}

# assert_reaches SYMBOL FILE TARGET — SYMBOL'\''s body must reference TARGET (it
# reaches that guard, hop, or effect).
assert_reaches() {
  local sym="$1" file="$2" target="$3"
  func_body "${sym}" "${SRC_DIR}/${file}" | grep -qE "\b${target}\b" \
    || fail "${sym} (src/${file}) must reach ${target} but does not"
}

# assert_not_reaches SYMBOL FILE TARGET — SYMBOL'\''s body must NOT reference
# TARGET (the guard a sibling performs that this inconsistent sibling omits, or
# an effect an unwired orphan must never reach).
assert_not_reaches() {
  local sym="$1" file="$2" target="$3"
  if func_body "${sym}" "${SRC_DIR}/${file}" | grep -qE "\b${target}\b"; then
    fail "${sym} (src/${file}) must NOT reach ${target} (that defect shape is the deliverable)"
  fi
}

# The terminal effects of the domain. An unwired-flow orphan must reach none of
# them. readTask / readProject / readUser are pure reads, NOT effects, so they
# are excluded (the orphans do call them).
EFFECTS="insertTask markTaskDone markTaskOpen removeTask setTaskNote \
         setTaskAssignee insertProject archiveProjectRecord setProjectName \
         insertUser enqueueNotice appendLog"

# assert_no_effect SYMBOL FILE — SYMBOL'\''s body reaches no terminal effect; it
# is a genuine unwired (dead-intent) flow.
assert_no_effect() {
  local sym="$1" file="$2" body e
  body="$(func_body "${sym}" "${SRC_DIR}/${file}")"
  for e in ${EFFECTS}; do
    if printf '%s\n' "${body}" | grep -qE "\b${e}\b"; then
      fail "${sym} (src/${file}) reaches effect ${e}; it must be an unwired flow (no effect)"
    fi
  done
}

# assert_orphan SYMBOL DEFINING_FILE — the symbol must exist in its defining file
# and be referenced by NO other module. That orphan status is exactly what makes
# the cataloged dead export dead; wiring it in (or moving it) fails here.
assert_orphan() {
  local symbol="$1" def="$2"
  grep -qE "\b${symbol}\b" "${SRC_DIR}/${def}" \
    || fail "${symbol} not found in src/${def} (the dead export must be present)"
  local hits n
  hits="$(files_with "${symbol}")"
  n="$(printf '%s\n' "${hits}" | grep -c . || true)"
  [ "${n}" -eq 1 ] \
    || fail "${symbol} must be referenced by exactly its defining module (found in ${n}: ${hits//$'\n'/, }); it appears to have been wired in"
  [ "${hits}" = "${SRC_DIR}/${def}" ] \
    || fail "${symbol} is referenced from ${hits} instead of only src/${def}"
}

# assert_used SYMBOL — a live helper/mutator/command must be referenced by at
# least two modules (its definition plus at least one consumer, or its module
# plus the re-export barrel), so a correct audit never flags it dead. This is the
# false-positive side of the catalog.
assert_used() {
  local symbol="$1" n
  n="$(files_with "${symbol}" | grep -c . || true)"
  [ "${n}" -ge 2 ] \
    || fail "${symbol} is referenced by only ${n} module(s); the live wiring is missing (it would read as dead)"
}

# assert_absent PATTERN WHY — the pattern must not occur anywhere in src. Used to
# keep the user store and the outbox asymmetric (no teardown / no drain).
assert_absent() {
  local pat="$1" why="$2"
  if grep -rqE "${pat}" "${SRC_DIR}" 2>/dev/null; then
    fail "forbidden pattern /${pat}/ present: ${why}"
  fi
}

# --- 1. Typecheck -----------------------------------------------------------
[ -d "${PROJECT_DIR}" ] || fail "project/ directory missing"
[ -f "${PROJECT_DIR}/package.json" ] || fail "project/package.json missing"
[ -f "${PROJECT_DIR}/tsconfig.json" ] || fail "project/tsconfig.json missing"

echo "==> typechecking project/"
( cd "${PROJECT_DIR}" && npx --no-install tsc --noEmit ) \
  || fail "tsc --noEmit failed"
ok "typecheck"

# --- 2. Public barrel + exact module layout ---------------------------------
[ -f "${SRC_DIR}/index.ts" ] || fail "src/index.ts missing"

# Every public command, query and the constructor is re-exported from the barrel.
for sym in createVault \
           addTask completeTask reopenTask removeTaskCmd importTask forceComplete \
           noteTask annotateTask completeViaPipeline assignViaRouter \
           createProject archiveProject rushArchive renameProject retitleProject announceProject \
           registerUser seedUser notifyAssignee \
           loadSummary loadProjectReport; do
  grep -qE "\b${sym}\b" "${SRC_DIR}/index.ts" \
    || fail "${sym} not re-exported from src/index.ts"
done

# No dead export may leak into the public barrel.
for sym in assignTask previewTask touchTask summarizeArchive pingUser \
           buildDigest recountOpen computeBacklog LEGACY_TEMPLATE LegacyVault; do
  if grep -qE "\b${sym}\b" "${SRC_DIR}/index.ts"; then
    fail "${sym} is a dead export and must NOT appear in src/index.ts"
  fi
done

for f in index.ts types.ts ids.ts store.ts audit.ts notify.ts format.ts \
         tasks.ts projects.ts users.ts query.ts legacy.ts; do
  [ -f "${SRC_DIR}/${f}" ] || fail "src/${f} missing"
done

# Exactly the twelve specified modules — a stray module risks an accidental dead
# export that would corrupt the catalog's precision.
n_src="$(find "${SRC_DIR}" -maxdepth 1 -name '*.ts' | grep -c . || true)"
[ "${n_src}" -eq 12 ] \
  || fail "src/ must contain exactly 12 .ts modules, found ${n_src} (no extra modules allowed)"
ok "public barrel + module layout"

# --- 3. Live wiring present (false-positive guard) --------------------------
# Public commands and queries (live via the re-export barrel).
for sym in createVault \
           addTask completeTask reopenTask removeTaskCmd importTask forceComplete \
           noteTask annotateTask completeViaPipeline assignViaRouter \
           createProject archiveProject rushArchive renameProject retitleProject announceProject \
           registerUser seedUser notifyAssignee \
           loadSummary loadProjectReport; do
  assert_used "${sym}"
done
# Internal mutators, effects and pure helpers (live via a real consumer).
for sym in insertTask markTaskDone markTaskOpen removeTask setTaskNote \
           setTaskAssignee insertProject archiveProjectRecord setProjectName \
           insertUser readTask readProject readUser appendLog enqueueNotice \
           nextId formatTask formatProject summarizeCounts renderLine isBlank; do
  assert_used "${sym}"
done
ok "live wiring"

# --- 4. Cataloged dead exports present-but-orphaned -------------------------
assert_orphan assignTask tasks.ts          # DEAD-ASSIGN (no out-edge, utility only)
assert_orphan computeBacklog legacy.ts     # DEAD-BACKLOG
assert_orphan LEGACY_TEMPLATE format.ts    # DEAD-TEMPLATE
assert_orphan LegacyVault legacy.ts        # DEAD-LEGACY-TYPE
assert_orphan previewTask tasks.ts         # DEAD-PREVIEW (also unwired_flow)
assert_orphan touchTask tasks.ts           # DEAD-TOUCH
assert_orphan summarizeArchive projects.ts # DEAD-ARCHIVE-SUMMARY
assert_orphan pingUser users.ts            # DEAD-PING
assert_orphan buildDigest query.ts         # DEAD-DIGEST
assert_orphan recountOpen query.ts         # DEAD-RECOUNT
ok "dead exports present and orphaned"

# --- 5. Flow shapes ---------------------------------------------------------
# 5a. unwired_flow: the six dead orphans resolve out-edges but reach no effect.
assert_no_effect previewTask tasks.ts
assert_no_effect touchTask tasks.ts
assert_no_effect summarizeArchive projects.ts
assert_no_effect pingUser users.ts
assert_no_effect buildDigest query.ts
assert_no_effect recountOpen query.ts

# 5b. redundant_flow: both twins reach the same effect; the shared effect is
# reached by no correct command (so no control is twinned).
assert_reaches noteTask tasks.ts setTaskNote
assert_reaches annotateTask tasks.ts setTaskNote
assert_reaches renameProject projects.ts setProjectName
assert_reaches retitleProject projects.ts setProjectName

# 5c. inconsistent_siblings: the deficient sibling reaches the effect but omits
# the named guard the well-formed sibling performs.
assert_reaches addTask tasks.ts isBlank          # reference (well-formed)
assert_reaches addTask tasks.ts insertTask
assert_reaches importTask tasks.ts insertTask    # deficient sibling
assert_not_reaches importTask tasks.ts isBlank
assert_reaches completeTask tasks.ts readTask    # reference
assert_reaches completeTask tasks.ts markTaskDone
assert_reaches forceComplete tasks.ts markTaskDone
assert_not_reaches forceComplete tasks.ts readTask
assert_reaches archiveProject projects.ts readProject  # reference
assert_reaches archiveProject projects.ts archiveProjectRecord
assert_reaches rushArchive projects.ts archiveProjectRecord
assert_not_reaches rushArchive projects.ts readProject
assert_reaches registerUser users.ts readUser    # reference
assert_reaches registerUser users.ts insertUser
assert_reaches seedUser users.ts insertUser
assert_not_reaches seedUser users.ts readUser

# 5d. over_indirect: each chain keeps every private pass-through hop.
assert_reaches completeViaPipeline tasks.ts stageResolve
assert_reaches stageResolve tasks.ts stageApply
assert_reaches stageApply tasks.ts stageCommit
assert_reaches stageCommit tasks.ts markTaskDone
assert_reaches assignViaRouter tasks.ts routeAssign
assert_reaches routeAssign tasks.ts dispatchAssign
assert_reaches dispatchAssign tasks.ts setTaskAssignee
assert_reaches announceProject projects.ts buildPayload
assert_reaches buildPayload projects.ts wrapPayload
assert_reaches wrapPayload projects.ts routePayload
assert_reaches routePayload projects.ts enqueueNotice

# 5e. effect_asymmetry: the user store and the outbox have no teardown/drain.
assert_reaches registerUser users.ts insertUser
assert_reaches notifyAssignee users.ts enqueueNotice
assert_absent '\b(removeUser|deleteUser|dropUser|archiveUser)\b' \
  "a user teardown mutator would repair FLOW-ASYMMETRY-USER"
assert_absent '\.users\.delete\b' \
  "deleting from the users Map would repair FLOW-ASYMMETRY-USER"
assert_absent '\b(drainOutbox|flushOutbox|clearOutbox|readOutbox|consumeOutbox)\b' \
  "an outbox drain would repair FLOW-ASYMMETRY-OUTBOX"
assert_absent '\.outbox\.(shift|splice|pop)\b' \
  "consuming the outbox would repair FLOW-ASYMMETRY-OUTBOX"
ok "flow shapes"

# --- 6. Runtime behaviour of the public API ---------------------------------
echo "==> driving the public API (single deterministic run, no RNG)"
( cd "${PROJECT_DIR}" && npx --no-install tsx ../verify-runtime.mts ) \
  || fail "public API runtime check failed (the live surface is broken)"
ok "public API behaves correctly"

echo "==> all checks passed"
