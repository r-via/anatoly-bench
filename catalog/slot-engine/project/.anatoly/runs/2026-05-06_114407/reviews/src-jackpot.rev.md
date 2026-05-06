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
- **Correction [OK]**: Logic matches all documented invariants: counts every DIAMOND across the full grid and triggers on >= 4. Threshold, loop structure, and return value are correct.
- **Overengineering [LEAN]**: Flat double loop counting DIAMOND occurrences, returns a boolean threshold check. Matches the documented 4-or-more rule exactly. No unnecessary abstractions.
- **Tests [NONE]**: No test file exists. Critical game logic used by src/engine.ts has zero coverage — no tests for threshold boundary (3 vs 4 diamonds), empty reels, mixed symbols, or multi-reel distribution.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment. Missing description of purpose, parameter semantics (shape/dimensions of reels array), return value meaning, and the DIAMOND threshold (>=4) that drives the jackpot condition.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | FAIL | MEDIUM | isJackpotHit is a public export with no JSDoc. The trigger condition (>=4 DIAMOND symbols across the 5×3 grid), the parameter shape, and the informational-only semantics (per .anatoly/docs/03-Guides/02-Advanced-Configuration.md) should all be documented. [L3] |

### Suggestions

- Add JSDoc to document the jackpot trigger condition, parameter contract, and informational-only semantics (the engine does not auto-apply a prize).
  ```typescript
  // Before
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  // After
  /**
   * Returns `true` when four or more `DIAMOND` symbols appear anywhere across
   * the 5 × 3 reel grid in a single spin.
   *
   * **Note:** this flag is informational only. The engine does not add a
   * separate jackpot payout to `totalPayout`; callers must apply the
   * progressive prize when `jackpotHit` is `true`.
   *
   * @param reels - Column-major reel grid (5 reels × 3 rows).
   * @returns `true` if the jackpot condition is met, `false` otherwise.
   */
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
