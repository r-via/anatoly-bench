# Anatoly Bench Score — train-dispatch

**Run:** `2026-06-15_083719` · Anatoly v0.9.6 (`c56a3e4-dirty`) · project main @ `60bdb75`
**Duration:** 2m 47s · **Cost:** $0.83 · **Tokens:** 60 in / 39K out

**Global F1:** 72.7%

**Scored axes:** correction

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN | Time | Cost | Out tokens |
|------|:------:|---:|------:|----------:|---:|---:|---:|-----:|-----:|-----------:|
| correction | ✓ | 72.7% | 66.7% | 80.0% | 4 | 1 | 2 | 7m 23s | $0.56 | 28K |
| utility | — | — | — | — | 0 | 0 | 0 | — | — | — |
| duplication | — | — | — | — | 0 | 0 | 0 | — | — | — |
| overengineering | — | — | — | — | 0 | 0 | 0 | — | — | — |
| tests | — | — | — | — | 0 | 0 | 0 | — | — | — |
| best-practices | — | — | — | — | 0 | 0 | 0 | — | — | — |
| documentation | — | — | — | — | 0 | 0 | 0 | 2m 59s | $0.27 | 11K |
| _refinement_ | — | — | — | — | — | — | — | 0s | $0.00 | 0 |

## Misses (2)

Cataloged violations that Anatoly did not flag.

- **[correction · trivial] INV-DWELL** — src/timetable.ts (DWELL_TICKS) — expected verdict `NEEDS_FIX` (numeric-target-contradicts-documented-dwell)
- **[correction · hard] INV-DEADLOCK** — src/interlocking.ts — expected verdict `NEEDS_FIX` (liveness-circular-wait-on-single-track)

## False positives (1)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[correction] `NEEDS_FIX`** — src/dispatcher.ts:108 (runSchedule) — _`reserveSectionBlock(nextBlock, trainId)` is called (and commits a reservation on success) before `isBlockFree` and `canEnterBlock` are checked. If either subsequent gate returns false the function co…_

## Unscored findings (31)

Findings Anatoly emitted on axes that this fixture does not evaluate. Preserved here for visibility; not counted toward global F1.

### documentation (31)

- **[documentation] `UNDOCUMENTED`** — src/network.ts:3 (STATIONS) — _No JSDoc. Exported public API; no description of what these identifiers represent in the network topology._
- **[documentation] `UNDOCUMENTED`** — src/network.ts:6 (BLOCKS) — _No JSDoc. Purpose (exhaustive list? ordered list? differs from BLOCK_INFO how?) is not explained._
- **[documentation] `UNDOCUMENTED`** — src/network.ts:10 (SINGLE_TRACK_BLOCKS) — _No JSDoc. The interlocking semantics — why these blocks are constrained and how consumers must enforce that constraint — are undocumented._
- **[documentation] `UNDOCUMENTED`** — src/network.ts:12 (BlockInfo) — _No JSDoc. Fields id/from/to are self-explanatory, but traversalTime lacks unit documentation (ticks? seconds?) and no interface-level description explains the coordinate system for 'from'/'to' (statio…_
- **[documentation] `UNDOCUMENTED`** — src/network.ts:21 (BLOCK_INFO) — _No JSDoc. No explanation of what junction labels like 'JCT', 'WESTLOOP', 'EASTLOOP', 'bS1_end', 'bS2_start' mean or how this list relates to BLOCKS._
- **[documentation] `UNDOCUMENTED`** — src/network.ts:32 (getTraversalTime) — _No JSDoc. Non-obvious behavior: parameter is unused (prefixed _block) and the function always returns the constant T regardless of block identity. This stub contract is undocumented._
- **[documentation] `UNDOCUMENTED`** — src/network.ts:36 (getBlockInfo) — _No JSDoc. No documentation on param, return type, or when undefined is returned._
- **[documentation] `UNDOCUMENTED`** — src/network.ts:45 (ADJACENCY) — _No JSDoc. Directionality rules (bidirectional entries for bS1↔bS2 and bS2↔bM2 path) and the graph's relationship to physical topology are unexplained._
- **[documentation] `UNDOCUMENTED`** — src/network.ts:57 (getNextBlocks) — _No JSDoc. No param, return, or behavior documentation (e.g. empty array vs null for terminal blocks)._
- **[documentation] `UNDOCUMENTED`** — src/interlocking.ts:6 (resetInterlocking) — _Exported public API with no JSDoc. Clears both blockHolder and sectionReservation; callers need to know this resets all interlocking state globally._
- **[documentation] `UNDOCUMENTED`** — src/interlocking.ts:11 (isBlockFree) — _Exported public API with no JSDoc. Critically non-obvious: the `block` parameter is ignored — the lookup uses `currentBlock`, not `block`. This asymmetry demands documentation but has none._
- **[documentation] `UNDOCUMENTED`** — src/interlocking.ts:16 (occupyBlock) — _Exported public API with no JSDoc. Simple operation but no description of preconditions or interaction with sectionReservation._
- **[documentation] `UNDOCUMENTED`** — src/interlocking.ts:20 (releaseBlock) — _Exported public API with no JSDoc. The `_train` parameter is intentionally unused (prefixed underscore), which is non-obvious to callers and undocumented._
- **[documentation] `UNDOCUMENTED`** — src/interlocking.ts:24 (reserveSectionBlock) — _Exported public API with no JSDoc. Complex logic: silently succeeds for non-section blocks (bS1/bS2), implements mutual exclusion for those blocks, returns false on conflict. None of this is documente…_
- **[documentation] `UNDOCUMENTED`** — src/interlocking.ts:34 (releaseSingleTrack) — _Exported public API with no JSDoc. Hardcoded block IDs bS1/bS2 and the concept of a 'single track section' are undocumented; callers cannot tell when to call this vs releaseBlock._
- **[documentation] `UNDOCUMENTED`** — src/timetable.ts:3 (DWELL_TICKS) — _No JSDoc. Units (ticks) and semantic meaning (station dwell duration) are implicit. README further contradicts this value (says 2 ticks, code is 6)._
- **[documentation] `UNDOCUMENTED`** — src/timetable.ts:4 (MIN_HEADWAY) — _No JSDoc. No inline comment clarifying that the unit is ticks or that this enforces block-entry spacing._
- **[documentation] `UNDOCUMENTED`** — src/timetable.ts:5 (ON_TIME_SLACK) — _No JSDoc. The name alone does not convey that it is an additive tick tolerance applied to scheduledArrival, nor its unit._
- **[documentation] `UNDOCUMENTED`** — src/timetable.ts:7 (TrainSpec) — _No JSDoc on the interface or any field. Non-obvious semantics: depart and scheduledArrival are tick-based, route is an ordered list of BlockIds, and priority maps to a custom enum — none of this is do…_
- **[documentation] `UNDOCUMENTED`** — src/timetable.ts:15 (TIMETABLE) — _No JSDoc. No comment explaining the scenario being modeled, the tick scale, or why certain trains share departure ticks. Consumed by dispatcher, formatter, and KPI modules — a brief description of int…_
- **[documentation] `UNDOCUMENTED`** — src/signals.ts:6 (resetSignals) — _No JSDoc. Exported public API with no explanation of when callers must invoke it (e.g., between simulation runs) or what state it clears._
- **[documentation] `UNDOCUMENTED`** — src/signals.ts:10 (canEnterBlock) — _No JSDoc. The `_train` parameter is silently unused, the `MIN_HEADWAY - 1` offset is unexplained, and there is no description of the headway-enforcement contract or return semantics._
- **[documentation] `UNDOCUMENTED`** — src/signals.ts:17 (recordEntry) — _No JSDoc. Exported public API; callers must know to call this after every successful block entry to keep headway state consistent, but that contract is undocumented._
- **[documentation] `UNDOCUMENTED`** — src/dispatcher.ts:20 (ActiveTrain) — _Internal, non-exported interface with no JSDoc. Most fields are self-explanatory, but the distinction between ticksOnBlock (traversal progress counter) and dwellRemaining (station hold-down counter) i…_
- **[documentation] `UNDOCUMENTED`** — src/dispatcher.ts:28 (runSchedule) — _Exported public API with no JSDoc/TSDoc. README covers high-level usage but the function itself carries no inline documentation describing its return value shape, side-effects (resets signals and inte…_
- **[documentation] `UNDOCUMENTED`** — src/format.ts:4 (formatTimetable) — _No JSDoc comment. Exported public function with non-obvious output format (column widths, separator line, field ordering) — purpose and output structure are not documented._
- **[documentation] `UNDOCUMENTED`** — src/format.ts:16 (formatReport) — _No JSDoc comment. Exported public function whose output structure (tick count, on-time rate percentage, per-arrival stranded/arrived lines) is non-trivial and undocumented._
- **[documentation] `UNDOCUMENTED`** — src/routing.ts:4 (shortestPath) — _No JSDoc/TSDoc comment. Missing description of BFS algorithm, parameter semantics (what constitutes a valid BlockId pair), return value (null means unreachable vs. same-node shortcut), and any constra…_
- **[documentation] `UNDOCUMENTED`** — src/telemetry.ts:3 (MovementRecorder) — _No JSDoc on the class or either method. Purpose (recording train arrivals and block occupancy during simulation), parameters, and the distinction between the two record types are not documented._
- **[documentation] `UNDOCUMENTED`** — src/kpi.ts:4 (computeOnTimeRate) — _No JSDoc comment. Exported public function with non-obvious semantics: counts trains from TIMETABLE that had at least one on-time arrival (not all arrivals), uses ON_TIME_SLACK threshold, and returns …_
- **[documentation] `UNDOCUMENTED`** — src/priority.ts:8 (compareTrains) — _No JSDoc comment. Comparator sorts by trainId descending (higher IDs first), which is a non-obvious ordering choice. Missing: description of sort direction, what the return value means for the caller'…_

