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
- **Correction [OK]**: Correctly iterates all cells of the 2D reel grid and counts SCATTER symbols. No off-by-one or type issues.
- **Overengineering [LEAN]**: Flat double loop over a 2D array counting a specific symbol. Minimal and appropriate for the task.
- **Tests [NONE]**: No test file found. Critical game logic used by engine.ts has zero test coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing description of what constitutes a scatter count, parameter shape, and return value semantics.

#### `handleFreeSpins` (L13–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: State transitions match the documented table: trigger at ≥3 scatters (remaining=10), retrigger adds 10, active spins decrement remaining and deactivate at 0. Retrigger not decrementing is consistent with documented intent ('Adds 10 to remaining') and is a common slot design variant. Edge cases: remaining 1→0 correctly deactivates; the <=0 guard prevents negative-remaining drift.
- **Overengineering [LEAN]**: Three mutually exclusive state transitions encoded as a simple if/else-if chain. No unnecessary abstraction; maps directly to the documented state table.
- **Tests [NONE]**: No test file found. State mutation logic with multiple branches (activation, re-trigger, decrement, deactivation) is completely untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The three-branch state machine logic (activate, retrigger, decrement/deactivate) and mutation side-effects are non-obvious and warrant documentation.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | FAIL | MEDIUM | Both exported functions (detectScatters, handleFreeSpins) lack JSDoc. handleFreeSpins has a non-obvious mutation side-effect that especially warrants documentation. [L3-L23] |

### Suggestions

- Add JSDoc to both public exports. handleFreeSpins particularly needs a note on in-place mutation.
  ```typescript
  // Before
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  // After
  /**
   * Counts SCATTER symbols across the entire reel grid.
   * @param reels - 2D array of symbols indexed [column][row]
   * @returns total SCATTER count
   */
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  ```
- JSDoc for handleFreeSpins should document mutation and all three state-transition branches.
  ```typescript
  // Before
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  // After
  /**
   * Applies free-spin state transitions based on scatter count. Mutates `state` in place.
   * - Not active + ≥3 scatters → activates, sets remaining = 10
   * - Active + ≥3 scatters → adds 10 (retrigger)
   * - Active + <3 scatters → decrements remaining; deactivates at 0
   * @param state - persistent FreeSpinState object; mutated directly
   * @param scatters - SCATTER count returned by detectScatters for this spin
   */
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
