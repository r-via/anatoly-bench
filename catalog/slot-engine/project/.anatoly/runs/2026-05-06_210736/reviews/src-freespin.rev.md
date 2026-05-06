# Review: `src/freespin.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| detectScatters | function | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| handleFreeSpins | function | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `detectScatters` (L3–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Correctly counts all SCATTER symbols across every reel cell, consistent with documented 5×3 full-grid scatter counting.
- **Overengineering [LEAN]**: Simple nested loop counting SCATTER symbols across the grid. Exactly what the docs specify, no unnecessary abstraction.
- **Tests [NONE]**: No test file exists. Function is used in engine.ts for core game logic but has zero test coverage across all paths: empty reels, no scatters, multiple scatters, scatter in multiple columns.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing description of purpose, parameter shape (2D readonly array), and return semantics (total SCATTER count across all reels).

#### `handleFreeSpins` (L13–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: All three branches (initial trigger, retrigger, decrement/deactivate) match documented invariants: first trigger sets remaining=10, retrigger adds 10, normal spin decrements; deactivation fires correctly at remaining≤0.
- **Overengineering [LEAN]**: Flat if/else chain implementing the three documented state transitions (trigger, retrigger, decrement). No abstraction beyond what the logic requires.
- **Tests [NONE]**: No test file exists. Six distinct branches (initial activation, re-trigger, decrement, deactivation, inactive+<3 scatters, active+<3 scatters approaching zero) are all untested despite being critical game state mutations.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Non-trivial state-mutation logic with three distinct branches (trigger, retrigger, decrement/deactivate) warrants documentation of parameters, side effects on FreeSpinState, and the threshold/award constants.

## Best Practices — 8.75/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 8 | ESLint compliance | WARN | HIGH | Magic number literals `3` and `10` appear inline in `handleFreeSpins` (L14, L16, L17). ESLint `no-magic-numbers` would flag these. The values are documented in `.anatoly/docs/03-Guides/02-Advanced-Configuration.md` but named constants would be safer against accidental drift. [L14-L17] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | Both exported functions `detectScatters` and `handleFreeSpins` lack JSDoc. Both are public API surface (referenced in internal docs). Param types and return semantics should be documented. [L3-L23] |
| 15 | Testability | WARN | MEDIUM | `detectScatters` is a pure function. `handleFreeSpins` mutates its argument and returns `void`, requiring callers to set up mutable state objects and assert side effects. A variant returning a new `FreeSpinState` would allow pure unit tests. [L12-L23] |

### Suggestions

- Extract magic numbers into named constants to prevent drift and satisfy no-magic-numbers lint rule
  ```typescript
  // Before
  if (!state.active && scatters >= 3) {
      state.remaining = 10;
    } else if (state.active && scatters >= 3) {
      state.remaining += 10;
  // After
  const SCATTER_TRIGGER = 3;
  const FREE_SPINS_AWARD = 10;
  
  if (!state.active && scatters >= SCATTER_TRIGGER) {
      state.remaining = FREE_SPINS_AWARD;
    } else if (state.active && scatters >= SCATTER_TRIGGER) {
      state.remaining += FREE_SPINS_AWARD;
  ```
- Add JSDoc to both public exports
  ```typescript
  // Before
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  // After
  /**
   * Counts all SCATTER symbols visible across the full grid.
   * @param reels - 5×3 reel window (columns of symbols)
   * @returns total number of SCATTER symbols found
   */
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  ```
- Consider a pure variant of handleFreeSpins that returns a new state for easier unit testing
  ```typescript
  // Before
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
    // mutates state in place
  }
  // After
  export function applyFreeSpins(state: Readonly<FreeSpinState>, scatters: number): FreeSpinState {
    if (!state.active && scatters >= SCATTER_TRIGGER) {
      return { ...state, active: true, remaining: FREE_SPINS_AWARD };
    }
    if (state.active && scatters >= SCATTER_TRIGGER) {
      return { ...state, remaining: state.remaining + FREE_SPINS_AWARD };
    }
    if (state.active) {
      const remaining = state.remaining - 1;
      return { ...state, remaining, active: remaining > 0 };
    }
    return state;
  }
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
