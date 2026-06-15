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
- **Correction [OK]**: Moot — symbol is DEAD (was NEEDS_FIX: Returns fractional coin payouts for non-multiple-of-10 bets; slot-machine industry rule requires flooring payouts to whole coins.)
- **Overengineering [LEAN]**: Straightforward payout computation: resolve leading WILD, count consecutive matches, delegate multiplier lookup, apply line bet. No unnecessary abstractions or premature generalization.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 7.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `lineSymbols: Symbol[]` is never mutated inside the function but is not declared `readonly`. Should be `ReadonlyArray<Symbol>` to signal intent and prevent accidental mutation. [L4] |
| 8 | ESLint compliance | WARN | HIGH | `for (let i = 0; i < lineSymbols.length; i++)` accesses array only by index and never uses `i` for anything else. Triggers `@typescript-eslint/prefer-for-of`. Rewrite as `for (const sym of lineSymbols)`. [L11-L16] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `computeLegacyPayout` is a public export with no JSDoc. At minimum, document the `bet` parameter contract (1–100 integer coins) and the return semantics (coins won). [L4] |
| 13 | Security | WARN | HIGH | Slot-machine domain inferred from project structure (engine.ts, freespin.ts, jackpot.ts, rng.ts, paytable.ts) and vocabulary (WILD, SCATTER, lineSymbols, matchCount). `bet / 10` performs IEEE 754 floating-point division on an integer bet (1–100 coins), producing non-exact values (e.g. bet=1 → lineBet=0.1, not exactly representable). Subsequent `multiplier * lineBet` compounds the imprecision. Regulated gaming math must be deterministically exact; floating-point payout arithmetic fails RNG/math certification audits in most jurisdictions. Use integer arithmetic throughout (e.g. return `multiplier * bet` in whole coins and divide by the line-count constant only at the final display layer, or scale to a base unit of 1/10 coin using integers). [L21-L22] |
| 17 | Context-adapted rules | WARN | MEDIUM | Magic number `10` on L21 encodes the payline count with no named constant or comment. Changing the machine's line count would silently break payouts. Extract as `const PAYLINE_COUNT = 10` (or import from a shared config). [L21] |

### Suggestions

- Mark `lineSymbols` parameter as readonly to prevent accidental mutation and signal pure-function intent.
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: ReadonlyArray<Symbol>, bet: number): number {`
- Replace indexed for-loop (no index arithmetic needed) with for-of to satisfy `prefer-for-of`.
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
- Replace magic number 10 with a named constant and use integer payout arithmetic to avoid IEEE 754 imprecision in regulated gaming math.
  ```typescript
  // Before
  const lineBet = bet / 10;
  return multiplier * lineBet;
  // After
  // Returns whole coins; caller divides by PAYLINE_COUNT if needed for display
  const PAYLINE_COUNT = 10;
  return Math.round(multiplier * bet) / PAYLINE_COUNT;
  ```
- Add JSDoc to the public export documenting the bet contract and return semantics.
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: ReadonlyArray<Symbol>, bet: number): number {
  // After
  /**
   * Computes the coin payout for a single payline.
   * @param lineSymbols - Symbols on the evaluated payline, left to right.
   * @param bet - Total bet in coins (integer, 1–100). Split evenly across 10 lines.
   * @returns Coins won on this line (0 if no qualifying match).
   */
  export function computeLegacyPayout(lineSymbols: ReadonlyArray<Symbol>, bet: number): number {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Replace `return multiplier * lineBet` with `return Math.floor(multiplier * lineBet)` to guarantee integer coin payouts across all valid bet values (1..100) per slot-machine industry rounding convention. [L23]

### Refactors

- **[utility · medium · trivial]** Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]
