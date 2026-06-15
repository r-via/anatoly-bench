# Anatoly Bench Score — train-dispatch

**Run:** `2026-06-15_112827` · Anatoly v0.9.6 (`78e46eb-dirty`) · project main @ `60bdb75`
**Duration:** 2m 40s · **Cost:** $0.99 · **Tokens:** 60 in / 37K out

**Global F1:** 80.0%

**Scored axes:** correction

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN | Time | Cost | Out tokens |
|------|:------:|---:|------:|----------:|---:|---:|---:|-----:|-----:|-----------:|
| correction | ✓ | 80.0% | 66.7% | 100.0% | 4 | 0 | 2 | 6m 52s | $0.52 | 25K |
| utility | — | — | — | — | 0 | 0 | 0 | — | — | — |
| duplication | — | — | — | — | 0 | 0 | 0 | — | — | — |
| overengineering | — | — | — | — | 0 | 0 | 0 | — | — | — |
| tests | — | — | — | — | 0 | 0 | 0 | — | — | — |
| best-practices | — | — | — | — | 0 | 0 | 0 | — | — | — |
| documentation | — | — | — | — | 0 | 0 | 0 | 3m 24s | $0.34 | 11K |
| _refinement_ | — | — | — | — | — | — | — | 51s | $0.13 | 3K |

## Misses (2)

Cataloged violations that Anatoly did not flag.

- **[correction · trivial] INV-DWELL** — src/timetable.ts (DWELL_TICKS) — expected verdict `NEEDS_FIX` (numeric-target-contradicts-documented-dwell)
- **[correction · hard] INV-DEADLOCK** — src/interlocking.ts — expected verdict `NEEDS_FIX` (liveness-circular-wait-on-single-track)

## Unscored findings (30)

Findings Anatoly emitted on axes that this fixture does not evaluate. Preserved here for visibility; not counted toward global F1.

### documentation (30)

- **[documentation] `UNDOCUMENTED`** — src/interlocking.ts:6 (resetInterlocking) — _No JSDoc. Exported public API. Clears both maps — intended call site (simulation reset) and side effects are undocumented._
- **[documentation] `UNDOCUMENTED`** — src/interlocking.ts:11 (isBlockFree) — _No JSDoc. Exported and critically non-obvious: the `block` parameter is entirely unused; the check is against `currentBlock`. This asymmetry between the declared intent and the actual lookup is a docu…_
- **[documentation] `UNDOCUMENTED`** — src/interlocking.ts:16 (occupyBlock) — _No JSDoc. Exported public API. No documentation on preconditions (caller must call isBlockFree first) or relationship to reserveSectionBlock._
- **[documentation] `UNDOCUMENTED`** — src/interlocking.ts:20 (releaseBlock) — _No JSDoc. The `_train` parameter is silently ignored, which is surprising — no comment explains why train identity is not validated on release._
- **[documentation] `UNDOCUMENTED`** — src/interlocking.ts:24 (reserveSectionBlock) — _No JSDoc. Exported public API with complex, non-obvious behavior: silently no-ops for all blocks except hardcoded bS1/bS2, returns false when another train holds the reservation. The single-track cons…_
- **[documentation] `UNDOCUMENTED`** — src/interlocking.ts:34 (releaseSingleTrack) — _No JSDoc. Exported public API. The hardcoded bS1/bS2 scope and the pairing with reserveSectionBlock are undocumented. Callers cannot know when to call this vs releaseBlock._
- **[documentation] `UNDOCUMENTED`** — src/dispatcher.ts:28 (runSchedule) — _Exported public API with no JSDoc comment. The README documents it in prose, but no TSDoc block appears on the function itself — no @returns describing SimulationReport fields, no note on the early-ex…_
- **[documentation] `UNDOCUMENTED`** — src/network.ts:3 (STATIONS) — _No JSDoc. Name implies station identifiers but nothing explains what these stations represent in the network topology._
- **[documentation] `UNDOCUMENTED`** — src/network.ts:6 (BLOCKS) — _No JSDoc. No explanation of whether this is an exhaustive list, an ordered list, or what it is used for relative to BLOCK_INFO._
- **[documentation] `UNDOCUMENTED`** — src/network.ts:10 (SINGLE_TRACK_BLOCKS) — _No JSDoc. The name hints at single-track topology but the interlocking/collision-avoidance semantics enforced by the dispatcher are not described._
- **[documentation] `UNDOCUMENTED`** — src/network.ts:12 (BlockInfo) — _No JSDoc. `traversalTime` lacks unit documentation (ticks? seconds?). `from`/`to` are untyped strings mixing station names and junction labels (e.g. 'JCT', 'WESTLOOP') — semantics not explained._
- **[documentation] `UNDOCUMENTED`** — src/network.ts:21 (BLOCK_INFO) — _No JSDoc. Encodes the physical network layout including junction node labels ('JCT', 'WESTLOOP', 'EASTLOOP') that do not appear in STATIONS — this non-obvious topology is undocumented._
- **[documentation] `UNDOCUMENTED`** — src/network.ts:32 (getTraversalTime) — _No JSDoc. The `_block` parameter is ignored and a constant is always returned — this stub-like behavior and its intended future semantics are undocumented._
- **[documentation] `UNDOCUMENTED`** — src/network.ts:36 (getBlockInfo) — _No JSDoc. Missing documentation on the undefined return case and what callers should do when a block is not found._
- **[documentation] `UNDOCUMENTED`** — src/network.ts:45 (ADJACENCY) — _No JSDoc. The graph contains bidirectional entries for the single-track loop (bS1↔bS2) alongside unidirectional edges — this directionality convention is undocumented and consumed by the routing algor…_
- **[documentation] `UNDOCUMENTED`** — src/network.ts:57 (getNextBlocks) — _No JSDoc. Missing documentation on directionality semantics, what an empty result means, and that it relies on the ADJACENCY graph._
- **[documentation] `UNDOCUMENTED`** — src/timetable.ts:3 (DWELL_TICKS) — _No JSDoc. README also contradicts this value (documents 2 ticks; constant is 6)._
- **[documentation] `UNDOCUMENTED`** — src/timetable.ts:4 (MIN_HEADWAY) — _No JSDoc. README mentions the 3-tick headway rule but the constant itself carries no inline documentation._
- **[documentation] `UNDOCUMENTED`** — src/timetable.ts:5 (ON_TIME_SLACK) — _No JSDoc. Neither the constant's purpose (tolerance window added to scheduledArrival) nor its unit is documented._
- **[documentation] `UNDOCUMENTED`** — src/timetable.ts:7 (TrainSpec) — _No JSDoc on the interface or any field. Non-obvious semantics include: tick unit for depart/scheduledArrival, what PriorityClass values are valid, and whether route is ordered._
- **[documentation] `UNDOCUMENTED`** — src/timetable.ts:15 (TIMETABLE) — _No JSDoc. Purpose, scenario coverage, and authoring conventions (e.g., block naming) are undocumented._
- **[documentation] `UNDOCUMENTED`** — src/signals.ts:6 (resetSignals) — _No JSDoc. Exported API. No description of when to call this (e.g., before a new simulation run) or what state is cleared._
- **[documentation] `UNDOCUMENTED`** — src/signals.ts:10 (canEnterBlock) — _No JSDoc. Exported API with non-obvious semantics: the `_train` parameter is silently unused, the off-by-one `MIN_HEADWAY - 1` comparison is unexplained, and the return value contract (true on first e…_
- **[documentation] `UNDOCUMENTED`** — src/signals.ts:17 (recordEntry) — _No JSDoc. Exported API. No description of when callers must invoke this relative to canEnterBlock, or the consequence of missing a call._
- **[documentation] `UNDOCUMENTED`** — src/format.ts:4 (formatTimetable) — _No JSDoc/TSDoc comment. Missing description of return format, column layout, or data source (TIMETABLE)._
- **[documentation] `UNDOCUMENTED`** — src/format.ts:16 (formatReport) — _No JSDoc/TSDoc comment. Missing description of the report parameter fields consumed, return format, and how stranded vs on-time arrivals are represented._
- **[documentation] `UNDOCUMENTED`** — src/routing.ts:4 (shortestPath) — _No JSDoc/TSDoc comment. Missing description of BFS algorithm used, what null return means, whether path includes both endpoints, and behavior when from === to._
- **[documentation] `UNDOCUMENTED`** — src/telemetry.ts:3 (MovementRecorder) — _No JSDoc on the class or either method. The class purpose (recording train movements and arrivals for telemetry/simulation reporting), the semantics of `tick`, and the relationship between `arrivals` …_
- **[documentation] `UNDOCUMENTED`** — src/kpi.ts:4 (computeOnTimeRate) — _No JSDoc comment. Non-obvious behaviors undocumented: return value is a ratio [0,1] not a percentage; returns 1 (not 0) when TIMETABLE is empty; train membership is sourced from TIMETABLE rather than …_
- **[documentation] `UNDOCUMENTED`** — src/priority.ts:8 (compareTrains) — _No JSDoc comment. The comparison logic sorts by `trainId` descending (higher ID = higher priority), which is a non-obvious convention. Missing: description of sort order/semantics, @param docs for `a`…_

