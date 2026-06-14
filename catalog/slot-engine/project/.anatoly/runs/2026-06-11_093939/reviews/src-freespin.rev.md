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
- **Correction [OK]**: Correctly iterates all cells in the 5×3 grid and counts every SCATTER symbol; matches the documented contract exactly.
- **Overengineering [LEAN]**: Simple nested loop counting SCATTER symbols across the grid. Minimal and appropriate for the task.
- **Tests [NONE]**: No test file exists. Used by engine.ts but no coverage for empty reels, single scatter, exactly 3 scatters, or mixed symbol grids.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment. Missing parameter description for `reels`, return value explanation, and clarification that counting is grid-wide (not payline-confined).

#### `handleFreeSpins` (L13–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: All three state-transition branches match the reference documentation table precisely: initial activation sets remaining=10, retrigger adds 10, and active-with-fewer-than-3-scatters decrements and deactivates at ≤0.
- **Overengineering [LEAN]**: Three-branch state machine directly encoding the documented transition table. No unnecessary abstraction.
- **Tests [NONE]**: No test file exists. Critical state-machine logic (activation at 3 scatters, re-trigger, decrement, deactivation at 0) has zero test coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment. The three-branch state-transition logic (activate, retrigger +10, decrement/deactivate) is non-obvious and requires documentation; `state` mutation side-effect is also undocumented.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | Both exported functions (`detectScatters`, `handleFreeSpins`) lack JSDoc. For a published slot-engine library these are consumer-facing APIs that benefit from documented param semantics (e.g. mutation contract on `state`). [L4-L22] |

### Suggestions

- Add JSDoc to both exported functions documenting the mutation contract and parameter semantics.
  ```typescript
  // Before
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  // After
  /**
   * Applies free-spin state transitions in place.
   * @param state - Mutable free-spin state object; modified directly.
   * @param scatters - Number of SCATTER symbols counted this spin.
   */
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  ```
- Add JSDoc to `detectScatters` clarifying the full-grid (non-payline) scan.
  ```typescript
  // Before
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  // After
  /**
   * Counts SCATTER symbols across the entire 5×3 grid, independent of paylines.
   * @param reels - Column-major reel snapshot.
   * @returns Total scatter count.
   */
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
