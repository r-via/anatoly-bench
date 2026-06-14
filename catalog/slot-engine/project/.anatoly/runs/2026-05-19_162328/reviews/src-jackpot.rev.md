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
- **Correction [OK]**: Correctly counts DIAMOND symbols across all reels and returns true when count >= 4, matching the documented invariant.
- **Overengineering [LEAN]**: Straightforward nested loop counting DIAMOND symbols across the 2D grid. No unnecessary abstractions, generics, or patterns — exactly minimal for the task.
- **Tests [NONE]**: No test file found. Critical game logic used by src/engine.ts has no test coverage — missing happy path (≥4 diamonds), boundary (exactly 4), negative case (<4), and edge cases (empty reels, single reel).
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public function with no JSDoc/TSDoc comment. Missing: purpose description, @param for reels, @returns explanation, and the critical constraint that ≥4 DIAMOND symbols anywhere in the grid triggers the jackpot.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | `isJackpotHit` is a public export with no JSDoc. Given the casino domain (jackpot logic is business-critical), documenting the 4-diamond threshold and the grid scan semantics would improve maintainability. [L3] |

### Suggestions

- Add JSDoc to document the jackpot trigger threshold and grid scan semantics
  ```typescript
  // Before
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  // After
  /**
   * Returns `true` when 4 or more DIAMOND symbols appear anywhere in the reel grid.
   * Scans all cells regardless of payline position.
   *
   * @param reels - Full reel grid (5 columns × 3 rows expected)
   */
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
