[← Back to Correction](./index.md) · [← Back to report](../../public_report.md)

# 🐛 Correction — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [⚡ Quick Wins](#-quick-wins)
- [🔧 Refactors](#-refactors)

## 📊 Findings

| File | Verdict | Correction | Conf. | Details |
|------|---------|------------|-------|---------|
| `src/interlocking.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcinterlockingts) |
| `src/signals.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcsignalsts) |
| `src/dispatcher.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcdispatcherts) |
| `src/priority.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcpriorityts) |

## 🔍 Symbol Details

### `src/interlocking.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `isBlockFree` | L12 | 🟡 NEEDS_FIX | 95% | `blockHolder.get(currentBlock)` looks up the block the train is currently in, not the block it wants to enter (`block`). Should be `blockHolder.get(block)`. As written, the call effectively returns true whenever the train already owns its current position, rendering the occupancy guard inoperative for the destination. |

### `src/signals.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `canEnterBlock` | L14 | 🟡 NEEDS_FIX | 95% | `elapsed >= MIN_HEADWAY - 1` evaluates to `elapsed >= 2`. If a train entered at tick 5, a second train is permitted at tick 7 (elapsed=2), violating the 3-tick minimum headway stated in README and encoded in MIN_HEADWAY=3. The correct guard is `elapsed >= MIN_HEADWAY`. |

### `src/dispatcher.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `runSchedule` | L76–L78 | 🟡 NEEDS_FIX | 95% | Loop condition `d > 0` stops before d=0, so `dispatched[0]` (the first successfully dispatched train per tick) is never spliced from readyQueue. After that train arrives and is deleted from activeTrains (L125), the stale readyQueue entry is re-evaluated on the next tick: `activeTrains.has()` returns false, so the train is dispatched a second time onto a potentially occupied block. The early-exit at L128 also never fires once any train has been dispatched, because readyQueue.length never reaches 0. Fix: change `d > 0` to `d >= 0`. |
| `runSchedule` | L108–L113 | 🟡 NEEDS_FIX | 95% | `reserveSectionBlock(nextBlock, trainId)` is called (and commits a reservation on success) before `isBlockFree` and `canEnterBlock` are checked. If either subsequent gate returns false the function continues without releasing the reservation, permanently locking that single-track section block. Compare with the dispatch path (L55–L59) where `isBlockFree` and `canEnterBlock` are checked first and `reserveSectionBlock` is called last. Fix: reorder to check `isBlockFree` and `canEnterBlock` before calling `reserveSectionBlock`, mirroring the dispatch path. |

### `src/priority.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `compareTrains` | L10–L11 | 🟡 NEEDS_FIX | 72% | When `a.trainId === b.trainId` the function returns 0, meaning no tie-break is applied. `insertionOrder` is the canonical FIFO discriminator on this type but is silently ignored, producing an unstable sort for equal-priority entries. |

## ⚡ Quick Wins

- [ ] <!-- ACT-16367c-1 --> **[correction · medium · small]** `src/dispatcher.ts`: Change `d > 0` to `d >= 0` in the dispatched-removal loop so that the first dispatched train's readyQueue entry is also removed, preventing re-dispatch after arrival and allowing the early-exit condition to function correctly. [L76]
- [ ] <!-- ACT-16367c-2 --> **[correction · medium · small]** `src/dispatcher.ts`: Move the `reserveSectionBlock` call (L108–L110) to after the `isBlockFree` (L112) and `canEnterBlock` (L113) checks, matching the dispatch-path ordering, so a reservation is never committed when the train cannot actually enter the block. [L108]
- [ ] <!-- ACT-7c7940-1 --> **[correction · medium · small]** `src/priority.ts`: After the trainId comparison, add a tie-break on insertionOrder: `return a.insertionOrder - b.insertionOrder;` (ascending insertion order preserves FIFO for equal trainId values). [L11]
- [ ] <!-- ACT-b36eed-1 --> **[correction · medium · small]** `src/signals.ts`: Change `elapsed >= MIN_HEADWAY - 1` to `elapsed >= MIN_HEADWAY` in canEnterBlock (line 14) so the enforced headway matches the documented 3-tick minimum. [L14]

## 🔧 Refactors

- [ ] <!-- ACT-e8e886-1 --> **[correction · high · large]** `src/interlocking.ts`: In isBlockFree, change `blockHolder.get(currentBlock)` to `blockHolder.get(block)` so the function actually checks whether the destination block is free, not the block the train already occupies. [L12]
