[← Back to Documentation](./index.md) · [← Back to report](../../public_report.md)

# 📝 Documentation — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧹 Hygiene](#-hygiene)

## 📊 Findings

| File | Verdict | Documentation | Conf. | Details |
|------|---------|---------------|-------|---------|
| `src/interlocking.ts` | 🔴 CRITICAL | 6 | 98% | [details](#srcinterlockingts) |
| `src/dispatcher.ts` | 🔴 CRITICAL | 1 | 97% | [details](#srcdispatcherts) |
| `src/network.ts` | 🟡 NEEDS_REFACTOR | 9 | 95% | [details](#srcnetworkts) |
| `src/timetable.ts` | 🟡 NEEDS_REFACTOR | 5 | 95% | [details](#srctimetablets) |
| `src/signals.ts` | 🟡 NEEDS_REFACTOR | 3 | 95% | [details](#srcsignalsts) |
| `src/format.ts` | 🟡 NEEDS_REFACTOR | 2 | 92% | [details](#srcformatts) |
| `src/routing.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcroutingts) |
| `src/telemetry.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srctelemetryts) |
| `src/kpi.ts` | 🟡 NEEDS_REFACTOR | 1 | 92% | [details](#srckpits) |
| `src/priority.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcpriorityts) |

## 🔍 Symbol Details

### `src/interlocking.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `resetInterlocking` | L6–L9 | 🔴 UNDOCUMENTED | 95% | No JSDoc. Exported public API. Clears both maps — intended call site (simulation reset) and side effects are undocumented. |
| `isBlockFree` | L11–L14 | 🔴 UNDOCUMENTED | 98% | No JSDoc. Exported and critically non-obvious: the `block` parameter is entirely unused; the check is against `currentBlock`. This asymmetry between the declared intent and the actual lookup is a documentation gap that can cause misuse. (deliberated: confirmed — Confirmed. src/interlocking.ts:12 — `blockHolder.get(currentBlock)` should be `blockHolder.get(block)`. The `block` parameter (the target block to check) is completely ignored. At call site src/dispatcher.ts:112 `isBlockFree(nextBlock, trainId, currentBlock)`, the function checks the train's own occupied block instead of the target, finds `holder === train`, and always returns true. This defeats all block-occupancy collision protection. The bug is masked at line 55 where both args happen to be `firstBlock`.) |
| `occupyBlock` | L16–L18 | 🔴 UNDOCUMENTED | 95% | No JSDoc. Exported public API. No documentation on preconditions (caller must call isBlockFree first) or relationship to reserveSectionBlock. |
| `releaseBlock` | L20–L22 | 🔴 UNDOCUMENTED | 90% | No JSDoc. The `_train` parameter is silently ignored, which is surprising — no comment explains why train identity is not validated on release. |
| `reserveSectionBlock` | L24–L32 | 🔴 UNDOCUMENTED | 95% | No JSDoc. Exported public API with complex, non-obvious behavior: silently no-ops for all blocks except hardcoded bS1/bS2, returns false when another train holds the reservation. The single-track constraint concept and the return-value contract are undocumented. |
| `releaseSingleTrack` | L34–L40 | 🔴 UNDOCUMENTED | 95% | No JSDoc. Exported public API. The hardcoded bS1/bS2 scope and the pairing with reserveSectionBlock are undocumented. Callers cannot know when to call this vs releaseBlock. |

### `src/dispatcher.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `runSchedule` | L28–L148 | 🔴 UNDOCUMENTED | 97% | Exported public API with no JSDoc comment. The README documents it in prose, but no TSDoc block appears on the function itself — no @returns describing SimulationReport fields, no note on the early-exit condition, and no mention of the MAX_TICKS hard ceiling. (deliberated: confirmed — Confirmed. src/dispatcher.ts:76 — `for (let d = dispatched.length - 1; d > 0; d--)` uses `d > 0` instead of `d >= 0`, so `dispatched[0]` is never spliced from `readyQueue`. The first-dispatched train each tick leaks permanently. After it completes and is deleted from `activeTrains` (line 124), the stale readyQueue entry passes the `activeTrains.has()` guard at line 50, causing re-dispatch. Also blocks early termination at line 128 since `readyQueue.length` never reaches 0.) |

### `src/network.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `STATIONS` | L3–L3 | 🔴 UNDOCUMENTED | 95% | No JSDoc. Name implies station identifiers but nothing explains what these stations represent in the network topology. |
| `BLOCKS` | L6–L8 | 🔴 UNDOCUMENTED | 95% | No JSDoc. No explanation of whether this is an exhaustive list, an ordered list, or what it is used for relative to BLOCK_INFO. |
| `SINGLE_TRACK_BLOCKS` | L10–L10 | 🔴 UNDOCUMENTED | 95% | No JSDoc. The name hints at single-track topology but the interlocking/collision-avoidance semantics enforced by the dispatcher are not described. |
| `BlockInfo` | L12–L17 | 🟡 PARTIAL | 85% | No JSDoc. `traversalTime` lacks unit documentation (ticks? seconds?). `from`/`to` are untyped strings mixing station names and junction labels (e.g. 'JCT', 'WESTLOOP') — semantics not explained. |
| `BLOCK_INFO` | L21–L30 | 🔴 UNDOCUMENTED | 90% | No JSDoc. Encodes the physical network layout including junction node labels ('JCT', 'WESTLOOP', 'EASTLOOP') that do not appear in STATIONS — this non-obvious topology is undocumented. |
| `getTraversalTime` | L32–L34 | 🔴 UNDOCUMENTED | 95% | No JSDoc. The `_block` parameter is ignored and a constant is always returned — this stub-like behavior and its intended future semantics are undocumented. |
| `getBlockInfo` | L36–L38 | 🔴 UNDOCUMENTED | 95% | No JSDoc. Missing documentation on the undefined return case and what callers should do when a block is not found. |
| `ADJACENCY` | L45–L55 | 🔴 UNDOCUMENTED | 90% | No JSDoc. The graph contains bidirectional entries for the single-track loop (bS1↔bS2) alongside unidirectional edges — this directionality convention is undocumented and consumed by the routing algorithm. |
| `getNextBlocks` | L57–L59 | 🔴 UNDOCUMENTED | 95% | No JSDoc. Missing documentation on directionality semantics, what an empty result means, and that it relies on the ADJACENCY graph. |

### `src/timetable.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `DWELL_TICKS` | L3–L3 | 🔴 UNDOCUMENTED | 90% | No JSDoc. README also contradicts this value (documents 2 ticks; constant is 6). |
| `MIN_HEADWAY` | L4–L4 | 🔴 UNDOCUMENTED | 95% | No JSDoc. README mentions the 3-tick headway rule but the constant itself carries no inline documentation. |
| `ON_TIME_SLACK` | L5–L5 | 🔴 UNDOCUMENTED | 92% | No JSDoc. Neither the constant's purpose (tolerance window added to scheduledArrival) nor its unit is documented. |
| `TrainSpec` | L7–L13 | 🔴 UNDOCUMENTED | 90% | No JSDoc on the interface or any field. Non-obvious semantics include: tick unit for depart/scheduledArrival, what PriorityClass values are valid, and whether route is ordered. |
| `TIMETABLE` | L15–L72 | 🔴 UNDOCUMENTED | 90% | No JSDoc. Purpose, scenario coverage, and authoring conventions (e.g., block naming) are undocumented. |

### `src/signals.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `resetSignals` | L6–L8 | 🔴 UNDOCUMENTED | 95% | No JSDoc. Exported API. No description of when to call this (e.g., before a new simulation run) or what state is cleared. |
| `canEnterBlock` | L10–L15 | 🔴 UNDOCUMENTED | 95% | No JSDoc. Exported API with non-obvious semantics: the `_train` parameter is silently unused, the off-by-one `MIN_HEADWAY - 1` comparison is unexplained, and the return value contract (true on first entry) is implicit. |
| `recordEntry` | L17–L19 | 🔴 UNDOCUMENTED | 95% | No JSDoc. Exported API. No description of when callers must invoke this relative to canEnterBlock, or the consequence of missing a call. |

### `src/format.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `formatTimetable` | L4–L14 | 🔴 UNDOCUMENTED | 92% | No JSDoc/TSDoc comment. Missing description of return format, column layout, or data source (TIMETABLE). |
| `formatReport` | L16–L31 | 🔴 UNDOCUMENTED | 92% | No JSDoc/TSDoc comment. Missing description of the report parameter fields consumed, return format, and how stranded vs on-time arrivals are represented. |

### `src/routing.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `shortestPath` | L4–L36 | 🔴 UNDOCUMENTED | 95% | No JSDoc/TSDoc comment. Missing description of BFS algorithm used, what null return means, whether path includes both endpoints, and behavior when from === to. |

### `src/telemetry.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `MovementRecorder` | L3–L14 | 🔴 UNDOCUMENTED | 95% | No JSDoc on the class or either method. The class purpose (recording train movements and arrivals for telemetry/simulation reporting), the semantics of `tick`, and the relationship between `arrivals` and `occupancy` are non-obvious and warrant documentation. Both public methods lack parameter or behavior descriptions. |

### `src/kpi.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `computeOnTimeRate` | L4–L19 | 🔴 UNDOCUMENTED | 92% | No JSDoc comment. Non-obvious behaviors undocumented: return value is a ratio [0,1] not a percentage; returns 1 (not 0) when TIMETABLE is empty; train membership is sourced from TIMETABLE rather than from the arrivals argument; a train is considered on-time if ANY of its arrival records satisfies the slack threshold. |

### `src/priority.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `compareTrains` | L8–L12 | 🔴 UNDOCUMENTED | 75% | No JSDoc comment. The comparison logic sorts by `trainId` descending (higher ID = higher priority), which is a non-obvious convention. Missing: description of sort order/semantics, @param docs for `a` and `b`, @returns explanation of the sign contract expected by comparators. |

## 🧹 Hygiene

- [ ] <!-- ACT-16367c-2 --> **[documentation · medium · trivial]** `src/dispatcher.ts`: Add JSDoc documentation for exported symbol: `runSchedule` (`runSchedule`) [L28-L148]
- [ ] <!-- ACT-41c7b3-1 --> **[documentation · medium · trivial]** `src/format.ts`: Add JSDoc documentation for exported symbol: `formatTimetable` (`formatTimetable`) [L4-L14]
- [ ] <!-- ACT-41c7b3-2 --> **[documentation · medium · trivial]** `src/format.ts`: Add JSDoc documentation for exported symbol: `formatReport` (`formatReport`) [L16-L31]
- [ ] <!-- ACT-e8e886-2 --> **[documentation · medium · trivial]** `src/interlocking.ts`: Add JSDoc documentation for exported symbol:  `resetInterlocking`, `isBlockFree`, `occupyBlock`, `releaseBlock`, `reserveSectionBlock`, `releaseSingleTrack` (`resetInterlocking, isBlockFree, occupyBlock, releaseBlock, reserveSectionBlock, releaseSingleTrack`) [L6-L9, L11-L14, L16-L18, L20-L22, L24-L32, L34-L40]
- [ ] <!-- ACT-c1b1ba-1 --> **[documentation · medium · trivial]** `src/kpi.ts`: Add JSDoc documentation for exported symbol: `computeOnTimeRate` (`computeOnTimeRate`) [L4-L19]
- [ ] <!-- ACT-c321b9-1 --> **[documentation · medium · trivial]** `src/network.ts`: Add JSDoc documentation for exported symbol:  `STATIONS`, `BLOCKS`, `SINGLE_TRACK_BLOCKS`, `BLOCK_INFO`, `getTraversalTime`, `getBlockInfo`, `ADJACENCY`, `getNextBlocks` (`STATIONS, BLOCKS, SINGLE_TRACK_BLOCKS, BLOCK_INFO, getTraversalTime, getBlockInfo, ADJACENCY, getNextBlocks`) [L3-L3, L6-L8, L10-L10, L21-L30, L32-L34, L36-L38, L45-L55, L57-L59]
- [ ] <!-- ACT-7c7940-2 --> **[documentation · medium · trivial]** `src/priority.ts`: Add JSDoc documentation for exported symbol: `compareTrains` (`compareTrains`) [L8-L12]
- [ ] <!-- ACT-692e2f-1 --> **[documentation · medium · trivial]** `src/routing.ts`: Add JSDoc documentation for exported symbol: `shortestPath` (`shortestPath`) [L4-L36]
- [ ] <!-- ACT-b36eed-2 --> **[documentation · medium · trivial]** `src/signals.ts`: Add JSDoc documentation for exported symbol:  `resetSignals`, `canEnterBlock`, `recordEntry` (`resetSignals, canEnterBlock, recordEntry`) [L6-L8, L10-L15, L17-L19]
- [ ] <!-- ACT-87dc6d-1 --> **[documentation · medium · trivial]** `src/telemetry.ts`: Add JSDoc documentation for exported symbol: `MovementRecorder` (`MovementRecorder`) [L3-L14]
- [ ] <!-- ACT-3a5046-1 --> **[documentation · medium · trivial]** `src/timetable.ts`: Add JSDoc documentation for exported symbol:  `DWELL_TICKS`, `MIN_HEADWAY`, `ON_TIME_SLACK`, `TrainSpec`, `TIMETABLE` (`DWELL_TICKS, MIN_HEADWAY, ON_TIME_SLACK, TrainSpec, TIMETABLE`) [L3-L3, L4-L4, L5-L5, L7-L13, L15-L72]
- [ ] <!-- ACT-c321b9-2 --> **[documentation · low · trivial]** `src/network.ts`: Complete JSDoc documentation for: `BlockInfo` (`BlockInfo`) [L12-L17]

## Documentation Coverage

### `src/interlocking.ts` — 0% covered

- [ ] **Block occupancy tracking** — MISSING: README.md covers only tick-based timing. The blockHolder mechanism, its role in preventing collisions, and the isBlockFree/occupyBlock/releaseBlock contract are absent from docs.
- [ ] **Single-track section reservation (bS1/bS2)** — MISSING: The exclusive reservation system for the single-track section, the bS1/bS2 block identifiers, and the reserveSectionBlock/releaseSingleTrack lifecycle are not mentioned anywhere in docs/.

### `src/dispatcher.ts` — 60% covered

- [ ] **MAX_TICKS simulation ceiling** — MISSING: The 200-tick hard limit that terminates the simulation is not mentioned in any docs page. The README covers dwell and headway timings but omits the overall tick budget.

### `src/timetable.ts` — 30% covered

- [ ] **DWELL_TICKS** — OUTDATED → `README.md`: README states dwell is 2 ticks; constant is 6.
- [ ] **ON_TIME_SLACK** — MISSING: No mention of an on-time tolerance window or slack constant in README.
- [ ] **TrainSpec** — MISSING: Interface shape, field semantics, and valid values are not described anywhere in docs/.
- [ ] **TIMETABLE** — PARTIAL → `README.md`: README references 'the timetable module' generically but does not describe the exported TIMETABLE array, its entries, or scenario intent.

### `src/signals.ts` — 20% covered

- [ ] **Block headway enforcement** — PARTIAL → `README.md`: README states the 3-tick minimum headway constant but does not describe the signals module, its API, or the enforcement mechanism (canEnterBlock / recordEntry pattern).
- [ ] **Signal state reset** — MISSING: resetSignals and the stateful lastEntryTick map are not mentioned anywhere in the docs.

### `src/format.ts` — 0% covered

- [ ] **formatTimetable** — MISSING: README documents runSchedule() and tick semantics but never mentions the timetable formatting utility.
- [ ] **formatReport** — MISSING: README references reportedOnTimeRate on the raw report object but does not document the human-readable report formatter.

### `src/kpi.ts` — 0% covered

- [ ] **computeOnTimeRate / KPI computation** — MISSING: README.md covers timing constants and block traversal but says nothing about on-time rate calculation, the ON_TIME_SLACK threshold, or how KPIs are derived from arrival records.
