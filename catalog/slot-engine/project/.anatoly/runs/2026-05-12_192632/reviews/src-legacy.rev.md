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
- **Correction [OK]**: Logic is correct for a legacy (no-wild-multiplier) payline evaluator: leading-WILD substitution, consecutive match counting, and lineBet derivation are all sound. SCATTER/all-WILD early-exit is correct. Edge cases (empty array, all WILDs, SCATTER behind WILDs) all resolve to 0 as expected.
- **Overengineering [LEAN]**: Straightforward iterative match-count logic with a single early-exit guard and a direct multiplier lookup. No unnecessary abstractions.
- **Tests [NONE]**: No test file found. Critical logic untested: WILD substitution, SCATTER early-return, match counting, minimum-3 threshold, and payout calculation.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment. Missing description of WILD substitution logic, the 10-line bet division, minimum match threshold (3), and what 0 return means for SCATTER/unqualified lines.

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | lineSymbols is only read but typed as mutable Symbol[]. Should be readonly Symbol[]. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | computeLegacyPayout is exported with no JSDoc. Legacy semantics, parameter contracts, and return units should be documented. [L4] |
| 12 | Async/Promises/Error handling | WARN | MEDIUM | No guard on empty lineSymbols: lineSymbols[0] resolves to undefined at runtime, bypassing both early returns and passing undefined to getPayMultiplier(first, matchCount) at L22. [L5-L7] |
| 13 | Security | WARN | HIGH | Slot-machine domain inferred from WILD/SCATTER/paytable/lineSymbols vocabulary. bet / 10 uses floating-point division for a monetary line-bet value (e.g. bet=3 → lineBet=0.30000000000000004). Regulated gaming requires integer coin arithmetic throughout — fractional payout values are an audit/compliance risk. [L22] |

### Suggestions

- Mark parameter readonly to signal no mutation occurs.
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {`
- Add JSDoc to document legacy contract and param units.
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
  // After
  /**
   * Computes payline payout using legacy rules (no wild-multiplier escalation).
   * @param lineSymbols - Left-to-right symbol sequence for the payline.
   * @param bet - Total bet in coins across all 10 paylines.
   * @returns Coin payout for this line, or 0 when no qualifying match exists.
   */
  export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {
  ```
- Guard against empty array to prevent undefined reaching getPayMultiplier.
  ```typescript
  // Before
    const first = lineSymbols[0] === "WILD"
  // After
    if (lineSymbols.length === 0) return 0;
    const first = lineSymbols[0] === "WILD"
  ```
- Use integer coin arithmetic to eliminate floating-point precision risk on monetary values.
  ```typescript
  // Before
    const lineBet = bet / 10;
    return multiplier * lineBet;
  // After
    const lineBet = Math.trunc(bet / 10); // keep in whole coins; fractional remainder discarded
    return multiplier * lineBet;
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `computeLegacyPayout` (`computeLegacyPayout`) [L4-L24]
