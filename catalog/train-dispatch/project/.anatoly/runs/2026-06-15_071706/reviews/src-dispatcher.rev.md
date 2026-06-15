# Review: `src/dispatcher.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| MAX_TICKS | constant | no | OK | - | - | - | - | 95% |
| ActiveTrain | type | no | OK | - | - | - | - | 95% |
| runSchedule | function | yes | NEEDS_FIX | - | - | - | - | 97% |

### Details

#### `MAX_TICKS` (L18–L18)

- **Correction [OK]**: Simple sentinel constant; no correctness issue.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `ActiveTrain` (L20–L26)

- **Correction [OK]**: Interface definition only; all fields are used correctly by runSchedule.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `runSchedule` (L28–L148)

- **Correction [NEEDS_FIX]**: Off-by-one in dispatched-queue cleanup: condition `d > 0` skips index 0, so the first dispatched train (and the only train when exactly one is dispatched in a tick) is never removed from readyQueue.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

## Actions

### Quick Wins

- **[correction · medium · small]** Change loop condition from `d > 0` to `d >= 0` on line 68 so that all dispatched-train indices — including index 0 — are spliced out of readyQueue each tick. Without this fix, at least one dispatched train per tick is never removed, and trains can be incorrectly re-dispatched after arrival. [L68]
