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
- **Correction [NEEDS_FIX]**: All-WILD line incorrectly returns 0; a full line of WILDs falls through the early-exit guard instead of being awarded the highest-symbol payout.
- **Overengineering [LEAN]**: Single-responsibility function that handles exactly the required slot-machine logic: WILD anchor resolution, consecutive match counting, 3-of-a-kind minimum guard, and a multiplier lookup via `getPayMultiplier`. No unnecessary abstractions, generics, or indirection. The small amount of branching is inherent to the domain rules documented in `.anatoly/docs/02-Architecture/02-Core-Concepts.md` (WILD substitution, SCATTER exclusion, match-count thresholds).
- **Tests [-]**: *(not evaluated)*

## Best Practices — 4/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | The `lineSymbols` parameter is only read, never mutated, but is typed as `Symbol[]` instead of `readonly Symbol[]`. Marking it readonly makes the non-mutation contract explicit and prevents accidental modification. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `computeLegacyPayout` is the sole exported symbol and has no JSDoc comment. A doc block explaining the WILD substitution logic, the `bet / 10` payline assumption, and the minimum 3-match threshold would significantly aid maintainers. [L4] |
| 13 | Security | FAIL | HIGH | Gambling/casino domain inferred from paytable vocabulary (WILD, SCATTER, CHERRY, SEVEN, DIAMOND, jackpot, reels, freespin) across this file and Internal Reference Documentation in `.anatoly/docs/02-Architecture/02-Core-Concepts.md` and `.anatoly/docs/04-API-Reference/02-Configuration-Schema.md`. Industry rule: in regulated gambling software, all monetary payout arithmetic must use integer or fixed-point arithmetic — floating-point division and multiplication are not certifiable for audited RTP calculations. `bet / 10` produces an IEEE 754 double (e.g., bet=1 → lineBet=0.1, which is not exactly representable), and the subsequent `multiplier * lineBet` compounds the error. `Math.ceil` in `engine.ts` partially mitigates this downstream, but the intermediate floating-point value returned by this function is already imprecise. Replace with integer-safe arithmetic (e.g., scale bet to integer cents and divide last). [L22-L23] |
| 15 | Testability | WARN | MEDIUM | `getPayMultiplier` is imported as a hard dependency. There is no injection point to substitute a test double or alternative paytable. Introducing an optional callback parameter (e.g., `multiplierFn = getPayMultiplier`) would allow unit tests to assert payout logic independently of the real paytable lookup. [L2] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine domain (per Internal Reference Documentation). The literal `10` on line 22 (`bet / 10`) encodes the number of paylines as a magic number. If the payline count changes (e.g., 20-line machines), this silent constant will produce wrong RTP without any compile-time or runtime signal. It should be a named constant (e.g., `const PAYLINE_COUNT = 10`) or derived from a config object. [L22] |

### Suggestions

- Mark the input array as readonly to express the non-mutation contract at the type level.
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {`
- Add JSDoc to the sole public export describing WILD substitution, payline divisor assumption, and 3-match minimum.
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
  // After
  /**
   * Computes the payout for a single payline using legacy matching rules.
   *
   * WILDs substitute for any non-SCATTER symbol when leading. SCATTER never pays.
   * Requires at least 3 consecutive matching symbols from the left.
   * The line bet is derived by dividing `bet` across {@link PAYLINE_COUNT} lines.
   *
   * @param lineSymbols - Ordered symbols on the evaluated payline (left to right).
   * @param bet - Total bet staked across all paylines.
   * @returns Payout amount for this line, or 0 if no qualifying match.
   */
  export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {
  ```
- Replace the magic number 10 with a named constant to make payline count explicit and refactor-safe.
  ```typescript
  // Before
  const lineBet = bet / 10;
  // After
  const PAYLINE_COUNT = 10 as const;
  const lineBet = bet / PAYLINE_COUNT;
  ```
- Use integer arithmetic to avoid IEEE 754 precision loss on monetary payout values (regulated gambling compliance).
  ```typescript
  // Before
  const lineBet = bet / 10;
  return multiplier * lineBet;
  // After
  // Work in integer cents: bet is assumed to be in cents
  const lineBetCents = Math.trunc(bet / 10);
  return multiplier * lineBetCents; // return in cents; caller converts to display units
  ```
- Accept the multiplier lookup as an optional parameter to decouple the function from the live paytable and improve testability.
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
  // After
  export function computeLegacyPayout(
    lineSymbols: readonly Symbol[],
    bet: number,
    multiplierFn: (symbol: Symbol, count: number) => number = getPayMultiplier,
  ): number {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** When `lineSymbols.find(s => s !== "WILD")` returns undefined (all-WILD line), substitute the highest-paying symbol (e.g. "DIAMOND") instead of falling back to "WILD" and returning 0. An all-WILD combination should award the maximum payout per industry convention for certified slot-machine logic. [L5]
- **[utility · high · trivial]** Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `computeLegacyPayout` (`computeLegacyPayout`) [L4-L24]
