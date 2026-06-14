# Review: `src/jackpot.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| isJackpotHit | function | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `isJackpotHit` (L3–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Counts DIAMOND symbols across all reels and returns true when count >= 4. Logic is straightforward: nested iteration, string equality check, threshold comparison. Matches documented jackpot threshold of 4+ DIAMONDs on a 5×3 grid. No type issues, no off-by-one, no missing error handling that would cause incorrect runtime behavior.
- **Overengineering [LEAN]**: Flat double-loop over a 2D array with a counter. Minimal and appropriate for the task.
- **Tests [NONE]**: No test file found. Function has no test coverage despite being imported by src/engine.ts (critical game engine path). Missing tests for: jackpot threshold (exactly 4 diamonds), below threshold (3 diamonds), zero diamonds, mixed symbols, empty reels, single reel.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing description of purpose, parameter semantics (grid structure, expected dimensions), return value meaning, and the hardcoded threshold of 4 DIAMONDs.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | `isJackpotHit` is a public export with no JSDoc. At minimum, document the threshold (≥ 4 DIAMONDs) and the grid traversal contract so callers understand the full-grid (not payline) evaluation. [L3] |

### Suggestions

- Add JSDoc to document the full-grid evaluation contract and the ≥4 threshold so callers don't have to read the implementation.
  ```typescript
  // Before
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  // After
  /**
   * Returns `true` when the reel grid contains 4 or more DIAMOND symbols.
   * Evaluation is grid-wide (not payline-restricted).
   *
   * @param reels - Full 5 × 3 symbol grid produced by a single spin.
   */
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
