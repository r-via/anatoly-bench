# Review: `src/legacy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| computeLegacyPayout | function | yes | OK | LEAN | DEAD | UNIQUE | - | 75% |

### Details

#### `computeLegacyPayout` (L4–L24)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Moot — symbol is DEAD (was NEEDS_FIX: Floating-point division `bet / 10` on integer coin values in a regulated slot-machine domain violates the industry requirement for exact monetary arithmetic.)
- **Overengineering [LEAN]**: Straightforward slot payout logic: resolve leading symbol, count consecutive matches with WILD substitution, apply multiplier. No unnecessary abstractions or premature generalization.
- **Tests [NONE]**: No test file found. Function has multiple branches: WILD-only line, SCATTER early return, matchCount < 3 guard, and multiplier calculation — all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment. Non-obvious behavior includes: WILD-as-first-symbol substitution logic, SCATTER returning 0, minimum match threshold of 3, and lineBet calculation as bet/10. All of these warrant documentation.

## Best Practices — 4.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | lineSymbols is read-only within the function but typed as mutable Symbol[]. Should be readonly Symbol[]. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | computeLegacyPayout is a public export with no JSDoc. Parameters, return value, and the legacy-vs-current distinction are undocumented. [L4] |
| 13 | Security | FAIL | HIGH | Slot-machine domain inferred from paytable/reels/rng/jackpot/freespin/wild vocabulary across the project. bet / 10 performs floating-point division on a monetary value; for bet=1 this yields 0.1 (non-representable in IEEE 754), and multiplier * lineBet can produce imprecise payouts (e.g. 2 * 0.1 = 0.20000000000000001). In regulated gaming, payout calculations must be exact integer arithmetic to satisfy certification requirements. All arithmetic should stay in integer coin units and divide only at final display. [L22-L23] |
| 17 | Context-adapted rules | WARN | MEDIUM | Magic numbers 10 (lines-per-bet divisor) and 3 (minimum match threshold) are hardcoded. In a gaming engine these are paytable/config parameters that belong in a named constant or config object, especially given the paytable is already centralised in paytable.ts. [L20-L22] |

### Suggestions

- Use readonly for the lineSymbols parameter to signal immutability and allow callers to pass ReadonlyArray values without a cast.
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {`
- Use the canonical Bet type alias and keep arithmetic in integer coins to avoid IEEE 754 imprecision in payout results.
  ```typescript
  // Before
  const lineBet = bet / 10;
  return multiplier * lineBet;
  // After
  // Work in integer coins; divide only at the callsite for display
  const payoutCoins = multiplier * bet;
  return payoutCoins / LINES_COUNT; // LINES_COUNT = 10, exported from config
  ```
- Replace magic numbers with named constants.
  ```typescript
  // Before
  if (matchCount < 3) return 0;
  ...
  const lineBet = bet / 10;
  // After
  const MIN_MATCH = 3;
  const LINE_COUNT = 10;
  if (matchCount < MIN_MATCH) return 0;
  ...
  const lineBet = bet / LINE_COUNT;
  ```
- Add JSDoc to document intent, parameters, and the legacy-vs-current distinction.
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
  // After
  /**
   * Computes the payout for a single pay-line using the pre-v2 rule set.
   * WILDs substitute for the first non-WILD symbol; SCATTERs and all-WILD lines return 0.
   * @param lineSymbols - Ordered symbols on the evaluated pay-line (left to right).
   * @param bet - Total bet in coins (1–100 integer, per {@link Bet}).
   * @returns Payout in coins, or 0 if no qualifying run is found.
   */
  export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: Bet): number {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Replace `multiplier * (bet / 10)` with integer-safe arithmetic: `Math.floor(multiplier * bet / 10)` (or require bet is a multiple of 10 and assert it). Floating-point division of integer coin values is not acceptable in regulated gambling payout paths. [L22]

### Refactors

- **[utility · medium · trivial]** Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]
