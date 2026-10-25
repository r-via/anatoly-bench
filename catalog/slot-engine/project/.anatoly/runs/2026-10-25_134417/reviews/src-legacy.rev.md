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
- **Correction [OK]**: Logic is correct: leading WILDs are substituted by the first non-WILD symbol, the consecutive match loop correctly counts WILDs as substitutes from position 0, the minimum-3 guard is applied before paytable lookup, and lineBet = bet/10 correctly reflects ten paylines per README.
- **Overengineering [LEAN]**: Straightforward linear logic: resolve lead symbol, count consecutive matches, apply multiplier. No unnecessary abstractions, generics, or patterns. The hardcoded divisor 10 matches the 10-payline convention from the README.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `lineSymbols` is only read — never mutated — but is declared as `Symbol[]` instead of `readonly Symbol[]`. The missing `readonly` allows callers to pass mutable arrays without signaling the contract. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `computeLegacyPayout` is exported with no JSDoc. Key contract details are undocumented: `bet` units (total coin bet), the hardcoded 10-payline divisor, and that `lineSymbols` is assumed to be a left-to-right payline slice (not a full reel). [L4] |
| 15 | Testability | WARN | MEDIUM | `getPayMultiplier` is imported directly with no injection point. Unit-testing `computeLegacyPayout` in isolation requires the real paytable module. A function-parameter default (`getPayMultiplier = defaultGetPayMultiplier`) would decouple the two. [L2] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine domain inferred from symbol vocabulary (WILD, SCATTER), project name (slot-engine), and README. The magic literal `10` on L22 hardcodes the payline-count assumption with no named constant (`BET_PER_LINE_DIVISOR` or equivalent), making the function silently wrong if payline count ever changes. Additionally, `bet / 10` with a non-multiple integer bet (e.g. 7 coins) produces a floating-point `lineBet`, which accumulates across paylines — in regulated gaming, integer-safe coin arithmetic is preferred. [L22] |

### Suggestions

- Mark lineSymbols as readonly to reflect non-mutation contract
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {`
- Add JSDoc documenting units, invariants, and the 10-payline divisor
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
  // After
  /**
   * Evaluates a single payline and returns the coin payout.
   * @param lineSymbols - ordered symbols on the payline (left-to-right)
   * @param bet - total bet in coins (1..100 integer); divided by 10 (payline count) for per-line bet
   * @returns coin payout for this payline; 0 for no win
   */
  export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {
  ```
- Extract magic 10 into a named constant to capture the payline-count assumption
  ```typescript
  // Before
    const lineBet = bet / 10;
  // After
    const PAYLINE_COUNT = 10; // must match the number of evaluated paylines in engine.ts
    const lineBet = Math.floor(bet / PAYLINE_COUNT); // integer-safe coin arithmetic
  ```
- Make getPayMultiplier injectable for unit-test isolation
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
  // After
  export function computeLegacyPayout(
    lineSymbols: readonly Symbol[],
    bet: number,
    payMultiplierFn: typeof getPayMultiplier = getPayMultiplier,
  ): number {
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]
