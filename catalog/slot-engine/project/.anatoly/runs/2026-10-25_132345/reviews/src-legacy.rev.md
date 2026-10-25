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
- **Correction [OK]**: Wild substitution, left-to-right run counting, the 3-match minimum and the bet/10 per-line bet are all consistent. No concrete defect is visible. Nothing in the provided context states that payouts must be integers, so the fractional lineBet is not flagged.
- **Overengineering [LEAN]**: Single-purpose function with a simple loop counting leading matches with wild substitution. No unnecessary abstraction. Reuses getPayMultiplier.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `lineSymbols: Symbol[]` is only read; should be `readonly Symbol[]` (or `ReadonlyArray<Symbol>`). [L4] |
| 8 | ESLint compliance | WARN | HIGH | Imported `Symbol` type shadows the global `Symbol` (no-shadow / no-redeclare for builtin globals). Type-only import limits runtime impact, but it is confusing. Rename or alias, e.g. `import type { Symbol as ReelSymbol }`. [L1] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Exported `computeLegacyPayout` has no JSDoc. It does not document the `bet / 10` line-bet assumption, the wild handling, or the 3-of-a-kind minimum. [L4] |
| 17 | Context-adapted rules | WARN | MEDIUM | The magic number `10` (number of paylines) is hard-coded as `bet / 10` instead of using a named constant. The `"WILD"` and `"SCATTER"` string literals are also repeated. [L20] |

### Suggestions

- Alias the imported Symbol type to avoid shadowing the global, and accept a readonly array
  ```typescript
  // Before
  import type { Symbol } from "./types.js";
  export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
  // After
  import type { Symbol as ReelSymbol } from "./types.js";
  export function computeLegacyPayout(lineSymbols: readonly ReelSymbol[], bet: number): number {
  ```
- Name the payline count and add JSDoc
  ```typescript
  // Before
  const lineBet = bet / 10;
  // After
  const PAYLINE_COUNT = 10;
  /** Computes the legacy payout for one line: leading wild-substituted run of 3+ matching symbols. */
  // ...
  const lineBet = bet / PAYLINE_COUNT;
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]
