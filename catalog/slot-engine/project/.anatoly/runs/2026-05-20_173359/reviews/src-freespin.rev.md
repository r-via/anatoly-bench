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
- **Correction [OK]**: Flat double-loop over all cells counts every SCATTER symbol; matches documented full-grid scan.
- **Overengineering [LEAN]**: Simple nested loop counting SCATTER symbols across a 2D grid. Minimal and appropriate.
- **Tests [NONE]**: No test file exists. Called by src/engine.ts — no coverage of empty reels, single scatter, exactly 3 scatters, or multi-reel layouts.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing description of what constitutes a scatter count, parameter shape (2D reel grid), and return semantics.

#### `handleFreeSpins` (L13–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Three-branch if-else exactly implements the documented state machine: activate at 10, retrigger +10, decrement and deactivate at 0. The implicit fourth case (!active, scatters<3) correctly falls through with no mutation. Deactivation guard `<= 0` is safe defensive coding.
- **Overengineering [LEAN]**: Three-branch state machine directly encoding the documented transition table. No unnecessary abstraction.
- **Tests [NONE]**: No test file exists. Called by src/engine.ts — all three branches (activate, retrigger, decrement/deactivate) are untested, including boundary at remaining=1.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Non-obvious state machine with three branches (activation, retrigger, decrement/deactivation) and a mutation side-effect on `state` — all undocumented.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | FAIL | MEDIUM | Both exported functions (`detectScatters`, `handleFreeSpins`) lack JSDoc. `handleFreeSpins` in particular has non-obvious mutation semantics and a multi-branch state machine that would benefit from documentation. [L3-L23] |

### Suggestions

- Add JSDoc to both public exports to document mutation semantics and the state-machine transitions
  ```typescript
  // Before
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  // After
  /**
   * Advances free-spin state based on scatter count for the current spin.
   * Mutates `state` in place. Triggers on ≥ 3 scatters, retriggering adds 10.
   * @param state - Persistent free-spin state object (mutated).
   * @param scatters - Scatter count from the current spin grid.
   */
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
