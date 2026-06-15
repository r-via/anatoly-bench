# Review: `src/legacy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| computeLegacyPayout | function | yes | OK | LEAN | DEAD | UNIQUE | - | 82% |

### Details

#### `computeLegacyPayout` (L4–L24)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [NEEDS_FIX]**: Payout returns a floating-point value; no rounding applied despite integer-coin domain.
- **Overengineering [LEAN]**: Straightforward sequential logic: resolve leading WILDs, count matching run, apply multiplier. No unnecessary abstractions or premature generalization.
- **Tests [NONE]**: No test file found. Critical edge cases untested: WILD-only lines, SCATTER handling, match count < 3 threshold, WILD substitution logic, payout calculation correctness.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment. Non-obvious behavior includes WILD-substitution logic (first non-WILD symbol used as match target), SCATTER/WILD returning 0, minimum 3-match threshold, and lineBet = bet/10 divisor — none of these are documented.

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `lineSymbols` is iterated but never mutated. The parameter should be `readonly Symbol[]`. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `computeLegacyPayout` is a public export with no JSDoc. Minimum doc should describe the `lineSymbols`/`bet` contract and the legacy match-counting algorithm. [L4] |
| 13 | Security | FAIL | HIGH | Slot-machine domain inferred from WILD/SCATTER/CHERRY/SEVEN/DIAMOND vocabulary, paytable multipliers, and payout function. `bet / 10` (L22) produces an IEEE 754 non-representable fraction for any `bet` not divisible by 10 (e.g. `1/10 = 0.10000000000000001`). Subsequent `multiplier * lineBet` compounds the error. Regulated gaming certification requires exact payout arithmetic — floating-point on bet/payout amounts is a compliance violation. Use integer arithmetic: `(multiplier * bet) / 10` with `Math.round` guard, or ensure the caller guarantees `bet % 10 === 0` and enforce it with a runtime assertion. [L22-L23] |

### Suggestions

- Mark the input array readonly to prevent accidental mutation and signal intent.
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number`
  - After: `export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number`
- Use integer-safe arithmetic for regulated-gaming payout to avoid IEEE 754 drift. `bet` is guaranteed an integer (1..100); multiply first, divide last, then round.
  ```typescript
  // Before
  const lineBet = bet / 10;
  return multiplier * lineBet;
  // After
  // Integer-first: avoids floating-point on monetary values
  return Math.round(multiplier * bet) / 10;
  ```
- Use the `Bet` type alias defined in the project contract instead of raw `number`.
  - Before: `export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number`
  - After: `export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: Bet): number`

## Actions

### Quick Wins

- **[correction · medium · small]** Replace `return multiplier * lineBet` with `return Math.floor(multiplier * lineBet)` to produce integer coin payouts and eliminate floating-point accumulation errors. Applies to both the `bet/10` division and the final multiply — integer-coin slot domains must floor payouts (house keeps the remainder). [L23]
- **[utility · high · trivial]** Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `computeLegacyPayout` (`computeLegacyPayout`) [L4-L24]
