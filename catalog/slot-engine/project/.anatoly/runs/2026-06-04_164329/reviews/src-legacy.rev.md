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
- **Correction [OK]**: Moot — symbol is DEAD (was NEEDS_FIX: Slot-machine payout returned as raw floating-point; fractional coins must be rounded down per industry convention.)
- **Overengineering [LEAN]**: Straightforward payout logic: resolve leading symbol accounting for WILDs, count matching run, look up multiplier, compute payout. No unnecessary abstractions or patterns.
- **Tests [NONE]**: No test file found. Critical logic (WILD substitution, match counting, minimum match threshold, payout calculation) is entirely untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment. Non-obvious behavior includes: WILD substitution logic for the leading symbol, WILD counting in the match run, minimum 3-match threshold, and the lineBet derivation (bet / 10). All of this is invisible to callers without reading the implementation.

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `lineSymbols: Symbol[]` is never mutated; should be `readonly Symbol[]` (or `ReadonlyArray<Symbol>` consistent with `SpinResult` in the project). [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `computeLegacyPayout` is exported with no JSDoc. At minimum, param semantics (`bet` is total bet, divided by 10 internally) and return unit should be documented. [L4] |
| 15 | Testability | WARN | MEDIUM | `getPayMultiplier` is hardcoded via module import. Unit-testing `computeLegacyPayout` in isolation from the paytable requires either a test double or integration-style testing against real paytable values. Accepting it as a parameter or via an options bag would decouple the two. [L2] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine domain. `bet / 10` on integer bets 1–100 yields IEEE 754 non-representable fractions (e.g. bet=1 → lineBet=0.1, then `2 * 0.1 = 0.20000000000000002`). Regulated gaming payout calculations should use integer arithmetic throughout (multiply first, divide last, or accumulate in coins). [L22] |

### Suggestions

- Make the input array parameter readonly to match project's `ReadonlyArray` convention and signal non-mutation intent.
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: ReadonlyArray<Symbol>, bet: number): number {`
- Avoid floating-point payout errors by multiplying before dividing (integer-first arithmetic).
  ```typescript
  // Before
  const lineBet = bet / 10;
  return multiplier * lineBet;
  // After
  // Keep everything in integer coins; divide once at the end
  return Math.trunc(multiplier * bet) / 10;
  ```
- Add JSDoc to document units and the `bet / 10` per-line bet contract.
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
  // After
  /**
   * Computes the payout for a single payline using the legacy matching algorithm.
   * @param lineSymbols - Ordered symbols on the evaluated payline (left to right).
   * @param bet - Total bet in coins (1–100). Per-line bet is `bet / 10`.
   * @returns Payout in coins, or 0 if no winning combination.
   */
  export function computeLegacyPayout(lineSymbols: ReadonlyArray<Symbol>, bet: number): number {
  ```
- Accept `getPayMultiplier` as an optional parameter to decouple from the paytable module and improve unit testability.
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
  // After
  export function computeLegacyPayout(
    lineSymbols: ReadonlyArray<Symbol>,
    bet: number,
    payMultiplierFn: (symbol: Symbol, count: number) => number = getPayMultiplier,
  ): number {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Apply Math.floor to the return value so payout is an integer number of coins (house keeps fractional remainder), satisfying regulated slot-machine rounding conventions. [L23]
- **[utility · high · trivial]** Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `computeLegacyPayout` (`computeLegacyPayout`) [L4-L24]
