# Review: `src/legacy.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| computeLegacyPayout | function | yes | OK | LEAN | DEAD | UNIQUE | - | 80% |

### Details

#### `computeLegacyPayout` (L4–L24)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Wild substitution, run counting, the 3-match minimum and the SCATTER/all-WILD early return are internally consistent. Dividing bet by 10 gives fractional line bets, but no contract requires integer payouts, so nothing is flagged.
- **Overengineering [LEAN]**: Short, linear function: resolves the first non-wild symbol, counts the leading run, and looks up the multiplier. No unnecessary abstractions.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `lineSymbols` is only read but is typed as a mutable `Symbol[]`. Use `readonly Symbol[]`. The README types reels as ReadonlyArray. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | The exported `computeLegacyPayout` has no JSDoc. Its wild/scatter handling and the bet/10 line-bet convention are undocumented. [L4] |
| 13 | Security | FAIL | HIGH | Slot-engine/casino payout domain, inferred from the paytable, wild, scatter and jackpot vocabulary and the README's integer-coin bets. `bet / 10` and `multiplier * lineBet` are floating-point calculations on monetary amounts. For example, bet=1 gives lineBet 0.1, and the product can carry binary rounding error. Regulated payout code should use integer minor units, with explicit rounding or division at the end. No secrets, eval or injection. [L21-L22] |

### Suggestions

- Keep payouts in integer coins. Compute the multiplier first and divide last, with explicit rounding. Mark the input readonly and add JSDoc.
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
    ...
    const lineBet = bet / 10;
    return multiplier * lineBet;
  // After
  /** Legacy payout for one payline; returns integer coins. */
  export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {
    ...
    return Math.floor((multiplier * bet) / 10);
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]
