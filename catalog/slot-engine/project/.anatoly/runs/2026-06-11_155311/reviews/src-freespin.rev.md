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
- **Correction [OK]**: Correctly counts all SCATTER symbols across every cell of the full grid, matching the documented contract.
- **Overengineering [LEAN]**: Simple nested loop counting SCATTER symbols across a 2D grid. Minimal and appropriate for the task.
- **Tests [NONE]**: No test file exists. Critical path: called by the main spin engine. Missing coverage for zero scatters, mixed reels, and full scatter grids.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing description of grid traversal behavior, parameter shape, and return value semantics (total count across all reels, not per-reel).

#### `handleFreeSpins` (L13–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: All three documented state transitions (activate, retrigger, decrement/deactivate) are implemented correctly; `<= 0` guard on deactivation is a safe superset of the documented `=== 0` condition and handles any stale inconsistent state without harm.
- **Overengineering [LEAN]**: Three-branch if/else directly encodes the documented state-transition table. No unnecessary abstraction.
- **Tests [NONE]**: No test file exists. Four distinct branches (activate, retrigger, decrement, deactivate) are entirely untested despite being core free-spin lifecycle logic consumed by the spin engine.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Non-obvious state machine with three branches (activation, retrigger, decrement/deactivation) and mutation side-effects on state — all undocumented.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | Both exported functions (detectScatters, handleFreeSpins) lack JSDoc. These are public API consumed by engine.ts. [L3-L22] |

### Suggestions

- Add JSDoc to both exported functions so consumers and IDE tooling have inline documentation.
  ```typescript
  // Before
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  // After
  /**
   * Counts SCATTER symbols across the entire reel grid.
   * @param reels - 5×3 reel window (columns × rows)
   * @returns Total number of SCATTER symbols visible
   */
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  ```
- Add JSDoc to handleFreeSpins documenting its intentional mutation contract.
  ```typescript
  // Before
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  // After
  /**
   * Applies free-spin state transitions in place.
   * Mutates `state` directly; returns void.
   * @param state - Persistent free-spin state (mutated)
   * @param scatters - SCATTER count from the current spin
   */
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
