# Review: `src/legacy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| computeLegacyPayout | function | yes | OK | LEAN | DEAD | UNIQUE | - | 80% |

### Details

#### `computeLegacyPayout` (L4–L24)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: The logic is sound. It resolves the leading WILD, returns 0 for all-WILD and SCATTER lines, counts the consecutive run of matching or WILD symbols, requires 3 or more, and multiplies by bet/10 (one tenth of the bet per payline, matching the 10 paylines in the README). The README gives no contract on payout rounding or integer coins, so the fractional lineBet is not flagged. The function has no callers, which is a Utility-axis matter.
- **Overengineering [LEAN]**: Straightforward single-purpose function: resolves leading symbol (wild-aware), counts consecutive matches, looks up multiplier. No unnecessary abstraction.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `lineSymbols` is read-only in practice but typed as mutable `Symbol[]`. Use `readonly Symbol[]`. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Exported `computeLegacyPayout` has no JSDoc. Wild-substitution, minimum-3-match and bet/10 line-bet semantics are undocumented. [L4] |
| 13 | Security | FAIL | HIGH | Slot-machine domain inferred from the paytable, reels, wild, scatter and jackpot vocabulary and from the README. Floating-point arithmetic on monetary payouts is unsafe: `bet / 10` and `multiplier * lineBet` yield fractional values such as 0.1 and accumulate IEEE-754 error. The README defines the bet as an integer coin count and totalPayout as a coin payout. Compute in integer units, for example `multiplier * bet / 10` with an explicit rounding policy, or use integer minor units. No secrets, eval or injection. [L22-L23] |

### Suggestions

- Avoid fractional coin payouts from float division. Multiply first and round per policy, or keep integer units.
  ```typescript
  // Before
  const lineBet = bet / 10;
    return multiplier * lineBet;
  // After
  return Math.floor((multiplier * bet) / 10);
  ```
- Accept a readonly array and document the exported function.
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
  // After
  /** Computes the legacy payout for one payline; WILD substitutes, 3+ leading matches pay. */
  export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]
