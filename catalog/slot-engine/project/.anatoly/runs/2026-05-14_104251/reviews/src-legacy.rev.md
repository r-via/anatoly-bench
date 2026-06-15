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
- **Correction [NEEDS_FIX]**: Two independent payout-calculation defects on lines 22–23: floating-point division produces non-integer lineBet for most valid bet values, and the return value is never floored, leaking fractional coins to the caller.
- **Overengineering [LEAN]**: Straightforward slot payout calculation: resolve leading symbol, count consecutive matches with WILD substitution, apply multiplier. Each step is necessary; no premature abstractions or unnecessary generics.
- **Tests [NONE]**: No test file found. Function has multiple branches: WILD-first substitution, SCATTER early return, match counting with WILD interleaving, matchCount<3 guard, and payout calculation — all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment. Missing description of WILD substitution logic, SCATTER early-exit behavior, the 3-match minimum, the lineBet division by 10, and param/return documentation.

## Best Practices — 4.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | lineSymbols is typed as mutable Symbol[]; the function never mutates it and should declare readonly Symbol[] to prevent accidental mutation at call sites. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | computeLegacyPayout is exported with no JSDoc. In a regulated gambling engine, payout logic should document parameter semantics (bet range, expected array length), return units, and edge cases (matchCount < 3, all-WILD line). [L4] |
| 13 | Security | FAIL | HIGH | Casino/slot-machine domain confirmed by WILD/SCATTER literals, getPayMultiplier import, and README (95% RTP target, scatter bonuses, jackpot). `bet / 10` applies IEEE 754 floating-point division to a monetary value. For bet values not divisible by 10 (e.g. bet=1 → lineBet ≈ 0.10000000000000001), `multiplier * lineBet` accumulates rounding error. Aggregated over millions of spins this shifts actual RTP away from the contractual 95% target — a regulated-gaming compliance violation. Per industry rule: monetary arithmetic in gambling/financial code must use integer units or a Decimal library. [L21] |
| 17 | Context-adapted rules | WARN | MEDIUM | Casino engine context: README specifies Bet as integer 1..100, but the function accepts any number with no guard. A zero or negative bet silently produces zero or negative payout; a fractional bet compounds the floating-point issue in rule 13. [L4] |

### Suggestions

- Mark lineSymbols readonly to prevent accidental mutation
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {`
- Eliminate intermediate float by deferring division — or use a Decimal library for exact regulated-gaming arithmetic
  ```typescript
  // Before
  const lineBet = bet / 10;
  return multiplier * lineBet;
  // After
  // Option A: defer division to a single operation (reduces but does not eliminate float error)
  return (multiplier * bet) / 10;
  
  // Option B (preferred for regulated RTP): integer coins throughout
  // represent payout in deci-coins (×10), divide once at display layer
  ```
- Guard bet range per README contract before any calculation
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {
  // After
  export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {
    if (!Number.isInteger(bet) || bet < 1 || bet > 100) {
      throw new RangeError(`bet must be integer 1–100, got ${bet}`);
    }
  ```
- Add JSDoc for the only public export
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
  // After
  /**
   * Computes legacy left-to-right payout for a single payline.
   * @param lineSymbols - Symbols on the payline; WILD substitutes for any non-SCATTER symbol.
   * @param bet - Total bet in coins (integer 1–100). Line bet is bet / 10.
   * @returns Payout in coins, or 0 when fewer than 3 consecutive matches are found.
   */
  export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Replace `bet / 10` with integer-safe arithmetic (e.g. `Math.floor(bet / 10)`) so lineBet is always a whole number for any valid integer bet. [L22]
- **[correction · medium · small]** Wrap the return expression in `Math.floor(...)` to ensure the payout is a whole-coin integer and the house retains any fractional remainder, consistent with the 95% RTP / 5% house-edge contract. [L23]
- **[utility · high · trivial]** Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `computeLegacyPayout` (`computeLegacyPayout`) [L4-L24]
