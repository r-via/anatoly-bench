# Review: `src/legacy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| computeLegacyPayout | function | yes | OK | LEAN | DEAD | UNIQUE | - | 72% |

### Details

#### `computeLegacyPayout` (L4–L24)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [NEEDS_FIX]**: Return value can be a non-integer coin amount; slot-machine payouts must floor (house keeps the fractional remainder).
- **Overengineering [LEAN]**: Straightforward linear scan: resolve effective symbol from WILD prefix, count consecutive matches, lookup multiplier, return payout. No unnecessary abstractions or generics.
- **Tests [NONE]**: No test file found. No coverage for WILD substitution logic, SCATTER early return, matchCount threshold, or multiplier calculation.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment. Missing description of purpose, parameter semantics (what 'bet' represents, expected length of lineSymbols), return value (coins? credits?), WILD substitution logic, minimum match threshold of 3, and the lineBet = bet/10 divisor assumption.

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | lineSymbols is never mutated inside the function; the parameter type should be readonly Symbol[] to signal and enforce immutability. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | computeLegacyPayout is a public export with non-obvious behaviour (WILD substitution logic, minimum-3 match guard, lineBet = bet/10 denominator) but has no JSDoc. [L4] |
| 13 | Security | WARN | HIGH | Slot-machine domain inferred from WILD/SCATTER/CHERRY/LEMON/BELL/BAR/SEVEN/DIAMOND vocabulary and paytable import. bet / 10 followed by multiplier * lineBet uses floating-point arithmetic on a monetary value; inputs such as bet=1 produce lineBet=0.1, which is not exactly representable in IEEE 754. In regulated gaming, payout arithmetic must be exact (integer credits or a Decimal library). Use integer arithmetic throughout. [L21-L22] |

### Suggestions

- Mark the array parameter readonly to prevent accidental mutation and improve call-site type safety.
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {`
- Replace floating-point monetary arithmetic with integer-credit arithmetic to avoid IEEE 754 precision loss in regulated gaming payouts.
  ```typescript
  // Before
  const lineBet = bet / 10;
  return multiplier * lineBet;
  // After
  // bet and multiplier in integer credits; divide once at presentation layer
  const payoutCredits = multiplier * bet;
  return Math.round(payoutCredits) / 10;
  ```
- Add JSDoc documenting the WILD substitution rule, minimum-match guard, and line-bet denominator.
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
  // After
  /**
   * Computes the legacy (pre-wild-boost) payout for a single payline.
   * WILDs substitute for the first non-WILD symbol; SCATTER always yields 0.
   * Requires at least 3 consecutive matching symbols from reel 0.
   * @param lineSymbols - Ordered symbols on the evaluated payline (length 3–5).
   * @param bet - Total bet in credits; line bet is derived as bet / 10.
   * @returns Payout in credits, or 0 when no qualifying match is found.
   */
  export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Apply Math.floor to the final return value so payout is always an integer number of coins: `return Math.floor(multiplier * lineBet)`. Fractional coin payouts violate regulated gaming payout-rounding requirements. [L23]

### Refactors

- **[utility · medium · trivial]** Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `computeLegacyPayout` (`computeLegacyPayout`) [L4-L24]
