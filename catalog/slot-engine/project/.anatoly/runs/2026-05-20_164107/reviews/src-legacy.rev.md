# Review: `src/legacy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| computeLegacyPayout | function | yes | OK | LEAN | DEAD | UNIQUE | - | 85% |

### Details

#### `computeLegacyPayout` (L4–L24)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [NEEDS_FIX]**: Returns fractional coins when `bet % 10 !== 0`, violating the integer-coin constraint from the arbitrated README (`type Bet = number; // 1..100 coins, integer`).
- **Overengineering [LEAN]**: Straightforward slot-line payout: resolve leading symbol, count consecutive matches, apply multiplier. No unnecessary abstractions, generics, or patterns. Logic is minimal for what it computes.
- **Tests [NONE]**: No test file found. Critical logic paths untested: WILD-first substitution, SCATTER early return, match-count threshold (< 3), and multiplier calculation.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Non-obvious behavior — WILD substitution logic, minimum match threshold of 3, lineBet as bet/10 — none of it is explained.

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `lineSymbols: Symbol[]` is never mutated but lacks `readonly`. Should be `ReadonlyArray<Symbol>`. [L4] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | `computeLegacyPayout` is exported but has no JSDoc. Parameters `lineSymbols` and `bet` and the return semantics (0 on no qualifying run) are undocumented. [L4] |
| 13 | Security | WARN | HIGH | Gambling/slot-machine domain inferred from WILD/SCATTER/CHERRY/SEVEN/jackpot/free-spins vocabulary throughout the project. `bet / 10` and `multiplier * lineBet` use IEEE 754 float arithmetic for monetary payouts (L22–L23). Regulated gaming environments require integer-cent arithmetic or a Decimal library — e.g., bet=1 produces lineBet=0.1, and floating-point multiplication of 0.1 × large multipliers can drift. No eval, hardcoded secrets, or injection vectors found. [L22-L23] |
| 17 | Context-adapted rules | WARN | MEDIUM | Gambling domain: (1) `10` is a magic number hardcoded as the line-count divisor — a named constant (e.g. `LINE_COUNT`) improves clarity; (2) `bet: number` has no guard for the documented 1..100 integer range, so an out-of-bounds bet silently produces an incorrect payout. [L4, L22] |

### Suggestions

- Mark the parameter readonly to signal non-mutation intent
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: ReadonlyArray<Symbol>, bet: number): number {`
- Add JSDoc for the exported function
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
  // After
  /**
   * Computes the legacy line payout for a given symbol run and total bet.
   * @param lineSymbols - Left-to-right symbols on one pay line.
   * @param bet - Total bet in coins (1–100 integer).
   * @returns Coin payout for this line; 0 if no qualifying run of 3+.
   */
  export function computeLegacyPayout(lineSymbols: ReadonlyArray<Symbol>, bet: number): number {
  ```
- Replace magic number 10 with a named constant and use integer-cent arithmetic to avoid float drift in regulated gambling payouts
  ```typescript
  // Before
  const lineBet = bet / 10;
  return multiplier * lineBet;
  // After
  const LINE_COUNT = 10;
  const lineBetCents = Math.round((bet / LINE_COUNT) * 100); // integer cents
  return Math.round(multiplier * lineBetCents) / 100;
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Wrap the return expression with Math.floor(): `return Math.floor(multiplier * lineBet)` to ensure whole-coin payouts when bet is not divisible by 10. [L23]
- **[utility · high · trivial]** Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `computeLegacyPayout` (`computeLegacyPayout`) [L4-L24]
