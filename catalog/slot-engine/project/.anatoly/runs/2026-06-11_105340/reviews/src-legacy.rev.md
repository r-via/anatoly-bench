# Review: `src/legacy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| computeLegacyPayout | function | yes | OK | LEAN | DEAD | UNIQUE | - | 90% |

### Details

#### `computeLegacyPayout` (L4–L24)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Logic is correct: WILD substitution for first-symbol resolution, contiguous-run counting with mid-line WILD support, SCATTER/all-WILD guard, and paytable lookup all behave as expected for a standard slot line evaluator.
- **Overengineering [LEAN]**: Straightforward slot-line payout: resolve effective symbol, count consecutive matches with WILD substitution, look up multiplier, apply line bet. Each step is necessary; no unnecessary abstraction or generalization.
- **Tests [NONE]**: No test file exists. Logic covers WILD substitution, SCATTER early return, match counting, minimum match threshold, and payout calculation — all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Non-obvious behavior includes WILD substitution logic (first non-WILD symbol used as anchor), early return of 0 for WILD/SCATTER leads, minimum match count of 3, and lineBet derivation as bet/10 — none documented.

## Best Practices — 7.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | lineSymbols is never mutated but declared as mutable Symbol[]. Should be readonly Symbol[]. [L4] |
| 8 | ESLint compliance | WARN | HIGH | Two issues: (1) index-based for loop violates prefer-for-of since i is only used for lineSymbols[i], and break is compatible with for...of; (2) import type { Symbol } shadows the global Symbol built-in — several ESLint configs (including @typescript-eslint/no-shadow with hoist: all) flag this even for type-only imports. [L1,L11-L15] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | computeLegacyPayout has no JSDoc. The bet unit (total coins vs per-line coins), the required lineSymbols length, and the return unit are all implicit. [L4] |
| 13 | Security | FAIL | HIGH | Casino/slot-machine domain inferred from WILD/SCATTER/paytable/reels/jackpot vocabulary throughout the project. bet / 10 uses IEEE 754 floating-point division: for any bet not divisible by 10 (e.g. bet=3 → lineBet=0.30000000000000004) multiplier * lineBet accumulates per-spin precision errors that compound over millions of spins and can violate the contractual 95% RTP. Industry rule: monetary payout arithmetic in regulated gaming must use integer-coin arithmetic or a Decimal library. The safe minimum is to assert bet % 10 === 0 at the call boundary, or restructure to Math.round(multiplier * bet) / 10. [L21-L22] |

### Suggestions

- Mark parameter as readonly — function never mutates the array
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number`
  - After: `export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number`
- Replace index-based loop with for...of to satisfy prefer-for-of (break still works)
  ```typescript
  // Before
  for (let i = 0; i < lineSymbols.length; i++) {
      if (lineSymbols[i] === first || lineSymbols[i] === "WILD") {
        matchCount++;
      } else {
        break;
      }
    }
  // After
  for (const sym of lineSymbols) {
      if (sym === first || sym === "WILD") matchCount++;
      else break;
    }
  ```
- Eliminate floating-point payout drift for regulated gaming RTP accuracy
  ```typescript
  // Before
  const lineBet = bet / 10;
  return multiplier * lineBet;
  // After
  // Multiply in integer domain; divide once at the output boundary
  return (multiplier * bet) / 10;  // still float, but a single rounding vs two
  // Ideal: assert bet % 10 === 0 upstream, or accumulate in integer coins
  ```
- Add JSDoc to document parameter units and return semantics
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
  // After
  /**
   * Computes the payout for a single payline using legacy left-to-right matching.
   * @param lineSymbols - Ordered symbols on the payline, left to right.
   * @param bet - Total bet in coins (1–100 integer). Per-line bet is bet / 10.
   * @returns Payout in coins (0 if no winning run of ≥ 3).
   */
  export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]
