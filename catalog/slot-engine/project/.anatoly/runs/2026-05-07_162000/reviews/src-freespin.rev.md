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
- **Correction [OK]**: Correctly iterates all reels and all symbols, counting every SCATTER instance across the full grid — consistent with documented 5×3 grid-wide detection.
- **Overengineering [LEAN]**: Simple double-loop counter. Does exactly one thing: count SCATTER symbols across the full grid.
- **Tests [NONE]**: No test file found. Used by src/engine.ts but no tests cover scatter counting logic, including empty reels, zero scatters, or multiple scatters across columns.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing description of purpose, parameter shape (2D readonly array of symbols), and return value semantics (total count across all reels).

#### `handleFreeSpins` (L13–L25)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: All three branches match documented invariants exactly: initial trigger sets remaining=10, retrigger adds 10 more, normal active spin decrements by 1 and deactivates at 0.
- **Overengineering [LEAN]**: Three-branch if/else encodes the documented state machine (trigger, retrigger, decrement/deactivate) directly. Numeric literals are intentional per docs/03-Guides/02-Advanced-Configuration.md, which explicitly instructs editing them in-place to change behavior.
- **Tests [NONE]**: No test file found. Four distinct branches (trigger, re-trigger, decrement, deactivate) are all untested despite being critical game state logic used by src/engine.ts.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Non-trivial state-mutation logic with three distinct branches (trigger, retrigger, decrement/deactivate) warrants documentation of params, side effects on FreeSpinState, and the threshold/award constants.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | FAIL | MEDIUM | Both exported functions (`detectScatters`, `handleFreeSpins`) lack JSDoc. For a public API that the docs reference extensively, parameter contracts and return semantics should be documented inline. [L3-L23] |

### Suggestions

- Add JSDoc to both exported functions to document parameter contracts and side-effects.
  ```typescript
  // Before
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  // After
  /**
   * Counts every SCATTER symbol visible across all reels (entire 5×3 grid).
   * @param reels - Full reel window as a column-major readonly 2-D array.
   * @returns Total number of SCATTER symbols found.
   */
  export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  ```
- Add JSDoc to `handleFreeSpins` documenting mutation side-effects.
  ```typescript
  // Before
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  // After
  /**
   * Mutates `state` in-place to reflect free-spin transitions.
   * Triggers a 10-spin session on ≥3 scatters, adds 10 on retrigger,
   * and decrements remaining spins otherwise.
   * @param state - Mutable free-spin session record (modified in place).
   * @param scatters - Number of SCATTER symbols detected this spin.
   */
  export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
