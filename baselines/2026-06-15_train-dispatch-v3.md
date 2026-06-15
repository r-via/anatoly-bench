# Anatoly Bench Score — train-dispatch

**Run:** `2026-06-15_074127` · Anatoly v0.9.6 (`94406c2-dirty`) · project main @ `60bdb75`
**Duration:** 3m 10s · **Cost:** $0.85 · **Tokens:** 63 in / 47K out

**Global F1:** 66.7%

**Scored axes:** correction

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN | Time | Cost | Out tokens |
|------|:------:|---:|------:|----------:|---:|---:|---:|-----:|-----:|-----------:|
| correction | ✓ | 66.7% | 66.7% | 66.7% | 4 | 2 | 2 | 8m 36s | $0.61 | 34K |
| utility | — | — | — | — | 0 | 0 | 0 | — | — | — |
| duplication | — | — | — | — | 0 | 0 | 0 | — | — | — |
| overengineering | — | — | — | — | 0 | 0 | 0 | — | — | — |
| tests | — | — | — | — | 0 | 0 | 0 | — | — | — |
| best-practices | — | — | — | — | 0 | 0 | 0 | — | — | — |
| documentation | — | — | — | — | 0 | 0 | 0 | 3m 23s | $0.24 | 13K |
| _refinement_ | — | — | — | — | — | — | — | 0s | $0.00 | 0 |

## Misses (2)

Cataloged violations that Anatoly did not flag.

- **[correction · trivial] INV-DWELL** — src/timetable.ts (DWELL_TICKS) — expected verdict `NEEDS_FIX` (numeric-target-contradicts-documented-dwell)
- **[correction · hard] INV-DEADLOCK** — src/interlocking.ts — expected verdict `NEEDS_FIX` (liveness-circular-wait-on-single-track)

## False positives (2)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[correction] `NEEDS_FIX`** — src/network.ts:52 (ADJACENCY) — _{ from: 'bE', to: 'bS2' } should be { from: 'bE', to: 'bD' }. BLOCK_INFO shows bE terminates at EASTLOOP and bD originates from EASTLOOP — the correct successor for bE is bD. Routing via bS2 forces tr…_
- **[correction] `NEEDS_FIX`** — src/routing.ts:21 (shortestPath) — _The `while (node !== undefined)` loop terminates when `parent.get(node)` returns `undefined` — which happens after adding `from` to the path, so the loop stops correctly only if `parent.get(from)` is …_

## Unscored findings (30)

Findings Anatoly emitted on axes that this fixture does not evaluate. Preserved here for visibility; not counted toward global F1.

### documentation (30)

- **[documentation] `UNDOCUMENTED`** — src/network.ts:3 (STATIONS) — _No JSDoc. Name and values are self-evident but the semantic role (station identifiers used as graph nodes) is undocumented._
- **[documentation] `UNDOCUMENTED`** — src/network.ts:6 (BLOCKS) — _No JSDoc. The purpose (exhaustive registry of all block IDs vs. a subset) is not documented._
- **[documentation] `UNDOCUMENTED`** — src/network.ts:10 (SINGLE_TRACK_BLOCKS) — _No JSDoc. The dispatcher uses this for interlocking constraints; that behavioral contract is not captured here._
- **[documentation] `UNDOCUMENTED`** — src/network.ts:21 (BLOCK_INFO) — _No JSDoc. The topology it encodes (junction names, loop endpoints) and its role as the authoritative block registry are undocumented._
- **[documentation] `UNDOCUMENTED`** — src/network.ts:32 (getTraversalTime) — _No JSDoc. Notably, the _block parameter is ignored and a fixed constant is always returned — a significant behavioral detail that is undocumented._
- **[documentation] `UNDOCUMENTED`** — src/network.ts:36 (getBlockInfo) — _No JSDoc. Undefined return for unknown block IDs is a caller-visible contract that is not documented._
- **[documentation] `UNDOCUMENTED`** — src/network.ts:45 (ADJACENCY) — _No JSDoc. Bidirectional single-track entries (bS1↔bS2, bM2↔bS1) encode important topology that is undocumented._
- **[documentation] `UNDOCUMENTED`** — src/network.ts:57 (getNextBlocks) — _No JSDoc. Direction semantics (outbound only, per ADJACENCY 'from' field) and empty-array return for terminal blocks are undocumented._
- **[documentation] `UNDOCUMENTED`** — src/interlocking.ts:6 (resetInterlocking) — _Exported public API with no JSDoc. Name suggests a reset but doesn't document that it clears both blockHolder and sectionReservation, nor intended usage context (e.g., simulation restart)._
- **[documentation] `UNDOCUMENTED`** — src/interlocking.ts:11 (isBlockFree) — _Exported public API with no JSDoc. Signature accepts both block and currentBlock but the implementation checks currentBlock in blockHolder and ignores block entirely — a critical non-obvious contract …_
- **[documentation] `UNDOCUMENTED`** — src/interlocking.ts:16 (occupyBlock) — _Exported public API with no JSDoc. No documentation on side effects or expected call ordering relative to isBlockFree/releaseBlock._
- **[documentation] `UNDOCUMENTED`** — src/interlocking.ts:20 (releaseBlock) — _Exported public API with no JSDoc. The _train parameter is silently ignored (any caller can release any block), which is a notable and unsafe contract worth documenting._
- **[documentation] `UNDOCUMENTED`** — src/interlocking.ts:24 (reserveSectionBlock) — _Exported public API with no JSDoc. Complex behavior: silently no-ops for blocks other than bS1/bS2, enforces mutual exclusion only for those two hardcoded IDs, and returns a boolean result — all undoc…_
- **[documentation] `UNDOCUMENTED`** — src/interlocking.ts:34 (releaseSingleTrack) — _Exported public API with no JSDoc. Hardcoded to release only bS1/bS2; the coupling to reserveSectionBlock and when this must be called relative to releaseBlock is undocumented._
- **[documentation] `UNDOCUMENTED`** — src/timetable.ts:3 (DWELL_TICKS) — _No JSDoc. Name implies station stop duration in ticks, but what constitutes a 'dwell' event and why 6 ticks is the chosen value are undocumented._
- **[documentation] `UNDOCUMENTED`** — src/timetable.ts:4 (MIN_HEADWAY) — _No JSDoc. Railway term with an implicit tick unit; the enforcement semantics (time since last entry per block) are only discoverable by tracing to canEnterBlock._
- **[documentation] `UNDOCUMENTED`** — src/timetable.ts:5 (ON_TIME_SLACK) — _No JSDoc. The additive tolerance window over scheduledArrival and its tick unit are undocumented; purpose is only revealed by tracing to computeOnTimeRate._
- **[documentation] `UNDOCUMENTED`** — src/timetable.ts:7 (TrainSpec) — _No block-level JSDoc. id/priority/route are self-explanatory, but depart and scheduledArrival carry an implicit tick unit that is not stated, and the semantic distinction between them (dispatch tick v…_
- **[documentation] `UNDOCUMENTED`** — src/timetable.ts:15 (TIMETABLE) — _No JSDoc. As the central simulation fixture consumed by dispatcher, formatter, and KPI modules, it warrants at minimum a comment explaining the scenario it models and the coordinate system (tick 0 = s…_
- **[documentation] `UNDOCUMENTED`** — src/signals.ts:6 (resetSignals) — _Exported public API, no JSDoc. Missing: why callers must invoke this (e.g. between simulation runs), and what state is cleared._
- **[documentation] `UNDOCUMENTED`** — src/signals.ts:10 (canEnterBlock) — _Exported public API, no JSDoc. The `_train` parameter is silently ignored, the `MIN_HEADWAY - 1` off-by-one is non-obvious, and the return semantics (false = signal red) are undocumented. All require …_
- **[documentation] `UNDOCUMENTED`** — src/signals.ts:17 (recordEntry) — _Exported public API, no JSDoc. Missing: callers must invoke this immediately after a train enters a block, and it is the prerequisite for `canEnterBlock` to enforce headway._
- **[documentation] `UNDOCUMENTED`** — src/dispatcher.ts:20 (ActiveTrain) — _Internal interface with no JSDoc. Most fields are self-descriptive, but `ticksOnBlock` and `dwellRemaining` encode distinct timing phases (traversal vs station stop) whose interaction is non-obvious —…_
- **[documentation] `UNDOCUMENTED`** — src/dispatcher.ts:28 (runSchedule) — _Primary exported function with no JSDoc/TSDoc. Missing: description of the tick-driven loop, return type semantics (SimulationReport fields), side-effect-free guarantee, and the early-exit condition. …_
- **[documentation] `UNDOCUMENTED`** — src/format.ts:4 (formatTimetable) — _No JSDoc comment. Missing description of output format, column layout, and that it renders the static TIMETABLE constant as a fixed-width ASCII table._
- **[documentation] `UNDOCUMENTED`** — src/format.ts:16 (formatReport) — _No JSDoc comment. Missing description of the parameter fields consumed, output format, and how stranded vs. on-time arrivals are represented in the returned string._
- **[documentation] `UNDOCUMENTED`** — src/telemetry.ts:3 (MovementRecorder) — _No JSDoc on the class, nor on its two public methods `recordOccupancy` and `recordArrival`. The public fields `arrivals` and `occupancy` are also undocumented. The class purpose (recording train movem…_
- **[documentation] `UNDOCUMENTED`** — src/kpi.ts:4 (computeOnTimeRate) — _No JSDoc comment. Non-obvious semantics include: rate is computed per-train (not per-arrival), a train is on-time if ANY record satisfies the slack condition, and the function returns 1 when the timet…_
- **[documentation] `UNDOCUMENTED`** — src/priority.ts:8 (compareTrains) — _No JSDoc comment. The comparator sorts by `trainId` in descending order (higher IDs have higher priority), but this is non-obvious and undocumented. Missing: purpose, sort direction rationale, paramet…_
- **[documentation] `UNDOCUMENTED`** — src/routing.ts:4 (shortestPath) — _No JSDoc comment. Missing description of algorithm (BFS), parameter semantics, return value (ordered list of BlockIds or null when no path exists), and behavior when from === to._

