# Review: `src/dispatcher.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| MAX_TICKS | constant | no | OK | - | - | - | - | 60% |
| ActiveTrain | type | no | OK | - | - | - | - | 72% |
| runSchedule | function | yes | NEEDS_FIX | - | - | - | - | 95% |

### Details

#### `MAX_TICKS` (L18–L18)

- **Correction [OK]**: Plain numeric constant; no correctness issue.
- **UNDOCUMENTED [UNDOCUMENTED]**: No comment of any kind. The value 200 is an opaque ceiling — docs never mention a tick limit, so readers cannot know what happens when it is hit or why 200 was chosen.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `ActiveTrain` (L20–L26)

- **Correction [OK]**: Interface definition only; all fields are appropriately typed.
- **PARTIAL [PARTIAL]**: Internal, non-exported interface with no JSDoc. Most fields are self-explanatory, but the distinction between ticksOnBlock (traversal progress counter) and dwellRemaining (station hold-down counter) is subtle — both count down ticks in different phases and their interaction is non-obvious without reading the loop body.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `runSchedule` (L28–L148)

- **Correction [NEEDS_FIX]**: Two independent defects: off-by-one in dispatched-removal loop allows re-dispatch after arrival; reservation leak when isBlockFree/canEnterBlock fail after reserveSectionBlock succeeds.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc/TSDoc. README covers high-level usage but the function itself carries no inline documentation describing its return value shape, side-effects (resets signals and interlocking), early-exit condition, or the meaning of a null actualArrival in the returned arrivals list.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

## Actions

### Quick Wins

- **[correction · medium · small]** Change `d > 0` to `d >= 0` in the dispatched-removal loop so that the first dispatched train's readyQueue entry is also removed, preventing re-dispatch after arrival and allowing the early-exit condition to function correctly. [L76]
- **[correction · medium · small]** Move the `reserveSectionBlock` call (L108–L110) to after the `isBlockFree` (L112) and `canEnterBlock` (L113) checks, matching the dispatch-path ordering, so a reservation is never committed when the train cannot actually enter the block. [L108]

### Hygiene

- **[documentation · low · trivial]** Complete JSDoc documentation for: `ActiveTrain` (`ActiveTrain`) [L20-L26]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `runSchedule` (`runSchedule`) [L28-L148]
