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
- **Correction [OK]**: Wild-leading lines resolve to the first non-wild symbol. Matching is a left-to-right run with wilds substituting. Lines under 3 matches, all-wild lines and scatter-led lines return 0. getPayMultiplier returns 0 for unknown symbols or counts outside 3–5. No concrete defect. Payouts can be fractional, since bet/10 is not rounded. No doc or contract states integer payouts, so this isn't flagged.
- **Overengineering [LEAN]**: Straightforward single-pass wild-aware prefix match with early returns. Delegates multiplier lookup to getPayMultiplier. No unnecessary abstraction.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | The `lineSymbols` parameter is only read, but is typed as mutable `Symbol[]`. `readonly Symbol[]` would state that and accept readonly callers, such as the README's `ReadonlyArray` reels. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `computeLegacyPayout` has no JSDoc. The name and signature do not show that `bet` is the total bet split across 10 lines, that a leading WILD takes the first non-WILD symbol, that SCATTER or fewer than 3 matches pay 0, or that the result is in coins. [L4] |
| 17 | Context-adapted rules | WARN | MEDIUM | The magic number `10` (paylines) is hard-coded in `bet / 10` and should be a named constant. `bet / 10` produces a fractional lineBet, so the payout can be non-integer or carry floating-point error. The README documents the bet as an integer in 1..100 coins. This is a single in-memory computation, not a persisted ledger, so it is a WARN only. [L21-L22] |

### Suggestions

- Name the payline count, mark the input readonly, and document the contract.
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
    ...
    const lineBet = bet / 10;
  // After
  const PAYLINE_COUNT = 10;
  
  /** Legacy payout in coins for one line; `bet` is the total bet split across PAYLINE_COUNT lines. */
  export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {
    ...
    const lineBet = bet / PAYLINE_COUNT;
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]
