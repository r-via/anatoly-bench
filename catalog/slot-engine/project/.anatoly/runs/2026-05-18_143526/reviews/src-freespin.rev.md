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
- **Correction [OK]**: Correctly counts all SCATTER symbols across every reel and row; matches the documented grid-wide (not payline) counting requirement.
- **Overengineering [LEAN]**: Flat nested loop counting a single symbol type — minimal and appropriate for a 5×3 grid scan.
- **Tests [NONE]**: No test file found. Used by engine.ts; no coverage for empty reels, single scatter, exactly 3 scatters, or non-scatter symbols.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Function purpose (count SCATTER symbols across entire grid), parameter shape, and return value semantics are not described.

#### `handleFreeSpins` (L13–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Three branches correctly implement trigger (inactive + ≥3 scatters → remaining=10), retrigger (active + ≥3 scatters → +10), and per-spin decrement with deactivation at 0; aligns with all documented invariants.
- **Overengineering [LEAN]**: Three-branch state machine maps directly to the documented trigger/retrigger/decrement logic with no extra abstraction.
- **Tests [NONE]**: No test file found. Used by engine.ts; all branches untested: initial activation (scatters>=3), retrigger, decrement, deactivation on remaining<=0.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Critical state-mutation logic — trigger threshold (≥3 scatters), initial award (10 spins), retrigger (+10), and decrement-to-deactivate behavior — is entirely undocumented.

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | detectScatters correctly takes ReadonlyArray<ReadonlyArray<Symbol>>. handleFreeSpins mutates its FreeSpinState argument in-place instead of returning a new state value, which violates immutability principles. [L13-L24] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | Both exported functions (detectScatters, handleFreeSpins) lack JSDoc. This is not a test file. [L3-L24] |
| 15 | Testability | WARN | MEDIUM | detectScatters is a pure function — ideal. handleFreeSpins mutates its argument, so tests must create a state object and assert post-mutation fields rather than asserting on a return value. Low coupling overall. [L13-L24] |
| 17 | Context-adapted rules | WARN | MEDIUM | Game engine utility: handleFreeSpins performs in-place state mutation. A pure function returning a new FreeSpinState would be idiomatic for composable game logic and avoid caller-side aliasing bugs. [L13-L24] |

### Suggestions

- Add JSDoc to both public exports
  ```typescript
  // Before
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  // After
  /**
   * Counts all SCATTER symbols across the entire reel grid.
   * @param reels - 2D array of reel columns, each containing row symbols
   * @returns total SCATTER count
   */
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  ```
- Return new FreeSpinState instead of mutating to satisfy immutability and improve testability
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
      if (state.remaining <= 0) {
        state.active = false;
      }
    }
  }
  // After
  export function handleFreeSpins(state: FreeSpinState, scatters: number): FreeSpinState {
    if (!state.active && scatters >= 3) {
      return { ...state, active: true, remaining: 10 };
    } else if (state.active && scatters >= 3) {
      return { ...state, remaining: state.remaining + 10 };
    } else if (state.active) {
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
