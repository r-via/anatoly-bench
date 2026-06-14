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
- **Correction [OK]**: Moot — symbol is DEAD (was NEEDS_FIX: Slot-machine domain: `bet / 10` produces non-exact IEEE 754 values for bets not divisible by 10; payout is returned unrounded, violating the rule that slot payouts must round down (house keeps the remainder).)
- **Overengineering [LEAN]**: Straightforward payout calculation: WILD-anchor resolution, left-run count, threshold guard, then multiplier lookup. Each step is necessary and nothing is abstracted unnecessarily.
- **Tests [NONE]**: No test file found. Zero coverage for WILD substitution logic, SCATTER early return, matchCount threshold, or multiplier calculation.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment. Non-obvious behavior includes: WILD resolution to the first non-WILD symbol, SCATTER/WILD returning 0, minimum 3-match requirement, and lineBet derivation as bet/10 — none of which are documented.

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | lineSymbols is never mutated; parameter should be ReadonlyArray<Symbol> to communicate intent and prevent accidental mutation. [L4] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | computeLegacyPayout has no JSDoc. The WILD-substitution logic, SCATTER short-circuit, and 3-match minimum are non-obvious behaviours that callers need documented. [L4] |
| 10 | Modern 2026 practices | WARN | MEDIUM | Index-based for loop (L11-L16) accesses lineSymbols[i] without needing the index; for...of with break is idiomatic TS and avoids the off-by-one risk of manual indexing. [L11-L16] |
| 13 | Security | WARN | HIGH | Slot-machine domain inferred from WILD/SCATTER/paytable/lineBet vocabulary. `bet / 10` (L23) uses IEEE 754 float division on coin values — e.g. bet=1 → lineBet=0.1 which is not exactly representable. Regulated gambling certification requires exact payout arithmetic. Prefer integer coin arithmetic: compute `multiplier * bet` in integer space and divide only at the display/serialisation boundary. [L23-L24] |
| 15 | Testability | WARN | MEDIUM | getPayMultiplier is statically imported; testing computeLegacyPayout with alternate paytable data requires module mocking rather than simple argument passing. [L2] |
| 17 | Context-adapted rules | WARN | MEDIUM | README arbitrated intent specifies Bet as integer 1..100. computeLegacyPayout accepts unrestricted number — callers can pass 0, negative, or fractional values producing nonsense payouts. Use a branded Bet type or an early guard to enforce the documented invariant. [L4] |

### Suggestions

- Use ReadonlyArray to express non-mutation intent on the lineSymbols parameter
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: ReadonlyArray<Symbol>, bet: number): number {`
- Replace index-based loop with for...of to improve readability and eliminate manual index access
  ```typescript
  // Before
  for (let i = 0; i < lineSymbols.length; i++) {
      if (lineSymbols[i] === first || lineSymbols[i] === "WILD") {
        matchCount++;
      } else {
        break;
      }
    }
  // After
  for (const sym of lineSymbols) {
      if (sym === first || sym === "WILD") {
        matchCount++;
      } else {
        break;
      }
    }
  ```
- Compute payout in integer coin space to avoid IEEE 754 rounding on gambling payouts
  ```typescript
  // Before
  const lineBet = bet / 10;
    return multiplier * lineBet;
  // After
  // Multiply first, divide last — keeps arithmetic in safe integer range for bet 1..100
    return (multiplier * bet) / 10;
  ```
- Add JSDoc covering WILD substitution, SCATTER behaviour, match minimum, and bet invariant
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
  // After
  /**
   * Computes the legacy line payout for a single evaluated pay line.
   *
   * - WILD at position 0 is substituted by the first non-WILD symbol.
   * - Lines starting with SCATTER (after WILD resolution) always return 0.
   * - Requires ≥3 consecutive matching symbols (WILD counts as any); shorter runs return 0.
   *
   * @param lineSymbols - Ordered symbols on the pay line (left-to-right).
   * @param bet - Total bet in coins (1..100, integer per README invariant).
   * @returns Payout in coins, or 0 for no win.
   */
  export function computeLegacyPayout(lineSymbols: ReadonlyArray<Symbol>, bet: number): number {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Replace `multiplier * lineBet` with `Math.floor(multiplier * bet / 10)` to eliminate IEEE 754 imprecision and enforce slot-domain round-down rule on fractional payouts. [L23]
- **[utility · high · trivial]** Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]
