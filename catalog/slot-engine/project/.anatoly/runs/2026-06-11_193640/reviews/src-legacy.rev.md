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
- **Correction [OK]**: Moot — symbol is DEAD (was NEEDS_FIX: Payout returned without Math.floor; slot-machine industry convention requires rounding DOWN so the house retains fractional remainders.)
- **Overengineering [LEAN]**: Straightforward slot payout calculation: resolve leading symbol, count matching run (with WILD substitution), apply multiplier. Each step is necessary and minimal. No abstraction layers, no configurability overhead.
- **Tests [NONE]**: No test file found. Complex logic with WILD substitution, SCATTER early-exit, match counting, and minimum-3 threshold — all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment. Non-obvious behavior includes: WILD substitution logic for determining the anchor symbol, early return for WILD/SCATTER anchors, left-to-right contiguous match counting with break-on-mismatch, minimum match threshold of 3, and lineBet computed as bet/10. All of this is invisible without documentation.

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `lineSymbols: Symbol[]` is never mutated inside the function but is not declared as `readonly Symbol[]`. Signals read-only intent and prevents accidental mutation at call sites. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `computeLegacyPayout` is the sole public export and has no JSDoc. At minimum, documenting params (`lineSymbols`, `bet`) and the wild-substitution behaviour would help callers. [L4] |
| 13 | Security | WARN | HIGH | Slot-machine domain inferred from WILD/SCATTER/lineSymbols/bet/paytable vocabulary. `lineBet = bet / 10` introduces IEEE-754 floating-point arithmetic on gambling payout values. Per regulated-gaming industry practice, payout arithmetic should use integer coin-units (e.g. multiply then divide last, or work in tenths-of-credits as integers) to avoid accumulated precision drift that can cause certified-RTP deviation. E.g. `bet=1` yields `lineBet=0.1`, which is not exactly representable. No hardcoded secrets, eval, or injection present. [L22-L23] |
| 17 | Context-adapted rules | WARN | MEDIUM | Gambling-domain context: `bet` is documented as an integer in 1..100 (README), but `computeLegacyPayout` applies no guard — a caller passing 0 yields `lineBet=0` (silent, not wrong), but a negative bet or non-integer float produces a negative/fractional payout with no error. Adding a runtime assertion or a branded-integer type (`Bet`) would enforce the contract. [L4] |

### Suggestions

- Mark `lineSymbols` readonly to express non-mutation intent and prevent accidental mutations at call sites.
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {`
- Add JSDoc to document wild-substitution logic and parameter constraints.
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
  // After
  /**
   * Computes a single pay-line payout using legacy (non-wild-multiplier) rules.
   * @param lineSymbols - Left-to-right symbols on the evaluated line.
   * @param bet - Total bet in coins (integer, 1–100). Line bet is bet/10.
   * @returns Coin payout for the line (0 if no qualifying run).
   */
  export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {
  ```
- Use integer arithmetic to avoid IEEE-754 drift in gambling payouts. Compute in tenths-of-coins and divide last.
  ```typescript
  // Before
  const lineBet = bet / 10;
  return multiplier * lineBet;
  // After
  // Work in integer tenths-of-coins to avoid float imprecision
  return Math.round(multiplier * bet) / 10;
  ```
- Enforce the documented Bet range (1–100 integer) with a branded type or runtime guard.
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {
  // After
  /** Branded integer in [1, 100] per README contract. */
  type Bet = number & { readonly __bet: unique symbol };
  
  export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: Bet): number {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Wrap the return expression in Math.floor: `return Math.floor(multiplier * lineBet)`. Slot-machine convention (inferred domain) requires rounding DOWN; `bet / 10` is non-exact in IEEE 754 for non-multiples of 10, producing results like 300.00000000000003 for bet=3 × 1000× multiplier. [L23]

### Refactors

- **[utility · medium · trivial]** Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]
