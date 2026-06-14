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
- **Correction [OK]**: Moot — symbol is DEAD (was NEEDS_FIX: Casino domain: `bet / 10` produces a non-integer `lineBet` for any bet not divisible by 10, yielding floating-point imprecision on monetary payout values (e.g. bet=3 → lineBet=0.3 → 2×0.3 = 0.6000000000000001 in IEEE 754).)
- **Overengineering [LEAN]**: Straightforward sequential logic: resolve leading WILD, count consecutive matches, look up multiplier, compute payout. No unnecessary abstractions.
- **Tests [NONE]**: No test file exists. Logic covers WILD substitution, SCATTER early return, consecutive match counting, minimum match threshold, and payout calculation — all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment. Non-obvious behavior (WILD substitution logic, SCATTER early-exit, minimum match threshold of 3, lineBet = bet/10) is entirely undocumented.

## Best Practices — 7/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `lineSymbols` is never mutated but declared as mutable `Symbol[]`. Should be `readonly Symbol[]` / `ReadonlyArray<Symbol>`. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `computeLegacyPayout` is an exported function with no JSDoc. At minimum, document the `bet` range constraint (1–100 coins) and the `lineBet = bet / 10` convention. [L4] |
| 13 | Security | FAIL | HIGH | Slot-machine/regulated-gambling domain inferred from WILD/SCATTER symbols, paytable vocabulary, and RTP constants. `const lineBet = bet / 10` applies IEEE-754 floating-point division to a monetary coin value. `bet = 3` → `lineBet = 0.2999…`, `2 * 0.3 → 0.5999…`. Regulated gaming RNG and payout engines must produce deterministic, auditable integer payouts (e.g. work in milli-coins, or use a Decimal lib). Floating-point payout drift is a compliance defect in this domain. [L21] |

### Suggestions

- Mark input array as readonly to communicate no mutation and enable stricter callers.
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: ReadonlyArray<Symbol>, bet: number): number {`
- Use integer milli-coin arithmetic to eliminate floating-point drift in gambling payouts.
  ```typescript
  // Before
  const lineBet = bet / 10;
  return multiplier * lineBet;
  // After
  // bet is in coins (1–100); lineBet in milli-coins avoids IEEE-754 drift
  const lineBetMillis = bet * 100; // milli-coins: bet/10 × 1000
  return Math.round(multiplier * lineBetMillis) / 1000;
  ```
- Add JSDoc documenting the bet range constraint and per-line bet convention.
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: ReadonlyArray<Symbol>, bet: number): number {
  // After
  /**
   * Computes the payout for a single payline using legacy reel logic.
   * @param lineSymbols - Left-to-right symbols on the evaluated payline.
   * @param bet - Total bet in coins (1–100, integer). Per-line bet = bet / 10.
   * @returns Payout in coins, or 0 if no qualifying run.
   */
  export function computeLegacyPayout(lineSymbols: ReadonlyArray<Symbol>, bet: number): number {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Replace `multiplier * (bet / 10)` with `Math.floor(multiplier * bet / 10)` to ensure integer-coin payouts and eliminate floating-point imprecision on non-multiples-of-10 bet values. [L22]
- **[utility · high · trivial]** Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]
