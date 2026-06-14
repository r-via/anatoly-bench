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
- **Correction [OK]**: Logic is correct: WILD substitution for first-symbol resolution, consecutive-match counting, SCATTER/all-WILD early-exit, and multiplier×lineBet formula all match the documented contract.
- **Overengineering [LEAN]**: Straightforward payout computation: resolve leading WILD, count consecutive matches, apply multiplier. Each step is necessary and minimal.
- **Tests [NONE]**: No test file found. Function has multiple branches: WILD-only lines, SCATTER early return, match count < 3 threshold, and multiplier calculation — all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment. Non-obvious behavior includes WILD substitution logic (finding first non-WILD symbol), SCATTER early-exit, minimum match threshold of 3, and the lineBet derivation (bet / 10) — none of these are documented.

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `lineSymbols` is never mutated but typed as `Symbol[]`. Should be `readonly Symbol[]` (or `ReadonlyArray<Symbol>`) to communicate intent and allow callers to pass read-only arrays without cast. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `computeLegacyPayout` is a public export with no JSDoc. Parameters (`lineSymbols`, `bet`) and return semantics (coins) are undocumented. [L4] |
| 13 | Security | WARN | HIGH | Slot-machine / regulated-gaming domain inferred from reel/paytable/WILD/SCATTER/jackpot vocabulary. `bet / 10` performs floating-point division on coin values. For bet=1, `lineBet=0.1` (inexact binary float); at high multipliers (`DIAMOND 5× = 1000`) this produces `0.1 * 1000 = 100.00000000000001` rather than `100`. Regulated RNG/payout audits require exact, reproducible arithmetic. Coin-integer maths (`Math.round(multiplier * bet / 10)`) or a fixed-decimal approach is required for certification. [L22] |
| 17 | Context-adapted rules | WARN | MEDIUM | Two slot-engine concerns: (1) `lineSymbols[0]` is accessed without a length guard — an empty array produces `undefined` at runtime, bypassing the `Symbol` type (requires `noUncheckedIndexedAccess` to catch statically). (2) The divisor `10` (number of paylines) is hardcoded; any payline-count change silently breaks all payout calculations. [L5-L8] |

### Suggestions

- Mark the parameter readonly to match its actual usage and allow ReadonlyArray callers
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: ReadonlyArray<Symbol>, bet: number): number {`
- Guard against empty input to prevent silent undefined coercion
  ```typescript
  // Before
  const first = lineSymbols[0] === "WILD"
  // After
  if (lineSymbols.length === 0) return 0;
  const first = lineSymbols[0] === "WILD"
  ```
- Use integer arithmetic to avoid floating-point imprecision in certified gaming payouts
  ```typescript
  // Before
  const lineBet = bet / 10;
  return multiplier * lineBet;
  // After
  // Return integer coins: Math.round avoids float drift; replace with integer-only formula if bet is always divisible by LINE_COUNT
  const LINE_COUNT = 10;
  return Math.round(multiplier * bet / LINE_COUNT);
  ```
- Add JSDoc to the public export
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
  // After
  /**
   * Computes the coin payout for a single payline using legacy matching rules.
   * @param lineSymbols - Symbols on the evaluated payline (left-to-right).
   * @param bet - Total bet in coins (1–100 integer).
   * @returns Coin payout for this line (0 if no qualifying run).
   */
  export function computeLegacyPayout(lineSymbols: ReadonlyArray<Symbol>, bet: number): number {
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]
