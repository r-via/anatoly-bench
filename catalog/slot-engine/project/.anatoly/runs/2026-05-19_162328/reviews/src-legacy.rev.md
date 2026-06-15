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
- **Correction [NEEDS_FIX]**: Slot-machine domain: payout returned as raw float instead of floor-rounded integer credit.
- **Overengineering [LEAN]**: Straightforward sequential logic: resolve wild lead, count matching prefix, gate on min-3, delegate to paytable. No unnecessary abstractions.
- **Tests [NONE]**: No test file found. Critical business logic (WILD substitution, match counting, minimum match threshold, payout calculation) is entirely untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment. Missing description of purpose, parameter semantics (lineSymbols layout, bet units), return value meaning, WILD substitution logic, and the hardcoded divisor (bet/10 implying 10 lines).

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `lineSymbols` is never mutated inside the function but is declared as mutable `Symbol[]`. Should be `ReadonlyArray<Symbol>`. [L4] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | `computeLegacyPayout` is a public export with no JSDoc. Given the 'legacy' naming, a `@deprecated` tag plus a doc comment describing what it computes and its constraints (lineSymbols length ≥ 1, bet 1–100) are both missing. [L4] |
| 13 | Security | FAIL | HIGH | Casino/slot-machine domain inferred from WILD, SCATTER, getPayMultiplier, payline vocabulary. `bet / 10` (L23) uses IEEE 754 floating-point arithmetic on monetary payout values. README.md states bet is a 1–100 integer coin value; for any bet not divisible by 10 (e.g. bet=1 → lineBet=0.1, bet=7 → lineBet=0.7) the subsequent `multiplier * lineBet` produces a non-integer result. In regulated gaming, payout calculations must be exact integer-coin arithmetic to satisfy RTP certification requirements. Floating-point rounding errors can silently skew long-run player return away from the mandated 95% RTP target. [L23-L24] |

### Suggestions

- Declare `lineSymbols` as readonly to express immutability and prevent accidental mutation.
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: ReadonlyArray<Symbol>, bet: number): number {`
- Use integer arithmetic for payout calculation to avoid floating-point drift in a regulated casino context. Work entirely in coins; avoid fractional lineBet values.
  ```typescript
  // Before
  const lineBet = bet / 10;
  return multiplier * lineBet;
  // After
  // Return value is in coins (integer). Caller divides by 10 if line-stake display is needed.
  return Math.round(multiplier * bet) / 10;
  ```
- Add JSDoc with `@deprecated` tag and param/return documentation to the public export.
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
  // After
  /**
   * @deprecated Use `computePayout` with `LineWin[]` instead.
   * Computes a single payline payout for a left-to-right symbol run.
   * @param lineSymbols - Ordered symbols on one payline (length must be ≥ 1).
   * @param bet - Total bet in coins (1–100 integer, spread across 10 lines).
   * @returns Payout in coins for this line, or 0 if no qualifying run.
   */
  export function computeLegacyPayout(lineSymbols: ReadonlyArray<Symbol>, bet: number): number {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Wrap the return expression in Math.floor(): `return Math.floor(multiplier * lineBet);` to ensure integer credit payouts and correct house-edge rounding for all bet values not divisible by 10. [L23]
- **[utility · high · trivial]** Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `computeLegacyPayout` (`computeLegacyPayout`) [L4-L24]
