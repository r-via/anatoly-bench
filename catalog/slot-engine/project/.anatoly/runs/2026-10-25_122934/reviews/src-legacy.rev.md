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
- **Correction [OK]**: The logic is consistent. Leading wilds are resolved to the first non-wild symbol, and an all-wild or scatter line pays 0. The match loop counts the base symbol and wilds until the first break. Fewer than 3 matches pays 0. The payout is multiplier * (bet / 10), which matches the README's 10 paylines. No contract in the given context requires integer rounding or a particular all-wild payout, so there is no demonstrable defect.
- **Overengineering [LEAN]**: Short, linear function: resolves leading wild, counts consecutive matches, looks up multiplier. No unnecessary abstraction; delegates pay lookup to getPayMultiplier.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Parameter `lineSymbols: Symbol[]` is not read-only though it is never mutated. Use `readonly Symbol[]`. [L4] |
| 8 | ESLint compliance | WARN | HIGH | Imported type `Symbol` shadows the global `Symbol` (no-shadow / no-redeclare on builtin globals). The name comes from ./types.js, so the primary violation lives there. The unbraced nested ternary with `??` is hard to read. [L1,L5-L7] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Exported `computeLegacyPayout` has no JSDoc. Its units are unclear: `bet / 10` assumes 10 paylines. Its matching semantics are also undocumented. [L4] |
| 13 | Security | WARN | HIGH | Slot-machine/casino domain inferred from the README (reels, paylines, jackpot). Payout is computed as `multiplier * (bet / 10)` with floating-point arithmetic. Floats on monetary values are unsafe in regulated gaming, because `bet / 10` yields fractional coins such as 0.1 × multiplier. The README defines bet as an integer number of coins. Compute in integer units, or round or floor explicitly. [L21-L22] |

### Suggestions

- Accept a read-only array and name the payline count instead of using a magic number
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
    ...
    const lineBet = bet / 10;
    return multiplier * lineBet;
  }
  // After
  const PAYLINE_COUNT = 10;
  
  /** Computes the legacy payout for one payline; returns 0 for fewer than 3 matches. */
  export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {
    ...
    return Math.floor((multiplier * bet) / PAYLINE_COUNT);
  }
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]
