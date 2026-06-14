# Review: `src/legacy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| computeLegacyPayout | function | yes | OK | LEAN | DEAD | UNIQUE | - | 65% |

### Details

#### `computeLegacyPayout` (L4–L24)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [NEEDS_FIX]**: Wild multiplier omitted: winning runs containing WILD symbols return basePayout only, not adjustedPayout = basePayout × (1 + wildCount) × 2^wildCount.
- **Overengineering [LEAN]**: Straight imperative logic: one lead-symbol resolution, one left-to-right match loop, one multiplier lookup, one arithmetic expression. No unnecessary abstractions or generalization.
- **Tests [NONE]**: No test file exists. Critical paths untested: WILD-only lines, SCATTER early return, WILD substitution logic, matchCount < 3 cutoff, and payout calculation via getPayMultiplier.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public function with no JSDoc/TSDoc comment. Missing description of legacy payout logic, @param docs for lineSymbols and bet, @returns explanation, and notable behavior (WILD lead substitution, SCATTER/all-WILD early return, minimum 3-match requirement, lineBet = bet/10).

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `lineSymbols` is typed as `Symbol[]` but the function never mutates it. The engine produces `ReadonlyArray<ReadonlyArray<Symbol>>` per internal docs; the parameter should accept and reflect that contract as `ReadonlyArray<Symbol>`. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `computeLegacyPayout` is exported with no JSDoc. The key non-obvious behavior — that the wild multiplier bonus is intentionally absent — is undocumented. [L4] |
| 13 | Security | FAIL | HIGH | Slot-machine domain inferred from reel/payline/jackpot/Symbol vocabulary and paytable imports. `bet / 10` produces non-exact IEEE 754 values for bets not divisible by 2-based fractions (e.g., bet=1 → lineBet=0.1; 3×0.1=0.30000000000000004). In regulated gaming, payout arithmetic must be exact. Floating-point division on credit amounts is not certifiable for a regulated slot engine. [L22-L23] |

### Suggestions

- Accept readonly array to match engine output type and signal non-mutation intent.
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: ReadonlyArray<Symbol>, bet: number): number {`
- Use integer-safe arithmetic to avoid floating-point payout errors in the regulated gambling domain.
  ```typescript
  // Before
  const multiplier = getPayMultiplier(first, matchCount);
  const lineBet = bet / 10;
  return multiplier * lineBet;
  // After
  const multiplier = getPayMultiplier(first, matchCount);
  // Compute in integer units (×10) to avoid IEEE 754 drift
  return Math.round(multiplier * bet) / 10;
  ```
- Add JSDoc documenting legacy behavior (wild multiplier absent) and parameter contract.
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
  // After
  /**
   * Legacy payline payout — no wild multiplier bonus applied.
   * @param lineSymbols Symbols for one evaluated payline, left-to-right.
   * @param bet Total bet in credits (integer 1–100); line bet is bet/10.
   * @returns Payout in credits, or 0 for fewer than 3 consecutive matches.
   */
  export function computeLegacyPayout(lineSymbols: ReadonlyArray<Symbol>, bet: number): number {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Track wildCount during the match loop and apply `(1 + wildCount) × 2^wildCount` to the base payout before returning. [L21]

### Refactors

- **[utility · medium · trivial]** Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `computeLegacyPayout` (`computeLegacyPayout`) [L4-L24]
