# Review: `src/legacy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| computeLegacyPayout | function | yes | OK | LEAN | DEAD | UNIQUE | - | 78% |

### Details

#### `computeLegacyPayout` (L4–L24)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: The logic is correct. A leading WILD resolves to the first non-WILD symbol. An all-WILD or SCATTER line pays 0. The left-to-right count breaks on the first mismatch, and WILD substitutes. Fewer than 3 matches pay 0. The line bet is bet/10, which fits the README's ten paylines. The README states no rounding contract for fractional coins, and the function has no callers, so non-use is a Utility-axis matter.
- **Overengineering [LEAN]**: Straightforward single-pass wild-aware line evaluation. Complexity matches the task; no unneeded abstractions.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `lineSymbols: Symbol[]` is only read. Declare it `readonly Symbol[]`. The parameter is not mutated. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `computeLegacyPayout` has no JSDoc. The name does not show that `bet` is the total bet spread over 10 lines, that wilds substitute, that at least 3 consecutive matches are needed, or that SCATTER/WILD-only lines pay 0. [L4] |
| 17 | Context-adapted rules | WARN | MEDIUM | Magic number `10` for the payline count at L21. The imported `Symbol` type shadows the global `Symbol`, which hurts readability. [L1, L21] |

### Suggestions

- Accept a readonly array and document the contract.
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
  // After
  /** Legacy payout for one payline. `bet` is the total bet, split evenly over PAYLINE_COUNT lines. Wilds substitute; 3+ consecutive matches from the left are required. */
  export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {
  ```
- Name the payline count constant.
  ```typescript
  // Before
  const lineBet = bet / 10;
  // After
  const PAYLINE_COUNT = 10;
  // ...
  const lineBet = bet / PAYLINE_COUNT;
  ```
- Alias the imported type so it does not shadow the global Symbol.
  - Before: `import type { Symbol } from "./types.js";`
  - After: `import type { Symbol as ReelSymbol } from "./types.js";`

## Actions

### Refactors

- **[utility · medium · trivial]** Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]
