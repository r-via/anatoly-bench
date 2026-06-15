# Review: `src/legacy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| computeLegacyPayout | function | yes | OK | LEAN | DEAD | UNIQUE | - | 82% |

### Details

#### `computeLegacyPayout` (L4–L24)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [NEEDS_FIX]**: Wild multiplier escalation formula omitted: returns bare `multiplier × lineBet` even when WILDs are present in the winning run.
- **Overengineering [LEAN]**: Straightforward payout calculation: resolve wild-substituted leading symbol, count consecutive matches, apply multiplier to line bet. No unnecessary abstractions or patterns.
- **Tests [NONE]**: No test file found. No coverage for WILD substitution logic, SCATTER early-return, matchCount threshold, or payout calculation.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment. Missing description of purpose, parameter semantics (e.g. expected length of lineSymbols, what 'bet' represents — total bet vs line bet), return value (0 for no-win vs coins awarded), WILD substitution logic, the division by 10 for lineBet derivation, and the minimum 3-match threshold.

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `lineSymbols` is never mutated but is typed as `Symbol[]` rather than `readonly Symbol[]`. Callers have no type-level guarantee the array is not modified. [L4] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | `computeLegacyPayout` is a public export with no JSDoc. At minimum, it should document the expected shape of `lineSymbols` (exactly 5 symbols, position semantics) and the `bet / 10` convention. [L4] |
| 13 | Security | WARN | HIGH | Slot-machine gambling domain inferred from WILD/SCATTER/paytable/payline vocabulary (confirmed by .anatoly/docs/02-Architecture/02-Core-Concepts.md and .anatoly/docs/04-API-Reference/03-Types-and-Interfaces.md). `bet / 10` performs floating-point division on a monetary value. If `bet` is not always an integer multiple of 10, `lineBet` carries IEEE-754 imprecision that accumulates in `multiplier * lineBet`. Regulated gambling engines require deterministic integer coin arithmetic. [L21] |
| 15 | Testability | WARN | MEDIUM | `getPayMultiplier` is called directly from the module-level import, not injected. Mocking the paytable in unit tests requires module patching rather than argument substitution. |
| 17 | Context-adapted rules | WARN | MEDIUM | Per .anatoly/docs/03-Guides/02-Advanced-Configuration.md, winning runs containing WILDs must apply `basePayout × (1 + wildCount) × 2^wildCount`. This function counts WILDs in `matchCount` but never applies the escalation multiplier, silently underreporting payouts on wild-containing lines. Additionally, the literal `10` in `bet / 10` is a magic constant for line count; it should be a named constant or parameter aligned with the documented ten-payline model. [L11-L19] |

### Suggestions

- Mark `lineSymbols` as readonly to prevent accidental mutation and signal immutable intent.
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {`
- Use integer coin arithmetic to avoid floating-point imprecision in gambling monetary calculation.
  ```typescript
  // Before
  const lineBet = bet / 10;
  return multiplier * lineBet;
  // After
  // bet and return value in integer coins; divide only at display layer
  const lineBetCoins = Math.trunc(bet / LINE_COUNT);
  return multiplier * lineBetCoins;
  ```
- Replace magic number 10 with a named constant that matches the documented ten-payline model.
  ```typescript
  // Before
  const lineBet = bet / 10;
  // After
  const LINE_COUNT = 10;
  const lineBet = bet / LINE_COUNT;
  ```
- Add JSDoc documenting the legacy wild-handling difference from the current engine formula.
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
  // After
  /**
   * Legacy payout calculation (pre-wild-escalation era).
   * Unlike `evaluateLine`, does NOT apply the `(1 + wildCount) × 2^wildCount` multiplier.
   * @param lineSymbols Exactly 5 symbols ordered left-to-right for a single payline.
   * @param bet Total bet in coins across all 10 lines.
   * @returns Coins won on this line, or 0 for no match.
   */
  export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Before returning, count the number of WILD symbols in the matched prefix (positions 0..matchCount-1) and apply the escalation: `return multiplier * lineBet * (1 + wildCount) * Math.pow(2, wildCount)`. When wildCount is 0 the factor reduces to 1, preserving existing non-wild behaviour. [L23]
- **[utility · high · trivial]** Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `computeLegacyPayout` (`computeLegacyPayout`) [L4-L24]
