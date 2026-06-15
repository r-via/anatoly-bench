# Review: `src/legacy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| computeLegacyPayout | function | yes | OK | LEAN | DEAD | UNIQUE | - | 90% |

### Details

#### `computeLegacyPayout` (L4–L24)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Logic is correct: WILD substitution via find(non-WILD), SCATTER/all-WILD early exit, left-run match counting with WILD wildcard, payout formula matches documented basePayout = multiplier × (bet/10).
- **Overengineering [LEAN]**: Straightforward: resolve leading symbol (handling WILD substitution), count consecutive matches, apply multiplier. Each step is necessary for slot payout logic. No unnecessary abstraction.
- **Tests [NONE]**: No test file found. Critical logic untested: WILD substitution, SCATTER early return, match counting with mixed WILD/symbol sequences, matchCount < 3 threshold, multiplier calculation, and lineBet division.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Non-obvious behavior — WILD substitution logic, minimum 3-match requirement, lineBet = bet/10 divisor, early returns for WILD/SCATTER as the leading symbol — all undocumented.

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | lineSymbols is never mutated but typed as Symbol[] instead of readonly Symbol[]. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | computeLegacyPayout is exported with no JSDoc. The WILD-substitution logic, 10-line-bet divisor, and return semantics are non-obvious and warrant documentation. [L4] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine domain inferred from WILD/SCATTER/SEVEN/BAR/DIAMOND/CHERRY symbol vocabulary. bet / 10 and multiplier * lineBet apply IEEE 754 floating-point arithmetic to monetary payout values. Regulated gambling requires exact payout calculations; prefer integer coin arithmetic throughout and convert to display units only at the presentation boundary. [L22-L23] |

### Suggestions

- Mark lineSymbols readonly since it is never mutated.
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {`
- Add JSDoc covering WILD substitution logic, per-line bet scaling, and return contract.
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
  // After
  /**
   * Computes the payout for a single payline using the legacy evaluation algorithm.
   * WILD at position 0 is replaced by the first non-WILD symbol found left-to-right.
   * @param lineSymbols - Ordered symbols on the payline (left to right).
   * @param bet - Total bet in coins (1–100 integer). Per-line bet is bet / LINE_COUNT.
   * @returns Payout in coins, or 0 if no winning combination reaches 3 matches.
   */
  export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {
  ```
- Replace magic number 10 with a named constant and keep monetary arithmetic in integer coins to avoid IEEE 754 drift in a regulated gambling context.
  ```typescript
  // Before
  const multiplier = getPayMultiplier(first, matchCount);
  const lineBet = bet / 10;
  return multiplier * lineBet;
  // After
  const LINE_COUNT = 10;
  const multiplier = getPayMultiplier(first, matchCount);
  // Integer coin arithmetic; divide only at display layer
  return Math.trunc(multiplier * bet / LINE_COUNT);
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]
