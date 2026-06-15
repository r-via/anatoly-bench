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
- **Correction [OK]**: Correctly counts all SCATTER symbols across the full grid; matches documented behavior.
- **Overengineering [LEAN]**: Simple nested loop counting a specific symbol across a 2D array. No abstraction layers, no unnecessary generics.
- **Tests [NONE]**: No test file found. Used by engine.ts but no coverage for empty reels, single scatter, exactly 3 scatters, or mixed symbol grids.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing description of what constitutes a scatter count, parameter shape, and return value semantics.

#### `handleFreeSpins` (L13–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: All three documented state transitions are implemented correctly; deactivation guard (remaining <= 0) is safe.
- **Overengineering [LEAN]**: Straightforward state machine with three documented transitions. Directly implements the spec from Core-Concepts.md with no extra indirection.
- **Tests [NONE]**: No test file found. Critical state-mutation logic with 4 distinct branches (activate, retrigger, decrement, deactivate) has zero test coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. State mutation side effects, the three transition branches, and the re-trigger behavior (adding 10 vs resetting) are non-obvious and undocumented.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | FAIL | MEDIUM | Both exported functions `detectScatters` and `handleFreeSpins` lack JSDoc. Given the non-obvious mutation semantics of `handleFreeSpins` (void return, in-place state change, re-trigger logic), JSDoc is particularly important here. [L3-L24] |

### Suggestions

- Add JSDoc to `detectScatters` to document the grid-wide (non-payline) counting behavior.
  ```typescript
  // Before
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  // After
  /**
   * Counts SCATTER symbols across the entire reel grid (not restricted to paylines).
   * @param reels - 2-D reel array (columns × rows)
   * @returns Total number of SCATTER symbols visible
   */
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  ```
- Add JSDoc to `handleFreeSpins` to document the in-place mutation semantics and the three distinct state transitions.
  ```typescript
  // Before
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  // After
  /**
   * Mutates `state` in place according to free-spin transition rules:
   * - 3+ scatters, not active → activates, sets remaining = 10
   * - 3+ scatters, already active → adds 10 to remaining (re-trigger)
   * - active, fewer than 3 scatters → decrements remaining; deactivates at 0
   * @param state - Mutable free-spin state maintained by the caller across spins
   * @param scatters - Scatter count from `detectScatters` for the current spin
   */
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
