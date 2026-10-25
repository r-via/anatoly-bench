# Review: `src/freespin.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| detectScatters | function | yes | OK | LEAN | USED | UNIQUE | - | 90% |
| handleFreeSpins | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | - | 75% |

### Details

#### `detectScatters` (L3–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Counts SCATTER symbols across all columns correctly.
- **Overengineering [LEAN]**: Simple nested loop counting SCATTER symbols. Minimal and appropriate.
- **Tests [-]**: *(not evaluated)*

#### `handleFreeSpins` (L13–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [NEEDS_FIX]**: The retrigger branch adds 10 spins but does not consume the current free spin. Industry convention for slot free-spin counters is that every round played, including the retrigger round, decrements the counter.
- **Overengineering [LEAN]**: Straightforward state-machine branching on free-spin state. No unnecessary abstraction. (deliberated: confirmed — src/freespin.ts:17-18: the retrigger branch (`state.active && scatters >= 3`) does `remaining += 10` with no decrement. The ordinary active branch (L19-20) decrements once per played spin. The function is inconsistent with itself: a retriggering free spin is never consumed, so the player gets one extra spin. The current blast radius is small. src/engine.ts:141 builds a fresh `{active:false,...}` state on every spin() call, so the retrigger branch is unreachable through the public API. Kept as NEEDS_FIX; not raised further because the convention is domain-dependent and the path is currently not exercised.)
- **Tests [-]**: *(not evaluated)*

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | handleFreeSpins mutates the FreeSpinState parameter in place. Magic number 10 is repeated and not a named constant. Input reels are correctly typed ReadonlyArray. [L14-L25] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Both exports (detectScatters, handleFreeSpins) lack JSDoc. Two exports, so WARN. [L3-L25] |
| 17 | Context-adapted rules | WARN | MEDIUM | Magic numbers 3 (scatter threshold) and 10 (free spins award) are hard-coded in several places; extract named constants. Gaming domain inferred (slot engine); no RNG here, so no domain-rule violation. [L14-L21] |

### Suggestions

- Extract magic numbers into named constants and add JSDoc
  ```typescript
  // Before
  if (!state.active && scatters >= 3) {
      state.active = true;
      state.remaining = 10;
  }
  // After
  const SCATTERS_TO_TRIGGER = 3;
  const FREE_SPINS_AWARD = 10;
  
  /** Updates free-spin state for a spin with the given scatter count. */
  if (!state.active && scatters >= SCATTERS_TO_TRIGGER) {
      state.active = true;
      state.remaining = FREE_SPINS_AWARD;
  }
  ```
- Return a new state instead of mutating the parameter
  - Before: `export function handleFreeSpins(state: FreeSpinState, scatters: number): void`
  - After: `export function handleFreeSpins(state: Readonly<FreeSpinState>, scatters: number): FreeSpinState`

## Actions

### Quick Wins

- **[correction · medium · small]** In the active-and-retrigger branch, decrement `state.remaining` for the spin just played, then add 10. Run the decrement and the `remaining <= 0` deactivation check for every active round. [L18]
