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
- **Correction [OK]**: Correctly counts all SCATTER symbols across the entire grid, matching documented behavior (not payline-restricted).
- **Overengineering [LEAN]**: Flat nested loop counting a single symbol value. No unnecessary abstraction.
- **Tests [NONE]**: No test file exists. Used by engine.ts; edge cases like empty reels, no scatters, mixed symbols, and all-scatter grids are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing description of what constitutes a scatter count, parameter shape, and return value semantics.

#### `handleFreeSpins` (L13–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Trigger (inactive→active, remaining=10), retrigger (+10), and decrement-to-deactivate branches all match documented invariants. The `<= 0` guard safely handles any edge case where remaining underruns. The retrigger branch does not consume the current spin, but docs specify only '+10 more spins' without requiring a concurrent decrement, so behavior is within spec.
- **Overengineering [LEAN]**: Three-branch if/else covers exactly the three documented state transitions (trigger, retrigger, decrement). Minimal and direct.
- **Tests [NONE]**: No test file exists. Four distinct branches (activate, retrigger, decrement, deactivate) are all untested, including the boundary condition at remaining <= 0.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The trigger threshold (≥3), initial award (10 spins), retrigger logic (+10), and decrement-to-deactivation behavior are non-obvious and undocumented.

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | handleFreeSpins mutates the state argument in-place (state.active, state.remaining). Returning a new FreeSpinState would be more idiomatic and easier to audit — important in regulated gaming context where state transitions should be traceable. [L14-L24] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | Both exported functions (detectScatters, handleFreeSpins) lack JSDoc. As game-engine API surface, documenting parameter semantics (e.g. that scatters is a raw count across the full grid) and side-effects (in-place mutation) is important. [L3,L14] |
| 15 | Testability | WARN | MEDIUM | detectScatters is a pure function — excellent. handleFreeSpins mutates its argument and returns void, requiring callers to construct mutable state objects and diff them to observe behaviour. A pure signature (state: Readonly<FreeSpinState>): FreeSpinState would make unit tests more ergonomic and eliminate shared-mutation hazards. [L14-L24] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine domain (SCATTER, free spins, reels). handleFreeSpins returns void, so callers cannot directly determine how many spins were awarded by the current call — they must snapshot state before/after to populate SpinResult.freeSpinsAwarded (required per the authoritative docs). Returning { spinsAwarded: number } or a full new FreeSpinState would make the contract explicit and the audit trail clearer for regulated gaming compliance. [L14-L24] |

### Suggestions

- Make handleFreeSpins pure and surface the awarded count, eliminating the void/mutation pattern and making SpinResult.freeSpinsAwarded trivially derivable.
  ```typescript
  // Before
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
    if (!state.active && scatters >= 3) {
      state.active = true;
      state.remaining = 10;
    } else if (state.active && scatters >= 3) {
      state.remaining += 10;
    } else if (state.active) {
      state.remaining--;
      if (state.remaining <= 0) state.active = false;
    }
  }
  // After
  export function handleFreeSpins(
    state: Readonly<FreeSpinState>,
    scatters: number
  ): { next: FreeSpinState; spinsAwarded: number } {
    if (!state.active && scatters >= 3) {
      return { next: { ...state, active: true, remaining: 10 }, spinsAwarded: 10 };
    }
    if (state.active && scatters >= 3) {
      return { next: { ...state, remaining: state.remaining + 10 }, spinsAwarded: 10 };
    }
    if (state.active) {
      const remaining = state.remaining - 1;
      return { next: { ...state, remaining, active: remaining > 0 }, spinsAwarded: 0 };
    }
    return { next: state, spinsAwarded: 0 };
  }
  ```
- Add JSDoc to both public exports documenting parameters, side-effects, and return values.
  ```typescript
  // Before
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  // After
  /**
   * Counts SCATTER symbols across the entire reel grid.
   * @param reels - Full reel window (e.g. 5 columns × 3 rows).
   * @returns Total SCATTER count regardless of position.
   */
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
