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
- **Correction [NEEDS_FIX]**: Two independent defects: SCATTER detection skips the wild-substitution path, and payout is not rounded down (violates casino slot-machine convention).
- **Overengineering [LEAN]**: Straightforward iterative match-count logic with a single WILD substitution pass. No unnecessary abstractions; complexity is proportional to slot payout rules.
- **Tests [NONE]**: No test file exists. Critical logic paths untested: WILD-leading substitution, SCATTER early return, matchCount < 3 cutoff, streak-break logic, multiplier × lineBet calculation.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment. Missing description of the wild-substitution logic, the hardcoded divisor (bet/10 implies 10 lines), the minimum match threshold of 3, and what the return value represents (payout amount in units of bet).

## Best Practices — 7/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | lineSymbols is never mutated but typed as Symbol[] rather than readonly Symbol[], losing compiler enforcement of read-only intent. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | computeLegacyPayout is exported with no JSDoc. The /10 payline divisor, WILD substitution semantics, and minimum-3-match rule are all undocumented. [L4] |
| 13 | Security | FAIL | HIGH | Gambling/casino domain inferred from paytable, reels, rng, jackpot, freespin filenames and WILD/SCATTER/matchCount vocabulary. bet / 10 at L22 uses IEEE 754 floating-point division: integer bets not divisible by 10 (e.g. 1, 3, 7) produce non-exact fractions (0.1, 0.3, 0.7). Subsequent multiplication by a paytable multiplier compounds the error, yielding imprecise coin payouts — a compliance risk under regulated gaming RNG/payout auditing. All monetary arithmetic must stay in integer coins and divide last (or use a Decimal lib). [L22] |
| 15 | Testability | WARN | MEDIUM | getPayMultiplier is hard-imported, making isolated unit tests require module-level mocking. Accepting an optional multiplierFn parameter would eliminate the coupling. [L2] |
| 17 | Context-adapted rules | WARN | MEDIUM | Magic number 10 (payline divisor) at L22 is undocumented and fragile — if payline count changes this silently breaks. Should be a named constant (e.g. const PAYLINE_COUNT = 10). The repeated "WILD" and "SCATTER" string literals would benefit from a shared const or enum defined in types.ts. [L22] |

### Suggestions

- Mark lineSymbols parameter as readonly to prevent accidental mutation and signal read-only intent.
  - Before: `function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number`
  - After: `function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number`
- Eliminate float imprecision in gambling payouts by keeping arithmetic in integer coins and dividing last.
  ```typescript
  // Before
  const lineBet = bet / 10;
  return multiplier * lineBet;
  // After
  // Stay in integer coins; divide at the final step
  return Math.round(multiplier * bet / PAYLINE_COUNT);
  ```
- Extract the payline divisor as a named constant to remove the magic number.
  ```typescript
  // Before
  const lineBet = bet / 10;
  // After
  const PAYLINE_COUNT = 10; // defined once, exported from types.ts
  const lineBet = bet / PAYLINE_COUNT;
  ```
- Add JSDoc to document parameters, return semantics, and the /PAYLINE_COUNT divisor.
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
  // After
  /**
   * Computes a single payline payout using legacy consecutive-match logic.
   * @param lineSymbols - Symbols on the evaluated payline, left-to-right.
   * @param bet - Total bet in integer coins (1–100). Line bet = bet / PAYLINE_COUNT.
   * @returns Payout in coins, or 0 for no match, SCATTER, or WILD-only lines.
   */
  export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** After wild substitution resolves `first`, re-check `if (first === "SCATTER") return 0;` before proceeding to match counting, so a WILD-leading SCATTER line is correctly skipped. [L7]
- **[correction · medium · small]** Wrap the return expression in Math.floor() — `return Math.floor(multiplier * lineBet)` — to ensure fractional-coin remainders are kept by the house, consistent with the RTP=95% target and slot-machine industry convention. [L23]
- **[utility · high · trivial]** Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `computeLegacyPayout` (`computeLegacyPayout`) [L4-L24]
