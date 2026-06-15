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
- **Correction [OK]**: Moot — symbol is DEAD (was NEEDS_FIX: Two defects in the payout arithmetic: floating-point division for monetary value and missing Math.floor, both violating slot-machine industry conventions.)
- **Overengineering [LEAN]**: Straightforward slot-line payout: resolve leading symbol, count consecutive matches (respecting WILDs), apply multiplier to line bet. Each step is necessary and minimal.
- **Tests [NONE]**: No test file exists for this module. Zero coverage for all paths: WILD substitution, SCATTER early return, match counting, match < 3 guard, and multiplier calculation.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public function with no JSDoc. Non-trivial semantics — WILD substitution for the anchor symbol, SCATTER early-return, minimum match threshold of 3, and lineBet derivation (bet/10) — none of which are described.

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `lineSymbols: Symbol[]` is never mutated but is not marked `readonly`. Should be `ReadonlyArray<Symbol>` to communicate intent and prevent accidental mutation. [L3] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `computeLegacyPayout` is the sole public export and has no JSDoc. At minimum, a one-line summary and `@param`/`@returns` tags are expected. [L3] |
| 13 | Security | WARN | HIGH | Casino/slot-machine domain inferred from WILD, SCATTER, CHERRY, jackpot, and paytable vocabulary across the project. `lineBet = bet / 10` performs IEEE 754 division on integer coin values (Bet: 1–100 per README). For bets not divisible by 10 (e.g., bet=1 → 0.1, not exactly representable), subsequent multiplication by large multipliers (e.g., DIAMOND × 1000) may produce fractional coin results that are legally required to be exact in regulated gaming. Integer-only arithmetic or a Decimal library is the safe convention. [L21] |
| 17 | Context-adapted rules | WARN | MEDIUM | Casino domain: `bet` is not validated against the documented 1–100 integer constraint (README: `type Bet = number; // 1..100 coins, integer`). A caller passing `bet=0` or a negative value silently produces a zero or negative payout. Additionally, `lineSymbols[0]` is accessed without bounds checking; an empty array yields `undefined` typed as `Symbol`, which propagates silently (returns 0 due to `matchCount < 3`, but the type unsoundness exists). [L3-L5] |

### Suggestions

- Mark the input array readonly to prevent accidental mutation and accurately model the call contract.
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: ReadonlyArray<Symbol>, bet: number): number {`
- Add JSDoc to the public export.
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
  // After
  /**
   * Evaluates a single pay-line using the legacy (pre-wildMultiplier) algorithm.
   * @param lineSymbols - Ordered symbols on the evaluated line (left to right).
   * @param bet - Total bet in coins (1–100 integer).
   * @returns Coin payout for the line, or 0 if no winning combination.
   */
  export function computeLegacyPayout(lineSymbols: ReadonlyArray<Symbol>, bet: number): number {
  ```
- Use integer arithmetic to avoid IEEE 754 precision issues on coin payouts. Scale bet to deci-coins, compute, then divide at the boundary.
  ```typescript
  // Before
  const lineBet = bet / 10;
  return multiplier * lineBet;
  // After
  // Keep arithmetic in integer deci-coins to avoid IEEE 754 rounding.
  return Math.round(multiplier * bet) / 10;
  ```
- Guard against invalid bet values at the casino domain boundary.
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
  // After
  export function computeLegacyPayout(lineSymbols: ReadonlyArray<Symbol>, bet: number): number {
    if (!Number.isInteger(bet) || bet < 1 || bet > 100) {
      throw new RangeError(`bet must be an integer in [1, 100], got ${bet}`);
    }
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Replace `const lineBet = bet / 10; return multiplier * lineBet` with `return Math.floor(multiplier * bet / 10)`. This keeps `multiplier * bet` as a safe integer product before the single division-and-floor, eliminating both IEEE 754 drift and fractional coin payouts, and enforces the slot-machine down-rounding rule. [L22]
- **[utility · high · trivial]** Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `computeLegacyPayout` (`computeLegacyPayout`) [L4-L24]
