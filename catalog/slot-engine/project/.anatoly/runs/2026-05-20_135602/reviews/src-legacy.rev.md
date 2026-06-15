# Review: `src/legacy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| computeLegacyPayout | function | yes | OK | LEAN | DEAD | UNIQUE | - | 83% |

### Details

#### `computeLegacyPayout` (L4–L24)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [NEEDS_FIX]**: Payout not floored to whole coins: `bet / 10` is non-integer for bets not divisible by 10, and the result is never floored before return.
- **Overengineering [LEAN]**: Straightforward slot payout logic: resolve leading symbol, count consecutive matches with WILD substitution, apply multiplier. Each step is necessary; no abstractions, generics, or patterns introduced.
- **Tests [NONE]**: No test file found. Critical logic paths untested: WILD substitution, SCATTER early return, match counting with mixed WILDs, matchCount < 3 threshold, and multiplier/bet calculation.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Non-obvious behavior — WILD substitution logic, minimum match threshold of 3, line bet as bet/10, SCATTER/WILD early return — none of it is documented.

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | lineSymbols parameter is Symbol[] but the function never mutates it. Should be readonly Symbol[]. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | computeLegacyPayout is exported with no JSDoc. Parameters (lineSymbols, bet), return semantics, and WILD substitution logic should be documented. [L4] |
| 13 | Security | FAIL | HIGH | Gambling/casino domain inferred from reels, WILD, SCATTER, jackpot, paytable vocabulary and README RTP declaration. lineBet = bet / 10 applies floating-point division to a monetary coin amount. For bets like 1, 3, 7 coins, bet/10 produces non-exact IEEE 754 doubles (e.g. 0.1, 0.3, 0.7). Multiplied by large paytable values (up to 1000×), this accumulates rounding errors that violate regulated-gaming exactness requirements. Integer arithmetic (return (multiplier * bet) / 10 computed as Math.round or using integer cents) is the industry-standard fix. [L22-L23] |

### Suggestions

- Mark lineSymbols as readonly to prevent accidental mutation and communicate intent.
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {`
- Replace floating-point division with integer arithmetic to satisfy regulated-gaming exactness. Compute the payout in integer coin units, then divide once at the final return.
  ```typescript
  // Before
  const lineBet = bet / 10;
  return multiplier * lineBet;
  // After
  // payout in integer tenths-of-coin to avoid IEEE 754 drift
  return Math.round(multiplier * bet) / 10;
  ```
- Add JSDoc to the exported function.
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
  // After
  /**
   * Computes the legacy line payout for a resolved reel window row.
   * WILD symbols substitute for the first non-WILD symbol; SCATTER always returns 0.
   * @param lineSymbols - Ordered symbols on the evaluated payline (left to right).
   * @param bet - Total bet in coins (1–100, integer).
   * @returns Payout in coins, or 0 for no win.
   */
  export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Replace `const lineBet = bet / 10; return multiplier * lineBet;` with `return Math.floor(multiplier * bet / 10);` to guarantee integer coin payouts and correct casino rounding (round down, house keeps remainder). [L22]
- **[utility · high · trivial]** Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `computeLegacyPayout` (`computeLegacyPayout`) [L4-L24]
