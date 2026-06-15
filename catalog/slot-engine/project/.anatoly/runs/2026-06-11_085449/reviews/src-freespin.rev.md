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
- **Correction [OK]**: Correctly counts all SCATTER symbols across the full grid, matching the documented 5×3 whole-grid scan.
- **Overengineering [LEAN]**: Simple double-loop counter over a 2D array. Minimal and appropriate for grid-wide scatter counting.
- **Tests [NONE]**: No test file found. Symbol is called by src/engine.ts but has zero test coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment. Missing description of purpose, parameter meaning (reels layout), and return value semantics (scatter count across full grid).

#### `handleFreeSpins` (L13–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: All three state transitions (activate, retrigger, decrement/deactivate) match the arbitrated reference table exactly. The `<= 0` guard on deactivation is defensively correct.
- **Overengineering [LEAN]**: Three-branch state machine directly encoding the documented transition table. No unnecessary abstractions; mutation-in-place is intentional per design.
- **Tests [NONE]**: No test file found. Critical state-mutation logic (activation, re-trigger, decrement, deactivation) is entirely untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment. State mutation side-effects, retrigger logic (+10 on active + ≥3 scatters), and decrement-to-deactivation behavior are non-obvious and entirely undocumented.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | FAIL | MEDIUM | Both exported symbols `detectScatters` and `handleFreeSpins` lack JSDoc. These are public API surface for callers (as demonstrated in the workflow guide). [L3-L23] |

### Suggestions

- Add JSDoc to both public exports to document parameters, return values, and side-effects (especially mutation for `handleFreeSpins`).
  ```typescript
  // Before
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  // After
  /**
   * Counts all SCATTER symbols across the entire reel grid.
   * @param reels - Full reel window (5 × 3).
   * @returns Total number of SCATTER symbols visible.
   */
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  ```
- Add JSDoc for `handleFreeSpins` documenting its mutation contract.
  ```typescript
  // Before
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  // After
  /**
   * Mutates `state` in place according to free-spin transition rules.
   * - Not active + ≥3 scatters → activates, sets remaining = 10.
   * - Active + ≥3 scatters → adds 10 to remaining (retrigger).
   * - Active + <3 scatters → decrements remaining; deactivates at 0.
   * @param state - Persistent free-spin state (mutated in place).
   * @param scatters - Scatter count from the current spin.
   */
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
