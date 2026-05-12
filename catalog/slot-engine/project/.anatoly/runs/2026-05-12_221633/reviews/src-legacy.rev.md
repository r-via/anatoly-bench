# Review: `src/legacy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| computeLegacyPayout | function | yes | OK | LEAN | DEAD | UNIQUE | - | 87% |

### Details

#### `computeLegacyPayout` (L4–L24)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [NEEDS_FIX]**: Payout returned as raw float; casino/slot domain requires integer coin payouts with floor rounding (house retains remainder).
- **Overengineering [LEAN]**: Linear payout calculation: WILD substitution, consecutive match counting, multiplier lookup. Each step is domain-required with no unnecessary abstraction.
- **Tests [NONE]**: No test file found. Critical logic paths untested: WILD-substitution on first position, SCATTER early return, match counting with mid-line WILD, matchCount < 3 threshold, lineBet calculation, and getPayMultiplier integration.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment. Missing description of WILD substitution logic, SCATTER/WILD early-return behavior, the minimum 3-match threshold, and the hardcoded divisor (bet / 10) assumption.

## Best Practices — 7.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | lineSymbols parameter is a mutable array but is only read, never mutated. Should be readonly Symbol[] to signal intent and prevent accidental mutation. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | computeLegacyPayout is exported but has no JSDoc. The WILD/SCATTER early-return behavior and the implicit 10-line assumption in the lineBet divisor are non-obvious and warrant documentation. [L4] |
| 13 | Security | FAIL | HIGH | Gambling/casino domain inferred from WILD/SCATTER/matchCount/lineSymbols vocabulary and sibling files (jackpot.ts, freespin.ts, paytable.ts). bet / 10 performs IEEE 754 floating-point division on integer coin bets. For bets not divisible by 10 (e.g. bet=1 → lineBet=0.1, bet=3 → lineBet=0.3), neither value is exactly representable, producing payout drift (e.g. 200 * 0.3 = 60.00000000000001). In regulated gaming, payout integrity is a compliance requirement; floating-point monetary arithmetic is unsafe. README.md confirms bet is integer coins (1..100). [L20-L21] |
| 17 | Context-adapted rules | WARN | MEDIUM | The divisor 10 in bet / 10 hardcodes a 10-line assumption with no constant or comment. If the active line count changes, this silently produces wrong payouts. A named constant (e.g. TOTAL_LINES) or a parameter would make the invariant explicit and testable. [L20] |

### Suggestions

- Mark lineSymbols as readonly to prevent accidental mutation and signal read-only intent.
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {`
- Use integer arithmetic for gambling payouts to avoid IEEE 754 drift. Compute in integer coin-units and divide only at display time, or use Math.round as a minimal guard.
  ```typescript
  // Before
  const lineBet = bet / 10;
  return multiplier * lineBet;
  // After
  const LINE_COUNT = 10;
  // Compute in integer hundredths to avoid floating-point drift
  const payoutCoins = Math.round(multiplier * bet) / LINE_COUNT;
  return payoutCoins;
  ```
- Replace the magic number 10 with a named constant to make the line-count assumption explicit.
  ```typescript
  // Before
  const lineBet = bet / 10;
  // After
  const LINE_COUNT = 10 as const;
  const lineBet = bet / LINE_COUNT;
  ```
- Add JSDoc documenting WILD substitution logic, SCATTER early-return, and the line-bet divisor assumption.
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
  // After
  /**
   * Computes the payout for a single payline using legacy left-to-right consecutive matching.
   * WILDs substitute for any non-SCATTER symbol. SCATTER wins are excluded (handled separately).
   * @param lineSymbols - Ordered symbols on the payline (left to right).
   * @param bet - Total bet in coins (1–100, integer). lineBet = bet / LINE_COUNT.
   * @returns Payout in coins, or 0 if fewer than 3 consecutive matches.
   */
  export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Replace `return multiplier * lineBet` with `return Math.floor(multiplier * lineBet)` to guarantee integer coin payouts and preserve the documented 5% house edge for all valid bet values (1..100). [L23]
- **[utility · high · trivial]** Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `computeLegacyPayout` (`computeLegacyPayout`) [L4-L24]
