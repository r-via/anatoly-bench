# Review: `src/legacy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| computeLegacyPayout | function | yes | OK | LEAN | DEAD | UNIQUE | - | 65% |

### Details

#### `computeLegacyPayout` (L4–L24)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [NEEDS_FIX]**: WILDs are counted toward matchCount but wildCount is never tracked and the (1 + wildCount) × 2^wildCount bonus is never applied, underpaying any winning line that includes WILD substitutions.
- **Overengineering [LEAN]**: Straightforward left-to-right scan with WILD substitution, early exits, and a single payout formula. No unnecessary abstractions.
- **Tests [NONE]**: No test file found. Function has multiple code paths: WILD substitution logic, SCATTER early return, consecutive match counting, matchCount < 3 guard, and payout calculation — all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing description of purpose, @param lineSymbols, @param bet, @returns, WILD substitution logic, minimum match threshold of 3, or lineBet derivation (bet/10).

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | lineSymbols typed as Symbol[] (mutable). The function never mutates the array; readonly Symbol[] better expresses intent and aligns with the ReadonlyArray<ReadonlyArray<Symbol>> used throughout the engine. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | computeLegacyPayout is a public export with no JSDoc. Given the "legacy" naming, a brief note distinguishing its behaviour from evaluateLine (no wild multiplier, no bet validation) is especially important for callers. [L4] |
| 10 | Modern 2026 practices | WARN | MEDIUM | Indexed for loop (L11-L17) never uses the index — only lineSymbols[i]. for...of with break is idiomatic modern TypeScript. [L11-L17] |
| 13 | Security | WARN | HIGH | Slot-machine domain inferred from Symbol vocabulary (WILD, SCATTER, DIAMOND), payline terminology, and internal docs (.anatoly/state/internal-docs). bet / 10 produces a floating-point lineBet (e.g., bet=1 → 0.1) and the return value is a raw float — unlike computePayout in engine.ts which applies Math.ceil. In regulated gaming, payout values must be deterministically precise; fractional credits escaping unclamped can cause RTP drift under certification audits. [L22-L23] |
| 17 | Context-adapted rules | WARN | MEDIUM | Casino/slot-machine domain. The function performs no bet validation against the arbitrated contract (integer 1–100, per README.md intent). Zero, negative, and float bets are silently processed. Additionally, WILD substitutions are counted toward matchCount but the wild multiplier formula ((1 + wildCount) × 2^wildCount) is not applied — intentional legacy behaviour but undocumented, risking callers assuming parity with evaluateLine. [L4] |

### Suggestions

- Declare lineSymbols as readonly to match ReadonlyArray conventions used elsewhere in the engine
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {`
- Replace indexed for loop with for...of — index is unused
  ```typescript
  // Before
  for (let i = 0; i < lineSymbols.length; i++) {
      if (lineSymbols[i] === first || lineSymbols[i] === "WILD") {
        matchCount++;
      } else {
        break;
      }
    }
  // After
  for (const s of lineSymbols) {
      if (s === first || s === "WILD") {
        matchCount++;
      } else {
        break;
      }
    }
  ```
- Clamp output to integer credits to prevent floating-point imprecision escaping into callers (regulated gaming domain)
  - Before: `return multiplier * lineBet;`
  - After: `return Math.ceil(multiplier * lineBet);`
- Add JSDoc documenting legacy vs current engine differences
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
  // After
  /**
   * Legacy single-line payout calculator (pre-wild-multiplier era).
   * Unlike {@link evaluateLine} in engine.ts, this function does NOT apply the wild
   * bonus multiplier and does NOT validate bet bounds.
   * @param lineSymbols - Ordered symbols on one payline, left to right.
   * @param bet - Total bet in credits (expected: integer 1–100).
   * @returns Payout in credits, or 0 for no qualifying run.
   */
  export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Track wildCount inside the match loop and multiply the final payout by (1 + wildCount) × 2^wildCount before returning, matching the documented wild bonus formula. [L11]

### Refactors

- **[utility · medium · trivial]** Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `computeLegacyPayout` (`computeLegacyPayout`) [L4-L24]
