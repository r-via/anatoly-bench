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
- **Correction [OK]**: Correctly iterates all cells across every reel column, counts DIAMOND occurrences, and returns true when count >= 4, matching the documented threshold.
- **Overengineering [LEAN]**: Flat double loop counting DIAMOND occurrences. No unnecessary abstractions; hardcoded threshold matches documented contract.
- **Tests [NONE]**: No test file found. Called by src/engine.ts — no coverage for threshold boundary (exactly 4 diamonds), fewer than 4, empty reels, or multi-column distribution.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The function name hints at purpose but non-obvious semantics are undocumented: the >= 4 DIAMOND threshold, that counting is grid-wide (not payline-restricted), and that the parameter represents a 2-D reel/column layout.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | `isJackpotHit` is a public export with no JSDoc. A brief description of the threshold rule and parameter shape would improve discoverability. [L3] |

### Suggestions

- Add JSDoc to the public export to document the threshold rule and parameter contract.
  ```typescript
  // Before
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  // After
  /**
   * Returns `true` when the reel grid contains 4 or more DIAMOND symbols.
   * Evaluated across the full 5 × 3 grid, independent of paylines.
   *
   * @param reels - The resolved reel grid (columns of symbols).
   */
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
