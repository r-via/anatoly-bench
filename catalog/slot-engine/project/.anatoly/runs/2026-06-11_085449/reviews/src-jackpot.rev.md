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
- **Correction [OK]**: Correctly counts DIAMOND symbols across all cells and returns true when count >= 4, matching the documented threshold exactly.
- **Overengineering [LEAN]**: Flat double loop counting DIAMOND occurrences across a 2D array. Minimal, direct, no unnecessary abstractions.
- **Tests [NONE]**: No test file found. Critical business logic (jackpot detection) used by src/engine.ts has zero coverage — no happy path, no boundary (exactly 4 diamonds), no edge cases (empty reels, fewer than 4 diamonds).
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment. Exported public function with non-obvious semantics: the DIAMOND threshold of 4, grid-wide counting (not payline-restricted), and the ReadonlyArray<ReadonlyArray<Symbol>> parameter shape all warrant documentation.

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 8 | ESLint compliance | WARN | HIGH | Magic number `4` on L10 would trigger `no-magic-numbers`. Extract to a named constant. [L10] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `isJackpotHit` is a public export with no JSDoc. At minimum, document the `reels` parameter and the ≥4 DIAMOND threshold. [L3] |

### Suggestions

- Extract the jackpot threshold into a named constant to eliminate the magic number and make threshold changes reviewable.
  ```typescript
  // Before
  return diamondCount >= 4;
  // After
  const JACKPOT_DIAMOND_THRESHOLD = 4;
  // ...
  return diamondCount >= JACKPOT_DIAMOND_THRESHOLD;
  ```
- Add JSDoc to the exported function documenting the parameter shape and threshold.
  ```typescript
  // Before
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  // After
  /**
   * Returns `true` when the reel grid contains 4 or more DIAMOND symbols.
   * @param reels - The full 5×3 reel grid produced by a single spin.
   */
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
