# Review: `src/legacy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| computeLegacyPayout | function | yes | OK | LEAN | DEAD | UNIQUE | - | 88% |

### Details

#### `computeLegacyPayout` (L4–L24)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [NEEDS_FIX]**: Two independent floating-point correctness defects in a casino/slot payout context: imprecise lineBet division and missing floor on return.
- **Overengineering [LEAN]**: Straightforward sequential logic: resolve wild-substituted leading symbol, count consecutive matches, look up multiplier, compute payout. No unnecessary abstractions.
- **Tests [NONE]**: No test file found. Logic covers WILD substitution, SCATTER early return, consecutive match counting, minimum match threshold, and payout calculation — all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment. Missing description of WILD substitution logic, the hardcoded divisor (bet/10 implying 10 lines), minimum match threshold of 3, and why SCATTER always returns 0.

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | lineSymbols is typed as mutable Symbol[]; ReadonlyArray<Symbol> better expresses intent and prevents accidental mutation. [L4] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | computeLegacyPayout is exported with no JSDoc. WILD substitution logic, 3-match minimum, and line-bet derivation are non-obvious and should be documented. [L4] |
| 12 | Async/Promises/Error handling | WARN | HIGH | Synchronous; no async concerns. However, if getPayMultiplier returns undefined or NaN for an unrecognised symbol/count pair, the result silently propagates as NaN with no guard. [L21-L23] |
| 13 | Security | FAIL | HIGH | Slot-machine domain inferred from reel/paytable/WILD/SCATTER/lineSymbols vocabulary. `bet / 10` applies IEEE 754 floating-point division to an integer bet (1..100 per README). Values such as 1/10=0.1 and 3/10=0.3 are not exactly representable in binary float, causing cumulative payout drift over millions of spins against the 95% RTP invariant stated in README. Casino payout calculations must use integer coin arithmetic or a Decimal library throughout. [L22] |
| 15 | Testability | WARN | MEDIUM | getPayMultiplier is a static module-level import, not injectable. Accepting it as a parameter would allow isolated unit testing without module mocking infrastructure. [L2] |
| 17 | Context-adapted rules | WARN | MEDIUM | Magic number 10 (payline divisor) should be a named constant. No runtime guard validates bet is within the 1..100 integer range from the README invariant; invalid inputs silently yield wrong payouts. [L22] |

### Suggestions

- Use ReadonlyArray<Symbol> to signal the function does not mutate its input
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: ReadonlyArray<Symbol>, bet: number): number {`
- Replace floating-point line-bet division with integer coin arithmetic to prevent RTP drift in regulated gambling context
  ```typescript
  // Before
  const multiplier = getPayMultiplier(first, matchCount);
  const lineBet = bet / 10;
  return multiplier * lineBet;
  // After
  const LINE_COUNT = 10 as const;
  // Work in integer coins; multiplier is scaled x100 to avoid fractions
  const lineBetCoins = Math.floor(bet / LINE_COUNT); // bet is guaranteed integer 1..100
  return multiplier * lineBetCoins;
  ```
- Name the payline divisor and guard the bet range per the README invariant
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
  // After
  const LINE_COUNT = 10 as const;
  
  /**
   * Computes the payout for a single payline using the legacy consecutive-match algorithm.
   * WILD substitutes for any symbol; SCATTER lines always return 0.
   * Requires bet to be an integer in [1, 100] (coins).
   */
  export function computeLegacyPayout(lineSymbols: ReadonlyArray<Symbol>, bet: number): number {
    if (!Number.isInteger(bet) || bet < 1 || bet > 100) {
      throw new RangeError(`bet must be an integer 1..100, received ${bet}`);
    }
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Replace `bet / 10` with integer-safe arithmetic (e.g. scale all values to integer coin units and divide at the final presentation layer, or assert bet is divisible by 10 before proceeding) to avoid IEEE 754 precision loss. [L21]
- **[correction · medium · small]** Wrap the return expression with Math.floor: `return Math.floor(multiplier * lineBet)` to enforce downward rounding per casino-industry convention and protect the 95% RTP target. [L22]
- **[utility · high · trivial]** Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `computeLegacyPayout` (`computeLegacyPayout`) [L4-L24]
