# Review: `src/legacy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| computeLegacyPayout | function | yes | OK | LEAN | DEAD | UNIQUE | - | 90% |

### Details

#### `computeLegacyPayout` (L4–L24)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: RAG results show evaluateLine (0.718) and getPayMultiplier (0.707), both below the 0.82 threshold. Actual code comparison: evaluateLine differs in parameters (reels + payline indices vs pre-extracted symbols), output format (LineWin object vs number), and wild bonus formula (exponential multiplier vs lookup table). getPayMultiplier is a dependency called by computeLegacyPayout, not a duplicate. No semantic duplicate found.
- **Correction [OK]**: Logic is correct: WILD-substitution for the lead symbol, left-to-right consecutive counting with WILD pass-through, minimum-3 guard, and lineBet = bet/10 consistent with the documented payline formula.
- **Overengineering [LEAN]**: Single-responsibility function that handles exactly what a legacy payline evaluator must do: resolve the effective leading symbol under WILD substitution, count consecutive left-to-right matches, enforce the minimum-of-3 rule, and compute payout via multiplier × lineBet. The `bet / 10` line-bet split is consistent with the documented architecture (`.anatoly/docs/02-Architecture/02-Core-Concepts.md`). No unnecessary generics, no abstraction layers, no configuration objects — just direct imperative logic proportionate to the task.
- **Tests [NONE]**: No test file found for this source file. The function has multiple branches (WILD substitution logic, SCATTER exclusion, match counting, minimum match threshold of 3) and edge cases (all-WILD line, SCATTER presence, partial WILD matches) that are entirely untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment is present. The function has non-trivial logic including WILD substitution, left-to-right match counting with early break, a minimum match threshold of 3, and a line-bet calculation (bet / 10). None of these behaviors, parameter semantics, or the return value are documented.

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | The lineSymbols parameter is never mutated inside the function body but is typed as Symbol[] rather than readonly Symbol[]. The readonly modifier would make the non-mutation contract explicit and prevent accidental mutation at the call site. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | computeLegacyPayout is a public export with no JSDoc. The WILD promotion logic, minimum 3-symbol threshold, SCATTER guard, and the bet/10 line-bet formula are non-obvious behaviors that should be documented. [L4] |
| 13 | Security | FAIL | HIGH | Gambling/casino domain inferred from slot-machine vocabulary (paylines, WILD, SCATTER, DIAMOND, jackpot, free spins) across .anatoly/docs/02-Architecture/02-Core-Concepts.md and .anatoly/docs/04-API-Reference/01-Public-API.md. Industry rule: floating-point arithmetic on monetary payout values is unsafe in regulated gaming. `bet / 10` produces IEEE 754 results that are not exactly representable (e.g., bet=1 → lineBet=0.1), and `multiplier * lineBet` compounds the error. Regulated gambling engines must use integer arithmetic or a Decimal library for all payout calculations. [L21-L23] |

### Suggestions

- Mark lineSymbols as readonly to make the non-mutation contract explicit and prevent accidental in-place modification by future callers.
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {`
- Add JSDoc to document the public export contract, including WILD promotion, the minimum match threshold, and the line-bet formula.
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
  // After
  /**
   * Computes the coin payout for a single payline using the legacy evaluation algorithm.
   *
   * WILD symbols act as substitutes: the leading symbol is determined by the first
   * non-WILD in the line. A line composed entirely of WILDs returns 0.
   * SCATTER symbols are not evaluated for line wins and also return 0.
   * A minimum of 3 consecutive matching symbols (left-to-right) is required.
   *
   * @param lineSymbols - Ordered symbols on the payline, left to right.
   * @param bet - Total coin bet for the spin; line bet is derived as bet / 10.
   * @returns Coin payout for this payline; 0 when no qualifying combination is found.
   */
  export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {
  ```
- Replace floating-point monetary arithmetic with integer arithmetic to avoid IEEE 754 precision errors in regulated gambling payouts. Work in integer coin-tenths and convert only at the final output boundary.
  ```typescript
  // Before
  const multiplier = getPayMultiplier(first, matchCount);
  const lineBet = bet / 10;
  return multiplier * lineBet;
  // After
  const multiplier = getPayMultiplier(first, matchCount);
  // Avoid floating-point: compute in integer tenths-of-a-coin, round to nearest unit
  const payoutTenths = Math.round(multiplier * bet);
  return payoutTenths / 10;
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `computeLegacyPayout` (`computeLegacyPayout`) [L4-L24]
