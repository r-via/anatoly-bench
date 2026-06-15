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
- **Correction [OK]**: Logic is correct across all tested symbol arrangements: leading-WILD substitution via find(), consecutive run counting with WILD as wildcard, early exit for all-WILD/SCATTER lines, and matchCount < 3 guard all behave as intended. Floating-point in lineBet = bet / 10 is inherent to the documented formula and produces negligible error for the constrained bet range (1–100) and multiplier set.
- **Overengineering [LEAN]**: Straightforward slot payout logic: resolve leading symbol, count consecutive matches with WILD substitution, apply multiplier. No unnecessary abstractions or premature generalization.
- **Tests [NONE]**: No test file found. Critical logic untested: WILD substitution, SCATTER early return, match counting with mid-line breaks, matchCount < 3 threshold, and payout calculation.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment. Non-obvious behavior includes: WILD substitution logic for the leading symbol, WILD-as-anchor edge case returning 0, SCATTER exclusion, minimum 3-match requirement, and lineBet derivation as bet/10. All of these warrant documentation.

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `lineSymbols: Symbol[]` is never mutated but is not marked readonly. Project uses `ReadonlyArray<ReadonlyArray<Symbol>>` in `SpinResult` (README). The parameter should match that convention. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `computeLegacyPayout` is exported with no JSDoc. The non-obvious `bet/10` line-bet semantics and WILD substitution logic warrant at minimum `@param` and `@returns` documentation. [L4] |
| 13 | Security | WARN | HIGH | Slot-machine domain inferred from WILD/SCATTER/DIAMOND/SEVEN/BAR vocabulary and paytable coupling. `bet / 10` uses IEEE 754 floating-point for payout arithmetic: bets not divisible by 10 (e.g. bet=1 → lineBet=0.1, not exactly representable) multiplied by large multipliers (e.g. 1000×) can produce drift. Regulated gaming payout calculations must be deterministic and auditable; industry standard is to multiply before dividing or use a Decimal library. [L22] |
| 17 | Context-adapted rules | WARN | MEDIUM | Gambling domain: no guard that `bet` satisfies the README-documented 1–100 integer contract (`type Bet = number; // 1..100 coins, integer`). A zero or negative bet silently produces zero or negative payouts. `lineSymbols` length is also unchecked; a malformed empty or oversized line could behave unexpectedly. The `Bet` type alias from the README is unused here. [L4] |

### Suggestions

- Mark `lineSymbols` as readonly to match the project's ReadonlyArray convention and prevent accidental mutation.
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {`
- Use the `Bet` type alias and validate the documented range at the boundary.
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
  // After
  export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: Bet): number {
    if (!Number.isInteger(bet) || bet < 1 || bet > 100) throw new RangeError(`bet must be 1–100 integer, got ${bet}`);
  ```
- Eliminate float drift in regulated payout arithmetic by multiplying before dividing.
  ```typescript
  // Before
  const lineBet = bet / 10;
  return multiplier * lineBet;
  // After
  return (multiplier * bet) / 10; // integer numerator keeps IEEE 754 exact for all paytable multipliers
  ```
- Add JSDoc to document the exported function's non-obvious semantics.
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
  // After
  /**
   * Computes the coin payout for a single payline using the legacy prefix-match algorithm.
   * @param lineSymbols - Left-to-right symbols on the evaluated payline.
   * @param bet - Total bet in coins (1–100 integer). Per-line bet = bet / 10.
   * @returns Coin payout (0 when no qualifying 3+-of-a-kind match).
   */
  export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: Bet): number {
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]
