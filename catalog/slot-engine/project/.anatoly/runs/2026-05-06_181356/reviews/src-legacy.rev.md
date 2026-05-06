# Review: `src/legacy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| computeLegacyPayout | function | yes | OK | LEAN | DEAD | UNIQUE | - | 75% |

### Details

#### `computeLegacyPayout` (L4–L24)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: RAG score 0.724 indicates moderate structural similarity to evaluateLine, but actual implementation differs fundamentally: different parameter shapes (1D Symbol[] + bet vs 2D reels + payline indices + callback), different return types (number vs LineWin | null), different WILD handling logic (consecutive match counting vs exponential multiplier), and different semantic contracts. Functions are not interchangeable.
- **Correction [NEEDS_FIX]**: Payout returned without Math.floor; fractional bets produce non-integer payouts in a slot-machine domain that requires rounding down.
- **Overengineering [LEAN]**: Straightforward payout computation: resolve leading WILD, count consecutive matches, apply multiplier to line bet. Each step is necessary for the documented paytable logic. No unnecessary abstractions.
- **Tests [NONE]**: No test file found. Function has multiple branches (WILD substitution, SCATTER early return, match counting, minimum match threshold) with no test coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Exported public function with non-obvious behavior: WILD substitution logic, minimum match threshold of 3, line bet derivation (bet/10), and silent returns of 0 for SCATTER/WILD-only lines — none of this is documented.

## Best Practices — 7/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | lineSymbols parameter is mutable Symbol[] but the function only reads from it. Should be readonly Symbol[]. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | computeLegacyPayout is exported with no JSDoc. Parameters, return value, and edge cases (SCATTER short-circuit, empty array, WILD-only line) are undocumented. [L4] |
| 13 | Security | FAIL | HIGH | Gambling/casino domain confirmed by .anatoly/docs/02-Architecture/02-Core-Concepts.md (WILD, SCATTER, paytable, lineSymbols vocabulary). bet / 10 produces a floating-point lineBet; multiplier * lineBet accumulates IEEE 754 rounding errors. Regulated gambling requires exact (integer or Decimal) arithmetic for all payout computations. A bet of 15 credits yields lineBet = 1.5 and a 5× multiplier produces 7.499999999... rather than 7.5. This is a financial correctness and compliance risk. [L21-L22] |
| 15 | Testability | WARN | MEDIUM | getPayMultiplier is a static module import with no injection seam. Unit-testing computeLegacyPayout in isolation requires module-level mocking rather than simple argument substitution. [L2] |
| 17 | Context-adapted rules | WARN | MEDIUM | Regulated slot-machine domain (confirmed by .anatoly/docs/02-Architecture/02-Core-Concepts.md). Legacy payout paths active in a regulated codebase should carry explicit compliance-status annotations indicating which regulatory version or rule set this implements, to prevent accidental promotion to live paylines. The function is currently indistinguishable from canonical paths without the name alone. [L4] |

### Suggestions

- Mark lineSymbols readonly to signal immutability and prevent accidental mutation
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {`
- Replace floating-point payout arithmetic with integer math to satisfy regulated gambling precision requirements
  ```typescript
  // Before
  const lineBet = bet / 10;
  return multiplier * lineBet;
  // After
  // Operate in integer credit-units; caller divides by 10 only at display layer
  return Math.round((multiplier * bet) / 10);
  ```
- Add JSDoc covering parameters, return value, WILD substitution logic, and SCATTER short-circuit
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
  // After
  /**
   * Computes the legacy line payout for a resolved payline symbol sequence.
   *
   * @param lineSymbols - Left-to-right ordered symbols on the evaluated payline.
   * @param bet - Total bet in whole credits; must be a multiple of 10.
   * @returns Payout in credits. Returns 0 for fewer than 3 matches, SCATTER-led lines,
   *          or a WILD-only line. Does NOT apply the wild escalation formula
   *          (see evaluateLine in src/engine.ts for current logic).
   * @deprecated Use evaluateLine from src/engine.ts for compliant payout computation.
   */
  export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Wrap the final return expression in Math.floor: `return Math.floor(multiplier * lineBet)`. Slot-machine payout rounding must be downward (house keeps fractional remainder); omitting the floor yields fractional credits when bet is not divisible by 10. [L23]

### Refactors

- **[utility · medium · trivial]** Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `computeLegacyPayout` (`computeLegacyPayout`) [L4-L24]
