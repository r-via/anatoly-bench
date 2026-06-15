# Review: `src/legacy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| computeLegacyPayout | function | yes | OK | LEAN | DEAD | UNIQUE | - | 82% |

### Details

#### `computeLegacyPayout` (L4–L24)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [NEEDS_FIX]**: Fractional coin payout for bets not divisible by 10 — slot machine domain requires whole-coin payouts, rounded down.
- **Overengineering [LEAN]**: Straightforward slot payout logic: resolve leading symbol, count contiguous matches, apply multiplier. No unnecessary abstractions, generics, or indirection.
- **Tests [NONE]**: No test file exists. Critical paths untested: WILD-leading lines, SCATTER early return, match count < 3 cutoff, exact multiplier * lineBet calculation.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment. Missing description of WILD substitution logic, SCATTER/WILD early-return behavior, minimum 3-match threshold, lineBet derivation (bet/10), and parameter/return semantics.

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `lineSymbols` is never mutated inside the function but is typed as `Symbol[]` (mutable). Should be `ReadonlyArray<Symbol>` to surface intent. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `computeLegacyPayout` is exported but has no JSDoc. Parameters (`lineSymbols`, `bet`) and edge cases (WILD-only line, matchCount < 3) are undocumented. [L4] |
| 13 | Security | FAIL | HIGH | Slot-machine domain inferred from lineSymbols/WILD/SCATTER/bet/paytable vocabulary and README RTP target. `bet / 10` introduces IEEE 754 imprecision: e.g. bet=3 → lineBet=0.3 (inexact), 0.3*25=7.499999999999999 instead of 7.5. Floating-point arithmetic on coin values is unsafe in a regulated gaming context; payouts must be computed with integer arithmetic or a Decimal library. Industry rule: financial/gambling payout calculations require exact arithmetic. [L21-L22] |

### Suggestions

- Mark the input array as readonly to communicate non-mutation intent and allow callers to pass ReadonlyArray without a cast.
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: ReadonlyArray<Symbol>, bet: number): number {`
- Replace floating-point per-line bet with integer arithmetic to avoid IEEE 754 rounding in payout results.
  ```typescript
  // Before
  const lineBet = bet / 10;
  return multiplier * lineBet;
  // After
  // Work in integer coins: multiply first, divide last to avoid fractional imprecision
  return Math.round(multiplier * bet) / 10;
  ```
- Add JSDoc to document parameters, the WILD substitution rule, and the minimum-3-match requirement.
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
  // After
  /**
   * Computes the line payout using legacy sequential-match rules.
   * WILDs at index 0 are substituted by the first non-WILD symbol;
   * a WILD-only or SCATTER-leading line returns 0.
   * Requires ≥ 3 consecutive matches (WILDs included) from the left.
   *
   * @param lineSymbols - Ordered symbols on a pay line (left to right).
   * @param bet - Total bet in coins (1–100 integer).
   * @returns Payout in coins, or 0 for no win.
   */
  export function computeLegacyPayout(lineSymbols: ReadonlyArray<Symbol>, bet: number): number {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Apply Math.floor to the return value so fractional coin payouts are truncated toward zero (house keeps remainder), satisfying the slot-machine whole-coin invariant for all valid bets 1..100. [L22]
- **[utility · high · trivial]** Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `computeLegacyPayout` (`computeLegacyPayout`) [L4-L24]
