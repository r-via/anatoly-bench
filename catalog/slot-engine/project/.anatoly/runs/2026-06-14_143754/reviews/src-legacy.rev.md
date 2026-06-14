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
- **Correction [OK]**: Moot — symbol is DEAD (was NEEDS_FIX: Slot-machine domain: payout returned as raw float with no floor, violating regulated-gaming rounding convention.)
- **Overengineering [LEAN]**: Straightforward slot payout logic: resolve leading symbol through WILDs, count consecutive matches, apply multiplier. Each step is necessary; no abstractions, no generics, no unnecessary indirection.
- **Tests [NONE]**: No test file found. No coverage for WILD substitution logic, SCATTER early return, matchCount threshold, or multiplier calculation.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment. Non-obvious behavior includes WILD substitution logic (first non-WILD symbol as anchor), early return for WILD/SCATTER anchors, minimum 3-match threshold, and lineBet derivation (bet / 10) — none of which are documented.

## Best Practices — 7.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `lineSymbols: Symbol[]` is never mutated inside the function but is not marked `readonly`. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `computeLegacyPayout` is exported with no JSDoc comment explaining parameters, return value, or the 10-line divisor assumption. [L4] |
| 13 | Security | FAIL | HIGH | Slot-machine domain inferred from WILD/SCATTER/paytable/multiplier vocabulary. `bet / 10` produces an IEEE 754 float for most valid bet values (e.g., bet=1 → lineBet=0.1 cannot be represented exactly). Subsequent `multiplier * lineBet` accumulates rounding error on every evaluated payline. In regulated gaming, payout arithmetic must be exact — integer coin units or a Decimal library are required. Hardcoded divisor `10` also encodes an undocumented assumption about the number of active paylines. [L21-L22] |
| 17 | Context-adapted rules | WARN | MEDIUM | Magic number `10` encodes the payline count directly in the arithmetic with no named constant, making the assumption invisible to callers and breaking if the engine ever supports a different line count. [L21] |

### Suggestions

- Mark the input array `readonly` to communicate immutability and satisfy linters.
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {`
- Replace the floating-point division with integer arithmetic to avoid payout rounding errors in regulated gaming context.
  ```typescript
  // Before
  const lineBet = bet / 10;
  return multiplier * lineBet;
  // After
  const LINE_COUNT = 10;
  // Keep everything in integer coins; divide only at display boundary
  return Math.round(multiplier * bet) / LINE_COUNT;
  ```
- Extract the payline divisor as a named constant and add JSDoc.
  ```typescript
  // Before
  const lineBet = bet / 10;
  // After
  /** Number of active paylines — divides the total bet into a per-line stake. */
  const PAYLINE_COUNT = 10;
  const lineBet = bet / PAYLINE_COUNT;
  ```
- Add JSDoc to the exported function.
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
  // After
  /**
   * Computes the payout for a single evaluated payline using legacy matching rules.
   * @param lineSymbols - Ordered symbols on the evaluated line (left-to-right).
   * @param bet - Total bet in coins (integer, 1–100). Per-line stake = bet / 10.
   * @returns Payout in coins (0 when fewer than 3 consecutive matches).
   */
  export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Wrap the final return value with Math.floor(): `return Math.floor(multiplier * lineBet);`. This ensures integer coin payouts and keeps fractional remainders on the house side, consistent with regulated slot-machine payout conventions. [L23]
- **[utility · high · trivial]** Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]
