[← Back to Documentation](./index.md) · [← Back to report](../../public_report.md)

# 📝 Documentation — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧹 Hygiene](#-hygiene)

## 📊 Findings

| File | Verdict | Documentation | Conf. | Details |
|------|---------|---------------|-------|---------|
| `src/network.ts` | 🟡 NEEDS_REFACTOR | 9 | 95% | [details](#srcnetworkts) |
| `src/interlocking.ts` | 🟡 NEEDS_REFACTOR | 6 | 95% | [details](#srcinterlockingts) |
| `src/timetable.ts` | 🟡 NEEDS_REFACTOR | 5 | 95% | [details](#srctimetablets) |
| `src/signals.ts` | 🟡 NEEDS_REFACTOR | 3 | 95% | [details](#srcsignalsts) |
| `src/dispatcher.ts` | 🟡 NEEDS_REFACTOR | 2 | 95% | [details](#srcdispatcherts) |
| `src/format.ts` | 🟡 NEEDS_REFACTOR | 2 | 92% | [details](#srcformatts) |
| `src/routing.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcroutingts) |
| `src/telemetry.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srctelemetryts) |
| `src/kpi.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srckpits) |
| `src/priority.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcpriorityts) |

## 🔍 Symbol Details

### `src/network.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `STATIONS` | L3–L3 | 🔴 UNDOCUMENTED | 95% | No JSDoc. Exported public API; no description of what these identifiers represent in the network topology. |
| `BLOCKS` | L6–L8 | 🔴 UNDOCUMENTED | 95% | No JSDoc. Purpose (exhaustive list? ordered list? differs from BLOCK_INFO how?) is not explained. |
| `SINGLE_TRACK_BLOCKS` | L10–L10 | 🔴 UNDOCUMENTED | 95% | No JSDoc. The interlocking semantics — why these blocks are constrained and how consumers must enforce that constraint — are undocumented. |
| `BlockInfo` | L12–L17 | 🟡 PARTIAL | 82% | No JSDoc. Fields id/from/to are self-explanatory, but traversalTime lacks unit documentation (ticks? seconds?) and no interface-level description explains the coordinate system for 'from'/'to' (station names vs. junction labels). |
| `BLOCK_INFO` | L21–L30 | 🔴 UNDOCUMENTED | 90% | No JSDoc. No explanation of what junction labels like 'JCT', 'WESTLOOP', 'EASTLOOP', 'bS1_end', 'bS2_start' mean or how this list relates to BLOCKS. |
| `getTraversalTime` | L32–L34 | 🔴 UNDOCUMENTED | 95% | No JSDoc. Non-obvious behavior: parameter is unused (prefixed _block) and the function always returns the constant T regardless of block identity. This stub contract is undocumented. |
| `getBlockInfo` | L36–L38 | 🔴 UNDOCUMENTED | 95% | No JSDoc. No documentation on param, return type, or when undefined is returned. |
| `ADJACENCY` | L45–L55 | 🔴 UNDOCUMENTED | 92% | No JSDoc. Directionality rules (bidirectional entries for bS1↔bS2 and bS2↔bM2 path) and the graph's relationship to physical topology are unexplained. |
| `getNextBlocks` | L57–L59 | 🔴 UNDOCUMENTED | 95% | No JSDoc. No param, return, or behavior documentation (e.g. empty array vs null for terminal blocks). |

### `src/interlocking.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `resetInterlocking` | L6–L9 | 🔴 UNDOCUMENTED | 95% | Exported public API with no JSDoc. Clears both blockHolder and sectionReservation; callers need to know this resets all interlocking state globally. |
| `isBlockFree` | L11–L14 | 🔴 UNDOCUMENTED | 95% | Exported public API with no JSDoc. Critically non-obvious: the `block` parameter is ignored — the lookup uses `currentBlock`, not `block`. This asymmetry demands documentation but has none. |
| `occupyBlock` | L16–L18 | 🔴 UNDOCUMENTED | 95% | Exported public API with no JSDoc. Simple operation but no description of preconditions or interaction with sectionReservation. |
| `releaseBlock` | L20–L22 | 🔴 UNDOCUMENTED | 90% | Exported public API with no JSDoc. The `_train` parameter is intentionally unused (prefixed underscore), which is non-obvious to callers and undocumented. |
| `reserveSectionBlock` | L24–L32 | 🔴 UNDOCUMENTED | 95% | Exported public API with no JSDoc. Complex logic: silently succeeds for non-section blocks (bS1/bS2), implements mutual exclusion for those blocks, returns false on conflict. None of this is documented. |
| `releaseSingleTrack` | L34–L40 | 🔴 UNDOCUMENTED | 95% | Exported public API with no JSDoc. Hardcoded block IDs bS1/bS2 and the concept of a 'single track section' are undocumented; callers cannot tell when to call this vs releaseBlock. |

### `src/timetable.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `DWELL_TICKS` | L3–L3 | 🔴 UNDOCUMENTED | 95% | No JSDoc. Units (ticks) and semantic meaning (station dwell duration) are implicit. README further contradicts this value (says 2 ticks, code is 6). |
| `MIN_HEADWAY` | L4–L4 | 🔴 UNDOCUMENTED | 95% | No JSDoc. No inline comment clarifying that the unit is ticks or that this enforces block-entry spacing. |
| `ON_TIME_SLACK` | L5–L5 | 🔴 UNDOCUMENTED | 92% | No JSDoc. The name alone does not convey that it is an additive tick tolerance applied to scheduledArrival, nor its unit. |
| `TrainSpec` | L7–L13 | 🔴 UNDOCUMENTED | 90% | No JSDoc on the interface or any field. Non-obvious semantics: depart and scheduledArrival are tick-based, route is an ordered list of BlockIds, and priority maps to a custom enum — none of this is documented. |
| `TIMETABLE` | L15–L72 | 🔴 UNDOCUMENTED | 88% | No JSDoc. No comment explaining the scenario being modeled, the tick scale, or why certain trains share departure ticks. Consumed by dispatcher, formatter, and KPI modules — a brief description of intent would be warranted. |

### `src/signals.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `resetSignals` | L6–L8 | 🔴 UNDOCUMENTED | 95% | No JSDoc. Exported public API with no explanation of when callers must invoke it (e.g., between simulation runs) or what state it clears. |
| `canEnterBlock` | L10–L15 | 🔴 UNDOCUMENTED | 95% | No JSDoc. The `_train` parameter is silently unused, the `MIN_HEADWAY - 1` offset is unexplained, and there is no description of the headway-enforcement contract or return semantics. |
| `recordEntry` | L17–L19 | 🔴 UNDOCUMENTED | 95% | No JSDoc. Exported public API; callers must know to call this after every successful block entry to keep headway state consistent, but that contract is undocumented. |

### `src/dispatcher.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `ActiveTrain` | L20–L26 | 🟡 PARTIAL | 72% | Internal, non-exported interface with no JSDoc. Most fields are self-explanatory, but the distinction between ticksOnBlock (traversal progress counter) and dwellRemaining (station hold-down counter) is subtle — both count down ticks in different phases and their interaction is non-obvious without reading the loop body. |
| `runSchedule` | L28–L148 | 🔴 UNDOCUMENTED | 95% | Exported public API with no JSDoc/TSDoc. README covers high-level usage but the function itself carries no inline documentation describing its return value shape, side-effects (resets signals and interlocking), early-exit condition, or the meaning of a null actualArrival in the returned arrivals list. |

### `src/format.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `formatTimetable` | L4–L14 | 🔴 UNDOCUMENTED | 92% | No JSDoc comment. Exported public function with non-obvious output format (column widths, separator line, field ordering) — purpose and output structure are not documented. |
| `formatReport` | L16–L31 | 🔴 UNDOCUMENTED | 92% | No JSDoc comment. Exported public function whose output structure (tick count, on-time rate percentage, per-arrival stranded/arrived lines) is non-trivial and undocumented. |

### `src/routing.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `shortestPath` | L4–L36 | 🔴 UNDOCUMENTED | 95% | No JSDoc/TSDoc comment. Missing description of BFS algorithm, parameter semantics (what constitutes a valid BlockId pair), return value (null means unreachable vs. same-node shortcut), and any constraints on the ADJACENCY graph (directed, unweighted). |

### `src/telemetry.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `MovementRecorder` | L3–L14 | 🔴 UNDOCUMENTED | 95% | No JSDoc on the class or either method. Purpose (recording train arrivals and block occupancy during simulation), parameters, and the distinction between the two record types are not documented. |

### `src/kpi.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `computeOnTimeRate` | L4–L19 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Exported public function with non-obvious semantics: counts trains from TIMETABLE that had at least one on-time arrival (not all arrivals), uses ON_TIME_SLACK threshold, and returns 1 when TIMETABLE is empty. None of this is documented. |

### `src/priority.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `compareTrains` | L8–L12 | 🔴 UNDOCUMENTED | 72% | No JSDoc comment. Comparator sorts by trainId descending (higher IDs first), which is a non-obvious ordering choice. Missing: description of sort direction, what the return value means for the caller's priority queue, and why insertionOrder is present in QueueEntry but unused here. |

## 🧹 Hygiene

- [ ] <!-- ACT-16367c-4 --> **[documentation · medium · trivial]** `src/dispatcher.ts`: Add JSDoc documentation for exported symbol: `runSchedule` (`runSchedule`) [L28-L148]
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
- [ ] <!-- ACT-16367c-3 --> **[documentation · low · trivial]** `src/dispatcher.ts`: Complete JSDoc documentation for: `ActiveTrain` (`ActiveTrain`) [L20-L26]
- [ ] <!-- ACT-c321b9-2 --> **[documentation · low · trivial]** `src/network.ts`: Complete JSDoc documentation for: `BlockInfo` (`BlockInfo`) [L12-L17]

## Documentation Coverage

### `src/interlocking.ts` — 0% covered

- [ ] **Block occupancy management** — MISSING: README.md covers timing constants only. No mention of block occupancy, the blockHolder map, or how trains claim blocks.
- [ ] **Single-track section reservation** — MISSING: The bS1/bS2 single-track section and mutual-exclusion reservation protocol are not referenced anywhere in README.md or any provided docs page.
- [ ] **Interlocking system** — MISSING: The interlocking module as a whole (purpose, lifecycle, reset semantics) is absent from all provided documentation.

### `src/timetable.ts` — 25% covered

- [ ] **DWELL_TICKS** — OUTDATED → `README.md`: README states station dwell is 2 ticks; code defines DWELL_TICKS = 6. Direct contradiction.
- [ ] **ON_TIME_SLACK** — MISSING: No mention of an on-time tolerance window or slack constant anywhere in the provided docs.
- [ ] **TrainSpec** — MISSING: The TrainSpec interface (fields: id, priority, route, depart, scheduledArrival) is not described in the docs.
- [ ] **TIMETABLE** — PARTIAL → `README.md`: README references 'the timetable module' but does not describe the scenario, the eight trains, their priority classes, or the route topology encoded in the array.

### `src/signals.ts` — 20% covered

- [ ] **Block headway enforcement (signals module)** — PARTIAL → `README.md`: README states the 3-tick minimum headway constant but never mentions the signals module, its exported functions, or the call protocol (canEnterBlock → recordEntry). The enforcement mechanism is invisible to readers of the docs.
- [ ] **Simulation reset between runs** — MISSING: resetSignals must be called to clear inter-run state; no documentation mentions this requirement anywhere.

### `src/dispatcher.ts` — 67% covered

- [ ] **MAX_TICKS simulation ceiling** — MISSING: The 200-tick hard limit is never mentioned in docs. Readers cannot know what the upper bound is, that it exists, or what a report produced by hitting it means.

### `src/format.ts` — 0% covered

- [ ] **formatTimetable** — MISSING: README covers runSchedule() and timing constants but never mentions formatTimetable or any timetable rendering utility.
- [ ] **formatReport** — MISSING: README references reportedOnTimeRate on the raw report object but does not mention formatReport or any human-readable report rendering.

### `src/kpi.ts` — 0% covered

- [ ] **computeOnTimeRate / on-time KPI** — MISSING: README.md covers timing constants and timetable structure but never mentions KPI calculation, on-time rate, or the ON_TIME_SLACK threshold's role in scoring.
