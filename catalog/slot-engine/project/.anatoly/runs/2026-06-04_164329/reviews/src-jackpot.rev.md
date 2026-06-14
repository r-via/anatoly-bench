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
- **Correction [OK]**: Counts DIAMOND symbols across all reels and returns true when count >= 4, matching the documented threshold exactly.
- **Overengineering [LEAN]**: Flat double loop counting DIAMOND occurrences, single threshold comparison. No unnecessary abstractions.
- **Tests [NONE]**: No test file found. Critical game logic (jackpot detection) used by src/engine.ts has zero coverage — no happy path, edge cases (exactly 4 diamonds, 3 diamonds, empty reels, single reel), or boundary tests.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public function with no JSDoc. Missing description of jackpot trigger logic (≥4 DIAMOND symbols across the full grid), parameter shape, and return semantics.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | `isJackpotHit` is a public export with no JSDoc. The function name is self-documenting but the 4-diamond threshold and the grid-wide (not payline-restricted) search behavior are non-obvious and worth documenting. [L3] |

### Suggestions

- Add JSDoc to document the grid-wide search and the hardcoded 4-diamond threshold.
  ```typescript
  // Before
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  // After
  /**
   * Returns true when the full reel grid contains 4 or more DIAMOND symbols.
   * Evaluated grid-wide — not restricted to paylines.
   * @param reels - 5×3 reel grid produced by the spin engine
   */
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  ```
- Extract the magic threshold to a named constant so it is visible at a glance and single-sourced.
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
