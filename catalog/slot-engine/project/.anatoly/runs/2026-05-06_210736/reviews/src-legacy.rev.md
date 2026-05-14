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
- **Correction [NEEDS_FIX]**: Wild escalation formula omitted: wins containing WILD substitutions return under-calculated payouts.
- **Overengineering [LEAN]**: Straightforward payout computation: resolve leading WILD, count consecutive matches, apply multiplier. No unnecessary abstractions. Note: omits the wild multiplier bonus formula (docs/03-Guides/02-Advanced-Configuration.md) — this is a legacy path, so the simpler formula is intentional.
- **Tests [NONE]**: No test file exists. Function has multiple branches (WILD substitution, SCATTER guard, match counting, minimum match threshold) with no coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment. Missing description of WILD substitution logic, the left-to-right consecutive match requirement, the 3-match minimum, the lineBet derivation (bet/10), and the meaning of the return value (coins awarded).

## Best Practices — 4.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | lineSymbols is never mutated; the parameter type should be readonly Symbol[] to express that invariant. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | computeLegacyPayout is a public export with no JSDoc. At minimum @param and @returns annotations are expected. [L4] |
| 13 | Security | FAIL | HIGH | Slot-machine domain inferred from reel/symbol/payout vocabulary and confirmed by .anatoly/docs/02-Architecture/02-Core-Concepts.md and .anatoly/docs/04-API-Reference/03-Types-and-Interfaces.md. bet / 10 uses floating-point division to compute lineBet. In regulated gambling systems payout arithmetic must be exact integer or decimal; IEEE-754 float division (e.g. 1 / 10 = 0.1000000000000000055511...) is not certifiable and can cause cumulative RTP drift. Use integer coin arithmetic throughout and defer formatting to presentation layer. [L21] |
| 17 | Context-adapted rules | WARN | MEDIUM | Per .anatoly/docs/03-Guides/02-Advanced-Configuration.md and .anatoly/docs/04-API-Reference/03-Types-and-Interfaces.md, wins containing WILDs must apply effectivePayout = basePayout × (1 + wildCount) × 2^wildCount. This function counts WILDs toward matchCount but never escalates for wild presence, producing lower payouts than the documented engine spec. Intentional for 'legacy' semantics but should be explicitly commented. [L13-L22] |

### Suggestions

- Use readonly on the input parameter to reflect its immutability contract
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {`
- Replace floating-point division with integer coin arithmetic to avoid precision drift in regulated payout calculations
  ```typescript
  // Before
  const lineBet = bet / 10;
  return multiplier * lineBet;
  // After
  // bet is in coins; lineBet is scaled by 10 (10 lines). Keep all arithmetic in integer coins.
  const lineBetCoins = Math.trunc(bet / 10);
  return multiplier * lineBetCoins;
  ```
- Add JSDoc to the public export
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
  // After
  /**
   * Legacy payout calculation (pre-wild-escalation engine).
   * @param lineSymbols - Ordered symbols on the evaluated payline (left to right).
   * @param bet - Total bet in coins across all 10 lines.
   * @returns Coins awarded for this line, or 0 for no qualifying match.
   */
  export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Track wildCount during the match loop and multiply the final result by (1 + wildCount) × 2^wildCount before returning, matching the documented escalation formula for WILD-inclusive wins. [L22]
- **[utility · high · trivial]** Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `computeLegacyPayout` (`computeLegacyPayout`) [L4-L24]
