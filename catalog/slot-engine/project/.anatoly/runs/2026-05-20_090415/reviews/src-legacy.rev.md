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
- **Correction [NEEDS_FIX]**: Payout is returned as a raw float; missing Math.floor produces non-integer coin amounts and can inflate RTP above the documented 95% target.
- **Overengineering [LEAN]**: Straightforward slot payout computation: resolve leading WILD, count matching prefix, apply multiplier. Each step is necessary and minimal.
- **Tests [NONE]**: No test file found. Critical logic paths untested: WILD-prefix resolution, SCATTER early return, matchCount threshold (<3), WILD-as-substitute counting, and payout calculation via getPayMultiplier.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment. Missing description of WILD substitution logic, SCATTER/WILD-leading early-exit behavior, minimum 3-match threshold, lineBet derivation (bet/10), and return semantics.

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `lineSymbols` is never mutated; the parameter should be `readonly Symbol[]` to encode that intent and block accidental writes. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `computeLegacyPayout` is exported with no JSDoc. The semantics of `lineSymbols`, the `bet / 10` division, and the return unit are undocumented. [L4] |
| 10 | Modern 2026 practices | WARN | MEDIUM | Index-based `for` loop at L11–L17 uses `i` only for element access; `for...of` is the idiomatic 2026 replacement. [L11-L17] |
| 13 | Security | WARN | HIGH | Slot-machine domain inferred from WILD/SCATTER/CHERRY/BELL/BAR/SEVEN/DIAMOND vocabulary and paytable structure. `bet / 10` (L22) performs IEEE 754 floating-point division on a monetary integer. For any bet not divisible by 10 (e.g. bet=1 → lineBet=0.1000000000000000055…), subsequent multiplication can accumulate rounding error. In regulated gambling, floating-point payout arithmetic can cause certified RTP drift away from the documented 95% target. [L22] |
| 17 | Context-adapted rules | WARN | MEDIUM | Magic number `10` at L22 encodes the payline count with no named constant. Per the arbitrated spec (`type Bet = number; // 1..100 coins, integer`), the function accepts out-of-range or fractional bets silently — no guard validates the documented invariant. [L22] |

### Suggestions

- Mark the array parameter readonly to prevent accidental mutation
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number`
  - After: `export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number`
- Replace index-based for loop with for...of
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
  for (const sym of lineSymbols) {
      if (sym === first || sym === "WILD") {
        matchCount++;
      } else {
        break;
      }
    }
  ```
- Name the payline constant and validate bet range per the arbitrated spec
  ```typescript
  // Before
  const lineBet = bet / 10;
  // After
  const PAYLINE_COUNT = 10 as const;
  if (!Number.isInteger(bet) || bet < 1 || bet > 100) {
    throw new RangeError(`bet must be an integer 1..100, got ${bet}`);
  }
  const lineBet = bet / PAYLINE_COUNT;
  ```
- Add JSDoc to the exported function
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
  // After
  /**
   * Computes the line payout using the legacy left-to-right matching algorithm.
   * @param lineSymbols - Ordered symbols on the evaluated payline.
   * @param bet - Total bet in coins (integer, 1..100); divided by 10 for per-line stake.
   * @returns Payout in coins, or 0 when no qualifying run of ≥3 is found.
   */
  export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Replace `return multiplier * lineBet` with `return Math.floor(multiplier * lineBet)` so payouts are always integer coin amounts and the house retains any fractional remainder, consistent with the 95% RTP target and slot-machine industry convention. [L23]
- **[utility · high · trivial]** Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `computeLegacyPayout` (`computeLegacyPayout`) [L4-L24]
