[← Back to Correction](./index.md) · [← Back to report](../../public_report.md)

# 🐛 Correction — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [⚡ Quick Wins](#-quick-wins)
- [🔧 Refactors](#-refactors)

## 📊 Findings

| File | Verdict | Correction | Conf. | Details |
|------|---------|------------|-------|---------|
| `src/signals.ts` | 🟡 NEEDS_REFACTOR | 1 | 98% | [details](#srcsignalsts) |
| `src/dispatcher.ts` | 🟡 NEEDS_REFACTOR | 1 | 97% | [details](#srcdispatcherts) |
| `src/interlocking.ts` | 🟡 NEEDS_REFACTOR | 1 | 97% | [details](#srcinterlockingts) |
| `src/timetable.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srctimetablets) |
| `src/priority.ts` | 🟡 NEEDS_REFACTOR | 1 | 92% | [details](#srcpriorityts) |

## 🔍 Symbol Details

### `src/signals.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `canEnterBlock` | L14 | 🟡 NEEDS_FIX | 97% | README states minimum headway is 3 ticks. With MIN_HEADWAY=3, the predicate `elapsed >= MIN_HEADWAY - 1` reduces to `elapsed >= 2`, permitting a second train to enter the same block only 2 ticks after the first (e.g., train A enters tick 0, train B may enter tick 2). The correct predicate is `elapsed >= MIN_HEADWAY` so that the second train is blocked until elapsed reaches 3. |

### `src/dispatcher.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `runSchedule` | L68–L70 | 🟡 NEEDS_FIX | 97% | Loop `for (let d = dispatched.length - 1; d > 0; d--)` iterates down to d=1, never executing the splice for d=0. `dispatched[0]` stays in readyQueue. When the train later completes its route and is deleted from activeTrains, the stale readyQueue entry causes the train to be re-dispatched from its first block on a subsequent tick. When only one train is dispatched the loop body never executes at all. Fix: change `d > 0` to `d >= 0`. |

### `src/interlocking.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `isBlockFree` | L12 | 🟡 NEEDS_FIX | 97% | `blockHolder.get(currentBlock)` should be `blockHolder.get(block)`. As written, the function never inspects whether the target block is occupied — it always checks the train's current position, which the train already holds, so the check trivially returns true for any move and cannot prevent two trains from entering the same block. |

### `src/timetable.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `TIMETABLE` | L51–L57 | 🟡 NEEDS_FIX | 82% | T6_LOC route ["bE","bS2","bS1","bM2"] moves bS2→bS1, opposite to every other train that uses those blocks (bS1→bS2). T5_EXP (L44–50) departs at the same tick (6) going bM2→bS1→bS2→bD. Under exclusive block occupancy, both trains enter the bS1/bS2 corridor simultaneously from opposite ends: T5 holds bS1 waiting for bS2, T6 holds bS2 waiting for bS1 — a deadlock. Even if the simulation breaks the deadlock, it permits an unsafe head-on crossing the interlocking cannot resolve (canEnterBlock checks only elapsed time, not direction). |

### `src/priority.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `compareTrains` | L9–L11 | 🟡 NEEDS_FIX | 78% | compareTrains never reads insertionOrder. Because trainId is a unique train identifier, two distinct queue entries will never share the same trainId, so the equality branch (return 0) is unreachable and the insertionOrder field has no effect. The README states 'highest-priority ready train is dispatched first' implying a priority/priorityClass criterion, not trainId. If trainId is opaque and does not encode priority rank, the sort field is wrong entirely; if it does encode priority, then equal-priority trains still need FIFO tiebreaking via insertionOrder which is absent. |

## ⚡ Quick Wins

- [ ] <!-- ACT-16367c-1 --> **[correction · medium · small]** `src/dispatcher.ts`: Change loop condition from `d > 0` to `d >= 0` on line 68 so that all dispatched-train indices — including index 0 — are spliced out of readyQueue each tick. Without this fix, at least one dispatched train per tick is never removed, and trains can be incorrectly re-dispatched after arrival. [L68]
- [ ] <!-- ACT-7c7940-1 --> **[correction · medium · small]** `src/priority.ts`: Add a priority or priorityClass field to QueueEntry and rewrite compareTrains to sort descending by that field, falling back to ascending insertionOrder for FIFO tiebreaking within the same priority tier. Confirm with types.ts whether TrainId already encodes priority ordering before deciding whether a separate field is needed. [L9]
- [ ] <!-- ACT-b36eed-1 --> **[correction · medium · small]** `src/signals.ts`: Change `elapsed >= MIN_HEADWAY - 1` to `elapsed >= MIN_HEADWAY` in canEnterBlock to enforce the documented 3-tick minimum headway instead of the current effective 2-tick gap. [L14]
- [ ] <!-- ACT-3a5046-1 --> **[correction · medium · small]** `src/timetable.ts`: Fix T6_LOC's route to eliminate the head-on conflict with T5_EXP on bS1/bS2: either reverse its route to conform to the shared traffic direction (bM2→bS1→bS2→bE if bE connects there), assign it a non-overlapping path, or stagger its departure by enough ticks that T5_EXP has fully cleared bS2 before T6_LOC enters bS2. [L54]

## 🔧 Refactors

- [ ] <!-- ACT-e8e886-1 --> **[correction · high · large]** `src/interlocking.ts`: In `isBlockFree`, replace `blockHolder.get(currentBlock)` with `blockHolder.get(block)` so the function actually checks whether the target block is free rather than the block the train already occupies. [L12]
