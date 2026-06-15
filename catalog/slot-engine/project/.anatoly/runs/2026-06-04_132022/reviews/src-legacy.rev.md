# Review: `src/legacy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| computeLegacyPayout | function | yes | OK | LEAN | DEAD | UNIQUE | - | 80% |

### Details

#### `computeLegacyPayout` (L4–L24)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Moot — symbol is DEAD (was NEEDS_FIX: Missing Math.floor on payout return — fractional coins emitted for non-multiples-of-10 bets.)
- **Overengineering [LEAN]**: Straight-line payout logic: resolve wild anchor, count prefix match, look up multiplier, scale by line bet. Each step is necessary and non-redundant.
- **Tests [NONE]**: No test file found. WILD substitution logic, SCATTER early return, match counting, minimum match threshold, and payout calculation are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment. Non-obvious behavior includes: WILD substitution logic for the leading symbol, SCATTER early-return, minimum 3-match threshold, and lineBet = bet / 10 normalization — none of which are documented.

## Best Practices — 7.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | lineSymbols is never mutated; the parameter type should be ReadonlyArray<Symbol> to express that contract. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | computeLegacyPayout is exported with no JSDoc. Should document params, return value, and WILD/SCATTER behavior. [L4] |
| 13 | Security | FAIL | HIGH | Casino/slot-machine domain inferred from WILD/SCATTER/CHERRY/BELL/BAR/SEVEN/DIAMOND vocabulary and paytable structure. IEEE 754 floating-point division `bet / 10` produces imprecise results for bets not divisible by 10 (e.g. bet=1 → 0.10000000000000001; 1000 × 0.1 = 100.00000000000001 in JS). Regulated gaming requires deterministic, exact payout arithmetic; integer coin arithmetic avoids this class of error. [L21] |
| 17 | Context-adapted rules | WARN | MEDIUM | Magic number 10 (payline count divisor) is hardcoded without a named constant or parameter. In a slot engine the line count is configurable; coupling it as a literal makes the function incorrect when line count changes. No validation of bet against the documented 1..100 integer range (README: type Bet = number; // 1..100 coins, integer). [L21] |

### Suggestions

- Mark the parameter as read-only to enforce immutability at the call site
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: ReadonlyArray<Symbol>, bet: number): number {`
- Replace floating-point line-bet division with integer coin arithmetic to guarantee exact payouts in a regulated gaming context
  ```typescript
  // Before
  const lineBet = bet / 10;
  return multiplier * lineBet;
  // After
  // Work in whole coins; LINE_COUNT = 10 paylines
  const LINE_COUNT = 10;
  const payout = multiplier * bet;
  // Integer division — fractional coins are not issued
  return Math.floor(payout / LINE_COUNT);
  ```
- Extract the hardcoded payline count to a named constant or parameter
  ```typescript
  // Before
  const lineBet = bet / 10;
  // After
  const LINE_COUNT = 10; // number of active paylines
  const lineBet = bet / LINE_COUNT;
  ```
- Add JSDoc to the public export
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
  // After
  /**
   * Computes the payout for a single payline using the legacy (v1) algorithm.
   * WILD substitutes for any non-SCATTER symbol; SCATTER and all-WILD lines return 0.
   * Requires a consecutive run of ≥ 3 matching symbols from the left.
   * @param lineSymbols - Ordered symbols on the evaluated payline.
   * @param bet - Total bet in coins (1–100 integer).
   * @returns Payout in coins, or 0 if no qualifying run.
   */
  export function computeLegacyPayout(lineSymbols: ReadonlyArray<Symbol>, bet: number): number {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Wrap the return expression with Math.floor: `return Math.floor(multiplier * lineBet);` — slot-machine payouts must be integer coins and rounding must favour the house. [L23]
- **[utility · high · trivial]** Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `computeLegacyPayout` (`computeLegacyPayout`) [L4-L24]
