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
- **Correction [NEEDS_FIX]**: Wild multiplier `(1 + wildCount) × 2^wildCount` is never computed or applied; lines with WILD substitutions pay only the base multiplier.
- **Overengineering [LEAN]**: Straightforward left-to-right match scan with WILD substitution, early exits, and a single payout formula. No unnecessary abstractions.
- **Tests [NONE]**: No test file found. Function has multiple branches: WILD substitution logic, SCATTER early return, consecutive match counting, minimum match threshold, and payout calculation — all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment. Missing description of purpose, parameter semantics (lineSymbols ordering, bet denomination), return value, WILD substitution logic, minimum match threshold, and why SCATTER returns 0.

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | lineSymbols: Symbol[] is mutable. The reel pipeline (03-Data-Flow.md Stage 2) produces ReadonlyArray<ReadonlyArray<Symbol>>; the parameter should mirror that contract. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | computeLegacyPayout is a public export with no JSDoc. Parameter contracts, return semantics, and the intentional absence of the wild multiplier are undocumented. [L4] |
| 13 | Security | WARN | HIGH | Slot-machine gambling domain confirmed by payline/WILD/SCATTER/jackpot vocabulary across the project. bet / 10 yields IEEE-754 floating-point (bet=1 → lineBet=0.1); multiplier * lineBet then accumulates representation error. For regulated gambling credit accounting, exact integer arithmetic or a safe-rounding strategy is required. The main engine applies Math.ceil, but computeLegacyPayout returns raw floating-point to callers. [L22-L23] |
| 17 | Context-adapted rules | WARN | MEDIUM | Gambling domain: the arbitrated intent (README.md) defines Bet as integer 1..100. computeLegacyPayout accepts any number—0, negatives, non-integers—silently producing nonsensical credit output. A guard or type narrowing should be present. [L4] |

### Suggestions

- Widen lineSymbols to ReadonlyArray to match the reel output contract
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: ReadonlyArray<Symbol>, bet: number): number {`
- Avoid floating-point by keeping multiplication in integer space and dividing last
  ```typescript
  // Before
  const lineBet = bet / 10;
  return multiplier * lineBet;
  // After
  // multiply first to stay in integer space; divide once at the end
  return (multiplier * bet) / 10;
  ```
- Document the public export, especially the intentional omission of the wild multiplier bonus
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
  // After
  /**
   * Legacy payout calculation — does NOT apply the wild-bonus multiplier.
   * @param lineSymbols Symbols on the evaluated payline (ReadonlyArray, length 1–5).
   * @param bet Total bet in credits, integer 1–100.
   * @returns Line payout in credits, or 0 for no qualifying match.
   */
  export function computeLegacyPayout(lineSymbols: ReadonlyArray<Symbol>, bet: number): number {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Track `wildCount` separately in the match loop (increment when `lineSymbols[i] === 'WILD'`), then multiply the computed payout by `(1 + wildCount) * Math.pow(2, wildCount)` before returning, matching the formula in `.anatoly/state/internal-docs/02-Architecture/03-Data-Flow.md` Stage 3. [L11]
- **[utility · high · trivial]** Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `computeLegacyPayout` (`computeLegacyPayout`) [L4-L24]
