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
- **Correction [NEEDS_FIX]**: Two independent defects: all-WILD line silently returns 0 instead of substituting highest symbol; payout uses raw float multiplication without floor truncation.
- **Overengineering [LEAN]**: Straightforward payout calculation: resolve wild substitution, count consecutive matches, apply multiplier. No unnecessary abstractions or generics.
- **Tests [NONE]**: No test file found. Logic covers WILD substitution, SCATTER exclusion, match counting with early break, minimum match threshold, and payout calculation — all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing description of WILD substitution logic, the hardcoded divisor (bet/10 implying 10 lines), minimum match threshold of 3, why SCATTER returns 0, and what the return value represents.

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `lineSymbols` is never mutated inside the function but is typed as mutable `Symbol[]`. Should be `readonly Symbol[]` to express intent and prevent accidental mutation. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `computeLegacyPayout` is a public export with no JSDoc. In a gambling engine, documenting the payout algorithm (including the implicit assumption of 10 lines) is important for auditability. [L4] |
| 15 | Testability | WARN | MEDIUM | `getPayMultiplier` is a hard import, not injectable. Unit-testing `computeLegacyPayout` in isolation requires module-level mocking rather than a simple argument substitution. [L2] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine domain inferred from `jackpot.ts`, `reels.ts`, `paytable.ts`, `freespin.ts`, `rng.ts`, and vocabulary (WILD, SCATTER, matchCount, lineBet). Two magic numbers undermine math auditability required in regulated gaming: `10` (implied line count in `bet / 10`) and `3` (minimum match threshold). Both should be named constants. [L20-L21] |

### Suggestions

- Mark the `lineSymbols` parameter as `readonly` since it is never mutated.
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {`
- Replace magic numbers with named constants for auditability in regulated gambling code.
  ```typescript
  // Before
  const lineBet = bet / 10;
    if (matchCount < 3) return 0;
  // After
  const LINE_COUNT = 10;
  const MIN_MATCH = 3;
  // ...
  if (matchCount < MIN_MATCH) return 0;
  const lineBet = bet / LINE_COUNT;
  ```
- Add JSDoc to the public export documenting the algorithm and assumptions.
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
  // After
  /**
   * Computes the payout for a single payline using legacy left-to-right match logic.
   * @param lineSymbols - Ordered symbols on the evaluated payline.
   * @param bet - Total bet amount; line bet is derived as `bet / LINE_COUNT`.
   * @returns Payout amount, or 0 if no qualifying match.
   */
  export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** All-WILD line should substitute for the highest-paying regular symbol (or the highest symbol found in the paytable) and call getPayMultiplier with that symbol, not return 0. [L7]
- **[correction · medium · small]** Wrap the return value with Math.floor: `return Math.floor(multiplier * lineBet)` to guarantee integer credit payouts and comply with regulated-gaming rounding rules. [L23]

### Refactors

- **[utility · medium · trivial]** Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `computeLegacyPayout` (`computeLegacyPayout`) [L4-L24]
