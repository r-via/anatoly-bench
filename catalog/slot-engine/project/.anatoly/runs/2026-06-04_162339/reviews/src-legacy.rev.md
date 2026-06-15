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
- **Correction [OK]**: Moot — symbol is DEAD (was NEEDS_FIX: Slot-machine domain: `multiplier * (bet / 10)` produces non-integer floating-point payouts for non-multiples-of-10 bets, and never rounds down as required by industry convention.)
- **Overengineering [LEAN]**: Straightforward slot payout calculation: resolve leading symbol, count consecutive matches with WILD substitution, gate on minimum run, then multiply. Each step maps directly to a business rule with no unnecessary abstraction.
- **Tests [NONE]**: No test file found. Logic covers WILD substitution, SCATTER early return, consecutive match counting, minimum-3 threshold, and payout calculation — all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment. Non-obvious behavior includes: WILD substitution logic (uses next non-WILD as anchor), early return 0 for WILD/SCATTER anchors, minimum match count of 3, and lineBet = bet / 10 divisor — none of which are documented.

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | lineSymbols is never mutated; the parameter type should be ReadonlyArray<Symbol> to communicate and enforce this contract. [L4] |
| 8 | ESLint compliance | WARN | HIGH | import type { Symbol } shadows the built-in global Symbol constructor. @typescript-eslint/no-shadow flags this. Since the import is type-only the runtime impact is nil, but it is a recognised linting violation and can cause confusion when reading the file. [L1] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | computeLegacyPayout is a public export with no JSDoc. The parameters (lineSymbols ordering convention, valid bet range 1–100 from README) and the return unit (coins) are not documented. [L4] |
| 13 | Security | FAIL | HIGH | Slot-machine gambling domain inferred from WILD/SCATTER/paytable/payout vocabulary and project file structure. `bet / 10` uses IEEE 754 floating-point division on a monetary value: bet=1 produces lineBet=0.1, which is not exactly representable in double precision. At DIAMOND 5-of-a-kind (×1000), this yields 100.00000000000001 rather than 100. Regulated gaming requires deterministic, exact payout arithmetic. Use integer arithmetic throughout (e.g. keep values in tenths-of-a-coin and return integers). [L22-L23] |
| 17 | Context-adapted rules | WARN | MEDIUM | No guard against an empty lineSymbols array: lineSymbols[0] returns undefined, and undefined === 'WILD' silently evaluates to false, so the function returns 0 with no indication of bad input. In a regulated slot context, silent swallowing of malformed reel data is risky. Additionally, bet has no validation against the documented 1–100 integer range. [L4-L8] |

### Suggestions

- ReadonlyArray for unmodified parameter
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: ReadonlyArray<Symbol>, bet: number): number {`
- Add JSDoc to the public export
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
  // After
  /**
   * Computes the legacy payout for a single payline.
   * @param lineSymbols - Left-to-right symbols on the line (3–5 elements).
   * @param bet - Total bet in coins (integer 1–100). Per-line stake is bet/10.
   * @returns Payout in coins (0 when no winning run of ≥3 is found).
   */
  export function computeLegacyPayout(lineSymbols: ReadonlyArray<Symbol>, bet: number): number {
  ```
- Use integer arithmetic to avoid IEEE 754 imprecision on monetary payouts
  ```typescript
  // Before
  const multiplier = getPayMultiplier(first, matchCount);
  const lineBet = bet / 10;
  return multiplier * lineBet;
  // After
  const multiplier = getPayMultiplier(first, matchCount);
  // Avoid floating-point: keep in tenths-of-coin, return exact integer coins.
  return Math.round(multiplier * bet) / 10;
  ```
- Guard against empty / short lineSymbols arrays
  ```typescript
  // Before
  const first = lineSymbols[0] === "WILD"
  // After
  if (lineSymbols.length === 0) return 0;
  const first = lineSymbols[0] === "WILD"
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Replace `multiplier * lineBet` with `Math.floor(multiplier * bet / 10)` to eliminate floating-point imprecision on non-multiple-of-10 bets and ensure house-down rounding per slot-machine industry convention. [L23]
- **[utility · high · trivial]** Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `computeLegacyPayout` (`computeLegacyPayout`) [L4-L24]
