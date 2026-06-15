[← Back to Correction](./index.md) · [← Back to report](../../public_report.md)

# 🐛 Correction — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [⚡ Quick Wins](#-quick-wins)
- [🔧 Refactors](#-refactors)

## 📊 Findings

| File | Verdict | Correction | Conf. | Details |
|------|---------|------------|-------|---------|
| `src/interlocking.ts` | 🔴 CRITICAL | 1 | 98% | [details](#srcinterlockingts) |
| `src/dispatcher.ts` | 🔴 CRITICAL | 1 | 97% | [details](#srcdispatcherts) |
| `src/signals.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcsignalsts) |
| `src/priority.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcpriorityts) |

## 🔍 Symbol Details

### `src/interlocking.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `isBlockFree` | L12 | 🔴 ERROR | 98% | `blockHolder.get(currentBlock)` should be `blockHolder.get(block)`. The function is supposed to determine whether the target `block` is free for the requesting train, but it instead checks the train's *current* block. This means a train attempting to move into an occupied target block will see a false-free result, allowing two trains to occupy the same block simultaneously — a collision in railway terms. |

### `src/dispatcher.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `runSchedule` | L68–L70 | 🔴 ERROR | 97% | `for (let d = dispatched.length - 1; d > 0; d--)` — the loop exits before `d === 0`, so `readyQueue.splice(dispatched[0], 1)` is never called. The first successfully-dispatched train per tick is never removed from `readyQueue`. Consequences: (1) after the train arrives and is deleted from `activeTrains`, the stale `readyQueue` entry allows re-dispatch of the same train from `routeIndex 0`, producing duplicate `recordArrival` calls and phantom occupancy records; (2) `readyQueue.length` never reaches 0, so the early-termination guard never fires and every run exhausts all `MAX_TICKS` ticks. Fix: change `d > 0` to `d >= 0`. |

### `src/signals.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `canEnterBlock` | L14 | 🟡 NEEDS_FIX | 95% | `MIN_HEADWAY - 1 = 2`. If train A enters at tick T, train B is admitted at T+2 (elapsed=2 >= 2). Correct condition is `elapsed >= MIN_HEADWAY` (i.e., >= 3) to enforce the 3-tick minimum. The subtraction of 1 has no justification — MIN_HEADWAY is already the inclusive threshold. |

### `src/priority.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `compareTrains` | L8–L12 | 🟡 NEEDS_FIX | 75% | insertionOrder exists precisely to break ties in a stable, FIFO manner, yet compareTrains ignores it entirely. Equal-trainId entries will be ordered arbitrarily by whatever the underlying data structure chooses, violating FIFO dispatch semantics expected of a ready queue. A secondary comparison `return a.insertionOrder - b.insertionOrder;` after the trainId checks is the missing tiebreaker. |

## ⚡ Quick Wins

- [ ] <!-- ACT-7c7940-1 --> **[correction · medium · small]** `src/priority.ts`: Add FIFO tiebreaker: after the trainId comparisons fall through to the final `return 0`, replace it with `return a.insertionOrder - b.insertionOrder;` so that equal-priority trains are dispatched in the order they entered the queue. [L11]
- [ ] <!-- ACT-b36eed-1 --> **[correction · medium · small]** `src/signals.ts`: Replace `MIN_HEADWAY - 1` with `MIN_HEADWAY` in canEnterBlock to enforce the documented 3-tick minimum headway. Currently admits a second train after only 2 elapsed ticks. [L14]

## 🔧 Refactors

- [ ] <!-- ACT-16367c-1 --> **[correction · high · large]** `src/dispatcher.ts`: Change loop guard from `d > 0` to `d >= 0` so the entry at `dispatched[0]` is also spliced from `readyQueue`, preventing stale entries that cause phantom re-dispatch and corrupt arrivals/occupancy data. [L68]
- [ ] <!-- ACT-e8e886-1 --> **[correction · high · large]** `src/interlocking.ts`: Change `blockHolder.get(currentBlock)` to `blockHolder.get(block)` in isBlockFree (L12). The current code checks the train's own current block instead of the target block, defeating all block-occupancy protection and allowing collisions. [L12]
