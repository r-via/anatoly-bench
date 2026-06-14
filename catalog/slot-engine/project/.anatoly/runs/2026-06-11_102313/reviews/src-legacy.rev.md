# Review: `src/legacy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| computeLegacyPayout | function | yes | OK | LEAN | DEAD | UNIQUE | - | 72% |

### Details

#### `computeLegacyPayout` (L4–L24)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Moot — symbol is DEAD (was NEEDS_FIX: Missing Math.floor on payout; fractional coin result for bets not divisible by 10.)
- **Overengineering [LEAN]**: Straightforward linear scan: resolve leading WILD, count consecutive matches, look up multiplier, compute payout. No unnecessary abstractions or premature generalization.
- **Tests [NONE]**: No test file found. Function has several testable branches: WILD-only lines, SCATTER early return, match count < 3 cutoff, WILD substitution logic, and multiplier calculation — all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Non-obvious behaviors are undocumented: WILD substitution logic for the anchor symbol, SCATTER early-return, minimum match threshold of 3, and the hardcoded divisor `bet / 10` for per-line bet calculation.

## Best Practices — 7/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | lineSymbols is only read, never mutated; should be readonly Symbol[] or ReadonlyArray<Symbol>. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | computeLegacyPayout is exported with no JSDoc. The WILD substitution logic, minimum match threshold, and lineBet formula are non-obvious to callers. [L4] |
| 10 | Modern 2026 practices | WARN | MEDIUM | Index-based for loop (L11-L16) can be replaced with for...of, which is idiomatic modern TypeScript and eliminates redundant lineSymbols[i] double-indexing. [L11-L16] |
| 13 | Security | FAIL | HIGH | Casino/slot-machine domain inferred from WILD/SCATTER/paytable/lineWins/jackpot/freeSpins/RTP vocabulary throughout the project. bet / 10 (L21) produces a floating-point lineBet; multiplier * lineBet (L22) compounds IEEE 754 imprecision. For Bet in 1..100 (README-documented integer), bet=1 yields lineBet=0.1 (not representable exactly). Regulated gaming RTP certification requires integer or Decimal arithmetic for all payout paths. Industry rule: financial/monetary code in gambling must not use floating-point for coin payouts. [L21-L22] |
| 17 | Context-adapted rules | WARN | MEDIUM | Magic number 10 in bet / 10 (L21) encodes the payline count assumption inline. The project's configuration schema (internal docs) names this design convention explicitly; a named constant (e.g. PAYLINE_COUNT imported from paytable.ts) would make the assumption auditable and match project conventions. [L21] |

### Suggestions

- Mark lineSymbols as readonly to prevent accidental mutation and signal read-only intent to callers.
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {`
- Replace index-based for loop with for...of to eliminate redundant double-indexing and match modern TypeScript style.
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
  for (const s of lineSymbols) {
      if (s === first || s === "WILD") matchCount++;
      else break;
    }
  ```
- Use integer-safe payout arithmetic to avoid IEEE 754 drift in regulated gambling payouts. Multiply before dividing so no fractional intermediate exists when bet is divisible by 10; or adopt a Decimal library for full coverage.
  ```typescript
  // Before
  const lineBet = bet / 10;
  return multiplier * lineBet;
  // After
  // Option A: integer-first (safe when multiplier * bet stays in safe integer range)
  return (multiplier * bet) / PAYLINE_COUNT;
  // Option B: integer truncation if sub-coin fractions are invalid
  return Math.trunc(multiplier * bet / PAYLINE_COUNT);
  ```
- Replace magic number 10 with a named constant exported from paytable.ts to make the payline-count assumption explicit and auditable.
  ```typescript
  // Before
  const lineBet = bet / 10;
  // After
  import { PAYLINE_COUNT } from './paytable.js';
  // ...
  const lineBet = bet / PAYLINE_COUNT;
  ```
- Add JSDoc covering the WILD substitution rule, minimum match threshold, and lineBet formula.
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
  // After
  /**
   * Computes the coin payout for a single payline using legacy matching rules.
   *
   * WILD substitutes for the first non-WILD symbol found on the line.
   * A minimum of 3 consecutive matching symbols (left-to-right) is required.
   * Per-line bet = bet / PAYLINE_COUNT; returned value is coins.
   *
   * @param lineSymbols - Ordered symbols on the evaluated payline (typically 5).
   * @param bet - Total bet in coins (1..100 integer).
   * @returns Coin payout for this line, or 0 for no win.
   */
  export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Wrap the return expression in Math.floor: `return Math.floor(multiplier * lineBet);` — regulated slot payouts must be integer coin units; fractional remainders go to the house. [L23]

### Refactors

- **[utility · medium · trivial]** Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]
