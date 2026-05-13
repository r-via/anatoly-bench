# Review: `src/legacy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| computeLegacyPayout | function | yes | OK | LEAN | DEAD | UNIQUE | - | 88% |

### Details

#### `computeLegacyPayout` (L4–L24)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [NEEDS_FIX]**: Floating-point monetary arithmetic with no floor rounding on payout return.
- **Overengineering [LEAN]**: Straightforward payout calculation: resolve leading symbol, count matching prefix, apply multiplier. No unnecessary abstractions or patterns.
- **Tests [NONE]**: No test file found. Function has multiple branches (WILD substitution, SCATTER early return, match counting, matchCount < 3 guard) with zero test coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing description of WILD substitution logic, SCATTER/WILD early-return behavior, minimum match threshold (3), lineBet derivation (bet/10), and @param/@returns annotations.

## Best Practices — 7.25/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `lineSymbols: Symbol[]` is read-only within the function but not marked `readonly`. Callers can mutate the array before/during the call with no type error. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `computeLegacyPayout` is a public export with no JSDoc. At minimum, parameters, return value, and the 10-line assumption should be documented. [L4] |
| 13 | Security | FAIL | HIGH | Gambling/casino domain inferred from paytable, reels, jackpot, freespin vocabulary and project structure. `const lineBet = bet / 10` divides an integer coin value (Bet: 1..100, per arbitrated README) by a hardcoded integer, producing an IEEE 754 float (e.g. bet=1 → lineBet=0.1, which is not exactly representable). Subsequent `multiplier * lineBet` compounds the imprecision. Floating-point arithmetic on monetary coin values is non-certifiable in regulated gaming environments; payout amounts must be computed in integer coins or via a Decimal library. [L21-L22] |
| 17 | Context-adapted rules | WARN | MEDIUM | Two magic numbers without named constants: `3` (minimum match count for a win) and `10` (assumed payline count for bet division). In regulated gambling code, payout logic must be auditable; unnamed literals impede review. Additionally, `computeLegacyPayout` carries no `@deprecated` annotation despite the 'legacy' naming, leaving callers without a migration signal. [L17-L21] |

### Suggestions

- Mark `lineSymbols` as readonly to enforce immutability at call sites.
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {`
- Replace float division with integer arithmetic. Compute in coins, divide only when producing the final display value or keep as integer coins throughout.
  ```typescript
  // Before
  const lineBet = bet / 10;
  return multiplier * lineBet;
  // After
  const LINE_COUNT = 10;
  // arithmetic in integer coins; caller converts to display units
  const lineBetCoins = Math.floor(bet / LINE_COUNT);
  return multiplier * lineBetCoins;
  ```
- Name magic constants for auditability in regulated gambling code.
  ```typescript
  // Before
  if (matchCount < 3) return 0;
  // After
  const MIN_MATCH = 3;
  if (matchCount < MIN_MATCH) return 0;
  ```
- Add JSDoc with @deprecated and parameter contracts.
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
  // After
  /**
   * Computes a single payline payout using the v1 matching algorithm.
   * @deprecated Use `engine.ts` payout resolution instead.
   * @param lineSymbols Symbols on one payline (left-to-right).
   * @param bet Total bet in coins (1–100, integer). Assumes 10 active lines.
   * @returns Payout in coins (integer).
   */
  export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Replace `multiplier * lineBet` (floating-point) with `Math.floor((multiplier * bet) / 10)` to ensure integer-coin payouts that round down, satisfying casino-domain exact-arithmetic and house-edge rounding conventions. [L23]
- **[utility · high · trivial]** Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `computeLegacyPayout` (`computeLegacyPayout`) [L4-L24]
