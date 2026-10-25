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
- **Correction [OK]**: Logic is consistent. A leading WILD resolves to the first non-WILD symbol. WILD and SCATTER lines pay 0. The match run stops at the first non-matching symbol. Fewer than 3 matches pay 0. Payout is multiplier × bet/10. No contract in the provided context says the payout must be an integer or that lineBet must be rounded.
- **Overengineering [LEAN]**: Short, single-purpose line payout calculation. Wild handling and prefix matching are required; no unnecessary abstraction.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `lineSymbols: Symbol[]` should be `readonly Symbol[]` since it is not mutated. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Exported `computeLegacyPayout` has no JSDoc. Wild handling, the 3-match minimum and the bet/10 line bet are undocumented. [L4-L24] |
| 13 | Security | WARN | HIGH | Slot-engine (regulated gaming/payments) domain inferred from the README. `bet / 10` and the multiplication use floating-point on coin payouts, so non-multiple-of-10 bets give fractional payouts. Integer arithmetic is safer for monetary values. [L21-L22] |

### Suggestions

- Mark the input array readonly
  - Before: `lineSymbols: Symbol[]`
  - After: `lineSymbols: readonly Symbol[]`
- Add JSDoc and avoid float division on money
  ```typescript
  // Before
  const lineBet = bet / 10;
  return multiplier * lineBet;
  // After
  return Math.floor((multiplier * bet) / 10);
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]
