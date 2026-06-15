# Review: `src/dispatcher.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| MAX_TICKS | constant | no | OK | - | - | - | - | 60% |
| ActiveTrain | type | no | OK | - | - | - | - | 60% |
| runSchedule | function | yes | ERROR | ACCEPTABLE | - | - | - | 97% |

### Details

#### `MAX_TICKS` (L18–L18)

- **Correction [OK]**: Plain sentinel constant; no correctness issue.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal constant, but the value 200 and its role as a safety ceiling for the simulation loop are not explained anywhere in-source.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `ActiveTrain` (L20–L26)

- **Correction [OK]**: Interface fields match all read/write sites in runSchedule; no type mismatch.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on the interface or its fields. Fields like `dwellRemaining` and `ticksOnBlock` carry domain-specific semantics (tick units, relationship to traversal time) that are not obvious from names alone. Internal, so severity is reduced, but the lack of any field-level comments leaves ambiguity.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `runSchedule` (L28–L148)

- **Correction [ERROR]**: Off-by-one in dispatched-removal loop skips the first-dispatched train, leaving it in readyQueue permanently.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc comment. The README documents it in prose, but no TSDoc block appears on the function itself — no @returns describing SimulationReport fields, no note on the early-exit condition, and no mention of the MAX_TICKS hard ceiling. (deliberated: confirmed — Confirmed. src/dispatcher.ts:76 — `for (let d = dispatched.length - 1; d > 0; d--)` uses `d > 0` instead of `d >= 0`, so `dispatched[0]` is never spliced from `readyQueue`. The first-dispatched train each tick leaks permanently. After it completes and is deleted from `activeTrains` (line 124), the stale readyQueue entry passes the `activeTrains.has()` guard at line 50, causing re-dispatch. Also blocks early termination at line 128 since `readyQueue.length` never reaches 0.)
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [ACCEPTABLE]**: *(default — evaluator did not produce a result)*
- **Tests [-]**: *(not evaluated)*

## Actions

### Refactors

- **[correction · high · large]** Change loop guard from `d > 0` to `d >= 0` so the entry at `dispatched[0]` is also spliced from `readyQueue`, preventing stale entries that cause phantom re-dispatch and corrupt arrivals/occupancy data. [L68]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `runSchedule` (`runSchedule`) [L28-L148]
