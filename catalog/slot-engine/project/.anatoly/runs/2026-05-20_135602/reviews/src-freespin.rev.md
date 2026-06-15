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
- **Correction [OK]**: Counts all SCATTER symbols across every cell of the grid, matching the documented 5×3 full-grid count.
- **Overengineering [LEAN]**: Flat double loop over a 2D array, single counter, single return. Minimal and appropriate for counting scatter symbols across the grid.
- **Tests [NONE]**: No test file found. Used in src/engine.ts with no coverage for empty reels, single scatter, or multi-reel scatter counting.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing description of what constitutes a scatter count, the grid traversal approach, and return value semantics.

#### `handleFreeSpins` (L13–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: All three documented state transitions (activate, retrigger, decrement/deactivate) are implemented correctly; `<= 0` guard is a safe defensive extension of the 'deactivates when 0' contract.
- **Overengineering [LEAN]**: Three mutually exclusive branches encode the exact state-machine table from the spec. No unnecessary abstraction; direct mutation of a simple state object.
- **Tests [NONE]**: No test file found. Critical state mutation logic with 4 branches (activation, retrigger, decrement, deactivation) has zero test coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The three-branch state machine (activate, retrigger, decrement/deactivate) and mutation-in-place behavior are non-obvious and warrant documentation. Missing @param descriptions and side-effect notice.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | FAIL | MEDIUM | Both exported functions (detectScatters, handleFreeSpins) lack JSDoc. This is a library module with non-trivial state-transition semantics (the retrigger vs. initial-activation vs. decrement branching) that would benefit from inline documentation. [L3-L22] |

### Suggestions

- Add JSDoc to both public exports documenting the state-transition semantics
  ```typescript
  // Before
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  // After
  /**
   * Applies free-spin state transitions in place.
   * - Not active + ≥3 SCATTERs → activates, sets remaining = 10
   * - Active + ≥3 SCATTERs → retrigger, adds 10 to remaining
   * - Active + <3 SCATTERs → decrements remaining; deactivates at 0
   */
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  ```
- Add JSDoc to detectScatters clarifying the grid-wide (not payline-confined) count
  ```typescript
  // Before
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  // After
  /** Counts SCATTER symbols across the entire grid (all columns, all rows — not payline-confined). */
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
