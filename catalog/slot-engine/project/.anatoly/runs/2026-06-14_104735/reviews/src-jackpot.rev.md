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
- **Correction [OK]**: Correctly counts DIAMOND symbols across all cells and returns true when count >= 4, matching the documented threshold.
- **Overengineering [LEAN]**: Flat double loop counting DIAMOND symbols with a single threshold comparison. Minimal and appropriate for a single-purpose predicate.
- **Tests [NONE]**: No test file exists. Critical jackpot logic consumed by core spin engine has zero test coverage — no happy path (≥4 diamonds), no boundary (exactly 4 vs 3), no edge cases (empty reels, single column).
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Non-obvious semantics: counts DIAMOND symbols across the entire grid (not paylines), triggers at ≥4. The threshold and grid-wide (not payline-restricted) behavior are invisible from the signature alone.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 8 | ESLint compliance | WARN | HIGH | The threshold `4` is an inline magic number. The `@typescript-eslint/no-magic-numbers` rule would flag this. The value is documented as intentional, but a named constant improves resilience to future threshold changes. [L10] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `isJackpotHit` is exported with no JSDoc. At minimum the parameter semantics (`reels` is 5×3 per spec) and return contract warrant a comment. [L3] |

### Suggestions

- Extract the jackpot threshold as a named constant to eliminate the magic number and make future threshold changes a single-line edit.
  ```typescript
  // Before
  return diamondCount >= 4;
  // After
  const JACKPOT_DIAMOND_THRESHOLD = 4;
  // ...
  return diamondCount >= JACKPOT_DIAMOND_THRESHOLD;
  ```
- Add JSDoc to the exported function documenting the parameter shape and the 4-DIAMOND rule.
  ```typescript
  // Before
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  // After
  /**
   * Returns `true` when the 5×3 reel grid contains 4 or more DIAMOND symbols.
   * @param reels - Column-major grid produced by the reel spin (5 columns × 3 rows).
   */
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
