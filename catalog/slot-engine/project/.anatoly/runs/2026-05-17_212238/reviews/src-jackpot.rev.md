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
- **Correction [OK]**: Correctly counts DIAMOND symbols across all cells and returns true when diamondCount >= 4, matching the documented threshold.
- **Overengineering [LEAN]**: Flat double-loop counter with a single threshold check. Minimal and appropriate for counting DIAMOND symbols across a 2D reel grid.
- **Tests [NONE]**: No test file found. Critical game logic with no coverage — missing tests for exactly 4 diamonds (boundary), fewer than 4, zero diamonds, diamonds spread across multiple reels vs. single reel, and empty reels input.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment. Missing description of the jackpot condition (≥4 DIAMOND symbols anywhere on the board), parameter doc for `reels`, and return value explanation.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | `isJackpotHit` is a public export with no JSDoc. A brief doc noting the ≥4 DIAMOND threshold and parameter shape would match the detail level in the reference docs. [L3] |

### Suggestions

- Add JSDoc to the exported function documenting the jackpot threshold and parameter shape.
  ```typescript
  // Before
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  // After
  /**
   * Returns `true` when four or more DIAMOND symbols appear anywhere on the board.
   * @param reels - Full reel grid (columns × rows).
   */
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
