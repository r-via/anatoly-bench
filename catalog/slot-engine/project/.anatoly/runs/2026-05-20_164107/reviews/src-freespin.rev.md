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
- **Correction [OK]**: Correctly iterates the full reels grid and counts every SCATTER symbol, matching the documented contract.
- **Overengineering [LEAN]**: Flat double loop over a 2D array counting a specific symbol. Minimal and appropriate.
- **Tests [NONE]**: No test file exists. Function is used by engine.ts but has zero test coverage for scatter counting logic, empty reels, or multi-column inputs.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing description of what constitutes a scatter count, parameter shape, and return value semantics.

#### `handleFreeSpins` (L13–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: All three state-transition branches match the authoritative table exactly: initial activation sets remaining=10, retrigger adds 10, active non-retrigger decrements and deactivates at ≤0.
- **Overengineering [LEAN]**: Three mutually exclusive state transitions encoded as if/else if. Directly implements the documented state table with no unnecessary abstraction.
- **Tests [NONE]**: No test file exists. Critical state-mutation function with 4 branches (activation, retrigger, decrement, deactivation) used by engine.ts — all branches untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. State mutation side-effects, the three-branch transition logic, retrigger behavior, and the meaning of the `scatters` threshold are all undocumented.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | Both `detectScatters` and `handleFreeSpins` are exported but lack JSDoc. Given the non-obvious mutation semantics of `handleFreeSpins` (void return, in-place state change), a doc comment is especially valuable. [L3-L23] |

### Suggestions

- Add JSDoc to both exported functions. `handleFreeSpins` especially benefits from documenting the mutation-in-place contract and the three transition branches.
  ```typescript
  // Before
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  // After
  /**
   * Counts all SCATTER symbols across the entire reel grid.
   * @param reels - Full 5×3 reel window (columns of symbols).
   * @returns Total number of SCATTER symbols visible.
   */
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  ```
- Document `handleFreeSpins` mutation semantics and the three state-transition cases.
  ```typescript
  // Before
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  // After
  /**
   * Mutates `state` in place to advance the free-spin lifecycle.
   * - Not active + ≥3 scatters → activates, sets remaining = 10.
   * - Active + ≥3 scatters → adds 10 to remaining (retrigger).
   * - Active + <3 scatters → decrements remaining; deactivates at 0.
   */
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
