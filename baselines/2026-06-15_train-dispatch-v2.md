# Anatoly Bench Score — train-dispatch

**Run:** `2026-06-15_072744` · Anatoly v0.9.6 (`94406c2-dirty`) · project main @ `efb52c2`
**Duration:** 3m 27s · **Cost:** $1.06 · **Tokens:** 60 in / 54K out

**Global F1:** 50.0%

**Scored axes:** correction

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN | Time | Cost | Out tokens |
|------|:------:|---:|------:|----------:|---:|---:|---:|-----:|-----:|-----------:|
| correction | ✓ | 50.0% | 50.0% | 50.0% | 3 | 3 | 3 | 10m 38s | $0.72 | 42K |
| utility | — | — | — | — | 0 | 0 | 0 | — | — | — |
| duplication | — | — | — | — | 0 | 0 | 0 | — | — | — |
| overengineering | — | — | — | — | 0 | 0 | 0 | — | — | — |
| tests | — | — | — | — | 0 | 0 | 0 | — | — | — |
| best-practices | — | — | — | — | 0 | 0 | 0 | — | — | — |
| documentation | — | — | — | — | 0 | 0 | 0 | 3m 25s | $0.34 | 12K |
| _refinement_ | — | — | — | — | — | — | — | 0s | $0.00 | 0 |

## Misses (3)

Cataloged violations that Anatoly did not flag.

- **[correction · trivial] INV-DWELL** — src/timetable.ts (DWELL_TICKS) — expected verdict `NEEDS_FIX` (numeric-target-contradicts-documented-dwell)
- **[correction · medium] INV-HEADWAY** — src/signals.ts — expected verdict `NEEDS_FIX` (temporal-separation-invariant-underenforced-headway)
- **[correction · hard] INV-DEADLOCK** — src/interlocking.ts — expected verdict `NEEDS_FIX` (liveness-circular-wait-on-single-track)

## False positives (3)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[correction] `NEEDS_FIX`** — src/timetable.ts:47 (TIMETABLE) — _T5_EXP traverses bM2→bS1→bS2→bD while T6_LOC traverses bE→bS2→bS1→bM2 — opposite directions through shared blocks bM2, bS1, bS2 — both departing at tick 6. canEnterBlock checks only elapsed time since…_
- **[correction] `NEEDS_FIX`** — src/timetable.ts:62 (TIMETABLE) — _T7_LOC depart:1 follows T1_EXP depart:0 from the same first block bA; gap = 1 tick < MIN_HEADWAY = 3. canEnterBlock will deny T7 entry to bA until tick 3, so the actual departure is 2 ticks late; with…_
- **[correction] `NEEDS_FIX`** — src/timetable.ts:41 (TIMETABLE) — _T4_LOC depart:4 follows T3_FRT depart:2 from the same first block bA; gap = 2 ticks < MIN_HEADWAY = 3. canEnterBlock will deny T4 entry until tick 5, shifting the entire journey by 1 tick and invalida…_

## Unscored findings (30)

Findings Anatoly emitted on axes that this fixture does not evaluate. Preserved here for visibility; not counted toward global F1.

### documentation (30)

- **[documentation] `UNDOCUMENTED`** — src/network.ts:3 (STATIONS) — _No JSDoc. The list of valid station identifiers with no explanation of what stations represent or how the set was chosen._
- **[documentation] `UNDOCUMENTED`** — src/network.ts:6 (BLOCKS) — _No JSDoc. No explanation of what this enumeration of block IDs represents, how it relates to BLOCK_INFO, or whether ordering matters._
- **[documentation] `UNDOCUMENTED`** — src/network.ts:10 (SINGLE_TRACK_BLOCKS) — _No JSDoc. Critical interlocking constraint used by the dispatcher; the meaning of 'single track' and the enforcement rules are entirely absent._
- **[documentation] `UNDOCUMENTED`** — src/network.ts:12 (BlockInfo) — _Interface has no JSDoc. 'from'/'to' are untyped strings referencing node names rather than typed IDs. 'traversalTime' has no unit annotation; README says ticks but that is not captured here._
- **[documentation] `UNDOCUMENTED`** — src/network.ts:21 (BLOCK_INFO) — _No JSDoc. No explanation of the network topology it encodes, what JCT/WESTLOOP/EASTLOOP nodes are, or why 'from'/'to' sometimes reference non-BlockId strings._
- **[documentation] `UNDOCUMENTED`** — src/network.ts:32 (getTraversalTime) — _No JSDoc. The parameter is named '_block' indicating it is intentionally ignored (function always returns T=4), but this contract is never documented — callers cannot know the parameter is unused._
- **[documentation] `UNDOCUMENTED`** — src/network.ts:36 (getBlockInfo) — _No JSDoc. Missing documentation on the parameter, the undefined return case, and the source array it searches._
- **[documentation] `UNDOCUMENTED`** — src/network.ts:45 (ADJACENCY) — _No JSDoc. No explanation that this encodes a directed graph, that bidirectional single-track edges (bS1↔bS2, bM2↔bS1) are intentional, or how consumers should use it vs. getNextBlocks._
- **[documentation] `UNDOCUMENTED`** — src/network.ts:57 (getNextBlocks) — _No JSDoc. Missing documentation on return value (empty array vs. null for dead-ends), directionality semantics, and the backing data structure._
- **[documentation] `UNDOCUMENTED`** — src/interlocking.ts:6 (resetInterlocking) — _Exported public API. No JSDoc. Name implies clearing state, but there is no description of which state is cleared or when callers should invoke this (e.g., between simulation runs)._
- **[documentation] `UNDOCUMENTED`** — src/interlocking.ts:11 (isBlockFree) — _Exported public API. No JSDoc. The `block` parameter is entirely unused — occupancy is checked against `currentBlock`, not `block`. This counterintuitive signature critically needs documentation to ex…_
- **[documentation] `UNDOCUMENTED`** — src/interlocking.ts:16 (occupyBlock) — _Exported public API. No JSDoc. No description of when to call this relative to isBlockFree, or whether it overwrites an existing holder._
- **[documentation] `UNDOCUMENTED`** — src/interlocking.ts:20 (releaseBlock) — _Exported public API. No JSDoc. The `_train` parameter is suppressed and unused; this is a non-obvious design choice (any caller can release any block) that warrants explanation._
- **[documentation] `UNDOCUMENTED`** — src/interlocking.ts:24 (reserveSectionBlock) — _Exported public API. No JSDoc. Hardcodes block IDs bS1/bS2, silently passes all other blocks as reserved=true. This implicit allow-all behavior and the magic IDs need documentation._
- **[documentation] `UNDOCUMENTED`** — src/interlocking.ts:34 (releaseSingleTrack) — _Exported public API. No JSDoc. Releases all single-track reservations held by a given train, but hardcodes bS1/bS2 with no explanation of what constitutes the single-track section._
- **[documentation] `UNDOCUMENTED`** — src/timetable.ts:3 (DWELL_TICKS) — _No JSDoc. Name implies tick-unit dwell time but does not specify what 'dwell' means (station stop? signal hold?) or how consumers should interpret the value._
- **[documentation] `UNDOCUMENTED`** — src/timetable.ts:4 (MIN_HEADWAY) — _No JSDoc. Unit (ticks) and enforcement scope (per block, per route?) are undocumented; semantics must be inferred from canEnterBlock consumer._
- **[documentation] `UNDOCUMENTED`** — src/timetable.ts:5 (ON_TIME_SLACK) — _No JSDoc. Does not state unit (ticks), direction (added to scheduledArrival), or whether it applies symmetrically or only as a late-arrival grace window._
- **[documentation] `UNDOCUMENTED`** — src/timetable.ts:7 (TrainSpec) — _No block-level JSDoc. Most fields are readable, but 'depart' is abbreviated and its unit (tick number) is non-obvious; 'route' ordering semantics (first = origin, last = destination) are undocumented._
- **[documentation] `UNDOCUMENTED`** — src/timetable.ts:15 (TIMETABLE) — _No JSDoc. Purpose (static scenario fixture vs. production schedule), coordinate system for tick values, and extension guidelines are all absent._
- **[documentation] `UNDOCUMENTED`** — src/signals.ts:6 (resetSignals) — _Exported public API with no JSDoc. Missing: purpose (clear interlocking state between simulation runs), when callers must invoke it, and side-effect scope._
- **[documentation] `UNDOCUMENTED`** — src/signals.ts:10 (canEnterBlock) — _Exported public API with no JSDoc. Missing: description of the headway check, why MIN_HEADWAY - 1 is used (off-by-one relative to the 3-tick rule in README), the purpose of the unused _train parameter…_
- **[documentation] `UNDOCUMENTED`** — src/signals.ts:17 (recordEntry) — _Exported public API with no JSDoc. Missing: purpose (update interlocking state so canEnterBlock can enforce headway on subsequent calls), and that callers must invoke this after every committed block …_
- **[documentation] `UNDOCUMENTED`** — src/format.ts:4 (formatTimetable) — _No JSDoc comment. Missing description of output format (pipe-delimited table), what columns are rendered, and return value semantics._
- **[documentation] `UNDOCUMENTED`** — src/format.ts:16 (formatReport) — _No JSDoc comment. Missing description of the parameter, what fields are rendered, arrival status logic (stranded vs on-time), and return value format._
- **[documentation] `UNDOCUMENTED`** — src/dispatcher.ts:28 (runSchedule) — _No JSDoc on the sole exported public function. README covers its behavior externally, but the function itself has no inline TSDoc describing its return type, side effects (mutates signal/interlocking …_
- **[documentation] `UNDOCUMENTED`** — src/telemetry.ts:3 (MovementRecorder) — _No JSDoc on the class or its two methods. The class purpose (recording train movements for telemetry/simulation reporting), the semantics of `arrivals` and `occupancy` arrays, the meaning of `tick`, a…_
- **[documentation] `UNDOCUMENTED`** — src/routing.ts:4 (shortestPath) — _No JSDoc comment. Missing description of BFS algorithm used, parameter semantics (what constitutes a valid BlockId), return value (ordered path inclusive of endpoints, or null when unreachable), and t…_
- **[documentation] `UNDOCUMENTED`** — src/kpi.ts:4 (computeOnTimeRate) — _No JSDoc comment. Missing: purpose description, @param for arrivals, @returns explanation, and the edge-case behavior (returns 1 when timetable is empty)._
- **[documentation] `UNDOCUMENTED`** — src/priority.ts:8 (compareTrains) — _No JSDoc. The comparator applies reversed trainId ordering (higher ID wins) and silently ignores `insertionOrder`, both non-obvious design choices that require explanation. Used as the sort key in the…_

