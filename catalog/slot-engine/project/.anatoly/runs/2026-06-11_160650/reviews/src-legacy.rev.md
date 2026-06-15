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
- **Correction [OK]**: Moot — symbol is DEAD (was NEEDS_FIX: Casino-domain floating-point defect: `multiplier * (bet / 10)` produces inexact results for non-multiples-of-10 bets.)
- **Overengineering [LEAN]**: Straightforward sequential logic: resolve leading WILD, count consecutive matches, apply multiplier. No unnecessary abstractions or patterns.
- **Tests [NONE]**: No test file found. Critical edge cases untested: WILD substitution logic, SCATTER early return, matchCount threshold (<3), payout calculation with lineBet division.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment. Non-obvious behavior requires documentation: WILD substitution logic for determining the anchor symbol, early-exit for WILD/SCATTER lines, minimum 3-match threshold, and the lineBet = bet/10 division.

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `lineSymbols` is only read inside the function; should be `readonly Symbol[]` to enforce immutability and accept readonly arrays from callers. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `computeLegacyPayout` is exported with no JSDoc. At minimum, parameter constraints (`bet` must be 1–100 integer, `lineSymbols` non-empty) and return semantics (coins) should be documented. [L4] |
| 13 | Security | FAIL | HIGH | Slot-machine / regulated-gambling domain inferred from paytable, WILD/SCATTER/jackpot vocabulary, and README RTP contract. `bet / 10` uses IEEE 754 floating-point division: for any `bet` not a multiple of 10 (e.g. bet=1 → lineBet=0.1, which is not exactly representable in binary FP), `multiplier * lineBet` produces an imprecise payout. In regulated gaming, payout computations must be exact. The fix is integer-first arithmetic: compute `(multiplier * bet)` then floor-divide or round at a single point, keeping all intermediate values in integer coin units. [L21-L22] |
| 17 | Context-adapted rules | WARN | MEDIUM | Magic number `10` for line count hardcoded in `bet / 10` with no named constant. README specifies `bet` is a 1–100 integer, but no guard enforces this — passing `bet=0` would silently return 0 payouts instead of throwing. For a legacy gaming utility, a `LINES_COUNT` constant and a precondition assert would improve clarity and safety. [L21] |

### Suggestions

- Use integer arithmetic to avoid floating-point payout imprecision in regulated gambling context
  ```typescript
  // Before
  const multiplier = getPayMultiplier(first, matchCount);
  const lineBet = bet / 10;
  return multiplier * lineBet;
  // After
  const multiplier = getPayMultiplier(first, matchCount);
  // Keep integer coins throughout; divide once at the end
  return Math.round(multiplier * bet) / LINES_COUNT;
  ```
- Mark the input array readonly and name the magic divisor
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
  // After
  const LINES_COUNT = 10;
  
  /** Compute legacy line payout. `bet` must be a 1–100 integer (coins). Returns coins won. */
  export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Replace `const lineBet = bet / 10; return multiplier * lineBet;` with `return (multiplier * bet) / 10;` to avoid the imprecise IEEE 754 intermediate when `bet` is not a multiple of 10. For a fully exact solution, track all payouts in integer 1/10-coin units to eliminate floating-point division entirely. [L22]
- **[utility · high · trivial]** Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]
