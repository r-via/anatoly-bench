# Review: `src/legacy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| computeLegacyPayout | function | yes | OK | LEAN | DEAD | UNIQUE | - | 78% |

### Details

#### `computeLegacyPayout` (L4–L24)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [NEEDS_FIX]**: Returns fractional coin payouts when bet is not divisible by 10; slot-machine domain requires integer payouts rounded down.
- **Overengineering [LEAN]**: Straightforward payline evaluation: resolve lead symbol, count consecutive matches, look up multiplier, apply lineBet. No unnecessary abstractions or patterns.
- **Tests [NONE]**: No test file found. Critical logic untested: WILD substitution, SCATTER early return, consecutive match counting, matchCount<3 guard, and multiplier×lineBet calculation.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment. Missing description of WILD resolution logic, the 3-match minimum threshold, the lineBet calculation (bet/10), and what the return value represents.

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `lineSymbols` parameter typed as `Symbol[]` instead of `readonly Symbol[]`; the function never mutates it. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `computeLegacyPayout` is an exported function with no JSDoc comment describing parameters, return value, or edge cases (e.g. empty array, non-integer bet). [L4] |
| 13 | Security | WARN | HIGH | Slot-machine domain inferred from WILD/SCATTER/lineSymbols/bet/payline vocabulary and paytable imports. `bet / 10` produces non-representable IEEE-754 floats for bets not divisible by 10 (e.g. bet=3 → 0.30000000000000004; then `500 * 0.3 = 150.00000000000003`). Regulated-gaming compliance requires exact payout arithmetic — use integer arithmetic `(bet * multiplier) / 10` combined with `Math.round`/`Math.floor`, or a fixed-precision lib. [L22-L23] |
| 17 | Context-adapted rules | WARN | MEDIUM | Magic literal `10` (payline count) appears at L22 with no named constant. The architecture doc defines exactly 10 paylines — a `PAYLINE_COUNT` constant imported from `engine.ts` or `types.ts` would make the coupling explicit and prevent drift if payline count changes. [L22] |

### Suggestions

- Mark lineSymbols parameter as readonly to express the function's non-mutating contract
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {`
- Add JSDoc to the exported function
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
  // After
  /**
   * Computes the payout for a single payline using legacy WILD-resolution rules.
   * @param lineSymbols - Ordered symbols on the evaluated payline (left to right).
   * @param bet - Total bet in coins (1–100 integer).
   * @returns Payout in coins, or 0 if no qualifying run.
   */
  export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {
  ```
- Use integer-safe arithmetic to avoid floating-point drift in regulated casino payouts
  ```typescript
  // Before
  const lineBet = bet / 10;
  return multiplier * lineBet;
  // After
  // Work in integer tenths; divide once at the end
  return Math.floor((multiplier * bet) / 10);
  ```
- Replace magic literal 10 with a named constant
  - Before: `const lineBet = bet / 10;`
  - After: `const lineBet = bet / PAYLINE_COUNT; // import PAYLINE_COUNT = 10 from shared constants`

## Actions

### Quick Wins

- **[correction · medium · small]** Apply Math.floor to the return value: `return Math.floor(multiplier * lineBet)` — bets of 1–9, 11–19, etc. (all valid per Bet=1..100) produce fractional lineBet values; returning fractional coins is incorrect in a coin-based slot engine and violates the house-keeps-remainder convention. [L23]

### Refactors

- **[utility · medium · trivial]** Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `computeLegacyPayout` (`computeLegacyPayout`) [L4-L24]
