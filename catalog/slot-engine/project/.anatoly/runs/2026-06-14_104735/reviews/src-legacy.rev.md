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
- **Correction [OK]**: Moot — symbol is DEAD (was NEEDS_FIX: Payout uses floating-point division `bet / 10` for the line bet. Most valid bet values (integers 1–100 not divisible by 10) produce non-exact IEEE 754 fractions (e.g. bet=3 → lineBet≈0.29999…, so 1000 × 0.29999… ≈ 299.9999… instead of 300). In a regulated slot-machine context (inferred from reel/WILD/SCATTER/jackpot vocabulary and the documented 95% RTP target), payout arithmetic must be exact; floating-point drift violates the house-edge contract and can round in either direction unpredictably.)
- **Overengineering [LEAN]**: Straightforward sequential logic: resolve leading WILD, count matching run, gate on minimum length, then multiply by lineBet. No unnecessary abstractions or patterns.
- **Tests [NONE]**: No test file found. Complex logic with WILD substitution, match counting, early-exit conditions, and minimum-match threshold has zero test coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment. Non-obvious behavior includes: WILD substitution logic for the leading symbol, SCATTER early-return, minimum 3-match threshold, and lineBet derivation (bet / 10). All require documentation for public API consumers.

## Best Practices — 7.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `lineSymbols: Symbol[]` is never mutated inside the function but is not typed as `ReadonlyArray<Symbol>`. The caller gets no compile-time guarantee the array won't be modified. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `computeLegacyPayout` is a public export with no JSDoc. Callers have no documented contract for edge cases (empty array, bet < 10). [L4] |
| 13 | Security | FAIL | HIGH | Regulated slot-machine domain inferred from reel/paytable/WILD/SCATTER/jackpot/freespin vocabulary across the project. `bet / 10` performs IEEE 754 floating-point division on an integer bet (1..100 coins). When `bet % 10 !== 0`, the result is not exactly representable: `1000 * (3 / 10) === 299.99999999999994` in JavaScript. Regulated gaming requires exact payout arithmetic; floating-point accumulation violates RTP certification invariants. [L22-L23] |
| 17 | Context-adapted rules | WARN | MEDIUM | Two magic numbers without named constants: `10` (implicit line count used to derive per-line bet) and `3` (minimum match count for a win). Both encode domain rules that should be named exports in `paytable.ts` or a `constants.ts`. [L20-L22] |

### Suggestions

- Use ReadonlyArray for the lineSymbols parameter to signal immutability to callers.
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: ReadonlyArray<Symbol>, bet: number): number {`
- Replace floating-point payout with integer arithmetic to satisfy regulated gaming precision requirements.
  ```typescript
  // Before
  const multiplier = getPayMultiplier(first, matchCount);
  const lineBet = bet / 10;
  return multiplier * lineBet;
  // After
  const multiplier = getPayMultiplier(first, matchCount);
  // Keep in integer coin-units; caller converts to display units
  return Math.trunc(multiplier * bet / LINE_COUNT);
  ```
- Replace magic numbers with named constants.
  ```typescript
  // Before
  if (matchCount < 3) return 0;
  const lineBet = bet / 10;
  // After
  import { MIN_MATCH, LINE_COUNT } from "./paytable.js";
  // ...
  if (matchCount < MIN_MATCH) return 0;
  const lineBet = bet / LINE_COUNT;
  ```
- Add JSDoc to document the contract, including the per-line-bet assumption and edge cases.
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
  // After
  /**
   * Computes the legacy line payout for a single payline.
   * @param lineSymbols - Ordered symbols on the evaluated payline (left to right).
   * @param bet - Total bet in coins (1..100, integer). Divided by LINE_COUNT for per-line bet.
   * @returns Payout in coins (0 if no qualifying run).
   */
  export function computeLegacyPayout(lineSymbols: ReadonlyArray<Symbol>, bet: number): number {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Replace `const lineBet = bet / 10; return multiplier * lineBet;` with `return Math.floor(multiplier * bet / 10);`. Both `multiplier` (paytable integer) and `bet` (1–100 integer per README contract) are exactly representable doubles, so their product is exact before the division, and `Math.floor` enforces the industry-standard round-down convention (house retains the remainder). [L22]
- **[utility · high · trivial]** Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]
