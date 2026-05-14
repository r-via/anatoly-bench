# Review: `src/legacy.ts`

**Verdict:** CLEAN

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| computeLegacyPayout | function | yes | OK | LEAN | DEAD | UNIQUE | - | 55% |

### Details

#### `computeLegacyPayout` (L4–L24)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [NEEDS_FIX]**: Payout returned as raw floating-point; `bet / 10` produces a non-integer when `bet` is not divisible by 10, and the product is never floored — in the gambling/slot-machine domain (inferred from WILD/SCATTER/paytable/lineSymbols vocabulary) fractional payouts violate industry convention that the house keeps remainders.
- **Overengineering [LEAN]**: Straightforward payout logic: resolve wild anchor, count consecutive matches, apply multiplier. No unnecessary abstractions or patterns.
- **Tests [NONE]**: No test file exists for this source file. Function has multiple branches (WILD substitution logic, SCATTER early return, match counting, minimum 3-match threshold) all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment. Missing description of WILD substitution logic, the 3-match minimum threshold, the hardcoded 10-line divisor for lineBet, parameter semantics, and return value.

## Best Practices — 7/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `lineSymbols` is only read, never mutated; the parameter type should be `readonly Symbol[]` to communicate intent and prevent accidental mutation. [L4] |
| 8 | ESLint compliance | WARN | HIGH | Magic number `10` in `bet / 10` (L21) violates `no-magic-numbers`. In a regulated slot-machine engine, the line-count divisor must be a named constant to pass audit. [L21] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `computeLegacyPayout` is exported with no JSDoc. A doc comment should describe params (`lineSymbols`, `bet`), return value, and the legacy/deprecation status. [L4] |
| 15 | Testability | WARN | MEDIUM | `getPayMultiplier` is a hard static import rather than an injectable dependency. Unit-testing `computeLegacyPayout` requires mocking the module rather than passing a collaborator, increasing coupling. [L2] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine domain: (1) File is named `legacy.ts` but exports no `@deprecated` JSDoc tag — regulators and downstream consumers cannot distinguish deprecated from current APIs. (2) The magic divisor `10` (presumably number of paylines) is unauditable without a named constant; payout-calculation correctness is a regulatory requirement. [L4,L21] |

### Suggestions

- Mark the exported function with `@deprecated` and add full JSDoc
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
  // After
  /**
   * @deprecated Use `computePayout` from `./engine.ts` instead.
   * Computes the winning payout for a single payline using the legacy multiplier table.
   * @param lineSymbols - Ordered reel symbols on the evaluated line (left to right).
   * @param bet - Total bet across all lines.
   * @returns Credit payout for this line, or 0 if no winning combination.
   */
  export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {
  ```
- Replace magic number `10` with a named constant so payout calculations are auditable
  ```typescript
  // Before
  const lineBet = bet / 10;
  // After
  const LINE_COUNT = 10;
  const lineBet = bet / LINE_COUNT;
  ```
- Accept `getPayMultiplier` as an optional injectable parameter to improve testability
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

- **[correction · medium · small]** Replace `const lineBet = bet / 10; return multiplier * lineBet;` with `return Math.floor(multiplier * bet / 10);` to avoid floating-point imprecision and ensure payouts are floor-rounded to whole credit units, consistent with regulated slot-machine accounting. [L21]

### Refactors

- **[utility · medium · trivial]** Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `computeLegacyPayout` (`computeLegacyPayout`) [L4-L24]
