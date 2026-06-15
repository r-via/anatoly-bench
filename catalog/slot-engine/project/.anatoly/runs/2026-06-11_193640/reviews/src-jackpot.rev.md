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
- **Correction [OK]**: Correctly counts DIAMOND symbols across all reels/rows and returns true when count >= 4, matching the documented threshold.
- **Overengineering [LEAN]**: Flat double loop counting DIAMOND occurrences across a 2D grid. Minimal and appropriate for a single-purpose predicate with one consumer.
- **Tests [NONE]**: No test file found. Critical game logic consumed by spin() — no coverage of the >=4 DIAMOND threshold, boundary case of exactly 4, fewer than 4, zero, or all-DIAMOND reels.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Non-obvious behavior (counts DIAMOND symbols globally across all reels, triggers at >=4) is not documented inline. The threshold and grid-wide (not payline-restricted) counting logic are critical contract details absent from the code.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | `isJackpotHit` is a public export with no JSDoc comment. Documenting the threshold invariant (≥ 4 DIAMONDs) and the grid traversal behavior would aid consumers. [L3] |

### Suggestions

- Add JSDoc to document the threshold invariant and grid-traversal contract for `isJackpotHit`.
  ```typescript
  // Before
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  // After
  /**
   * Returns `true` when the full reel grid contains 4 or more DIAMOND symbols.
   * Traverses all columns and rows; not restricted to paylines.
   *
   * @param reels - 2-D grid of symbols (columns × rows).
   */
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  ```
- Extract the magic threshold into a named constant for readability and single-point maintenance.
  ```typescript
  // Before
  return diamondCount >= 4;
  // After
  const JACKPOT_DIAMOND_THRESHOLD = 4;
  // ...
  return diamondCount >= JACKPOT_DIAMOND_THRESHOLD;
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
