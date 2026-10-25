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
- **Correction [OK]**: Logic is correct: leading-WILD resolution, consecutive-match counting (with mid-sequence WILD substitution), minimum-3 guard, and lineBet = bet/10 (consistent with the README's 10-payline model) all behave as expected across normal and edge inputs.
- **Overengineering [LEAN]**: Straightforward linear scan with early exits: resolves the anchor symbol, counts consecutive matches, delegates multiplier lookup, computes payout. No unnecessary abstractions, generics, or patterns for what is a single-purpose calculation.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `lineSymbols: Symbol[]` is never mutated inside the function; the parameter should be `readonly Symbol[]`. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `computeLegacyPayout` is the sole public export and lacks a JSDoc comment. One missing JSDoc is WARN, not FAIL. [L4] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine domain (gambling). `bet / 10` produces a float lineBet (e.g., bet=7 → 0.7), and `multiplier * lineBet` can yield IEEE-754 fractions. Per project instructions this is a single in-memory terminal computation from integer inputs, placing it at most a rule-17 WARN rather than a rule-13 FAIL. Prefer integer coin arithmetic throughout and divide only at display time. [L22] |

### Suggestions

- Mark the array parameter readonly to signal no mutation and gain additional type-safety
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {`
- Add JSDoc to document the contract of the sole public export
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
  // After
  /**
   * Computes a legacy left-to-right payout for a single payline.
   * @param lineSymbols - ordered symbols on the evaluated payline
   * @param bet - total bet in coins (1–100); divided by 10 to derive the line bet
   * @returns payout in coins, or 0 when no qualifying match
   */
  export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {
  ```
- Use integer coin arithmetic to avoid IEEE-754 drift on payout; multiply first, divide last
  ```typescript
  // Before
  const lineBet = bet / 10;
  return multiplier * lineBet;
  // After
  return (multiplier * bet) / 10;
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]
