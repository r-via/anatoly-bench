# Review: `src/legacy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| computeLegacyPayout | function | yes | OK | LEAN | DEAD | UNIQUE | - | 72% |

### Details

#### `computeLegacyPayout` (L4–L24)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [NEEDS_FIX]**: Wild multiplier not applied: wins involving WILD substitutions are under-paid vs. the documented formula `basePayout × (1 + wildCount) × 2^wildCount`.
- **Overengineering [LEAN]**: Straightforward left-to-right match scan with WILD substitution logic, no unnecessary abstractions. Mirrors the documented payline evaluation algorithm directly.
- **Tests [NONE]**: No test file found. Critical logic — WILD substitution, SCATTER early return, match counting, minimum-3 threshold, and payout calculation — is entirely uncovered.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment. Non-trivial logic — WILD-substitution for lead symbol, early-exit on SCATTER, minimum match threshold of 3, and lineBet derivation (bet/10) — all require documentation for callers.

## Best Practices — 7.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | lineSymbols is typed as Symbol[] but never mutated. Should be ReadonlyArray<Symbol>. Internal docs use ReadonlyArray<ReadonlyArray<Symbol>> for grid data throughout the engine. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | computeLegacyPayout is a public export with no JSDoc. Given it intentionally omits the wild multiplier present in the canonical engine, documentation of its algorithmic contract is especially important. [L4] |
| 13 | Security | WARN | HIGH | Slot-machine/regulated-gambling domain inferred from paytable, reel, jackpot, WILD/SCATTER/DIAMOND vocabulary throughout the project. bet / 10 produces IEEE 754 floating-point for non-multiples-of-10 bets (e.g. bet=1 → lineBet=0.1, which is not exactly representable). In regulated gambling, payout arithmetic should use integer units or a Decimal library. Downstream Math.ceil() in the engine partially mitigates accumulation, but legacy payouts are not guaranteed to round-trip exactly. [L22] |
| 17 | Context-adapted rules | WARN | MEDIUM | Gambling domain: computeLegacyPayout omits the wild multiplier ((1 + wildCount) × 2^wildCount) mandated by the canonical engine (src/engine.ts, per .anatoly/state/internal-docs/02-Architecture/03-Data-Flow.md). No comment documents this deliberate algorithmic deviation. In regulated gambling, variant payout paths must be explicitly marked and justified to pass RNG/payout audits. [L4-L24] |

### Suggestions

- Use ReadonlyArray to express non-mutation intent and catch accidental writes at compile time.
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: ReadonlyArray<Symbol>, bet: number): number {`
- Add JSDoc documenting the function's purpose and its intentional differences from the current engine (no wild multiplier, no house-edge markup).
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
  // After
  /**
   * Legacy payout calculator retained for historical audit trails.
   *
   * Intentional differences from engine.ts evaluateLine:
   * - No wild multiplier ((1 + wildCount) × 2^wildCount is NOT applied).
   * - No house-edge or minimum-floor adjustment.
   *
   * @param lineSymbols - The 5 symbols extracted from a single payline.
   * @param bet - Total bet in coins (1–100 integer per engine contract).
   * @returns Raw credit payout before house-edge rounding.
   */
  export function computeLegacyPayout(lineSymbols: ReadonlyArray<Symbol>, bet: number): number {
  ```
- Avoid IEEE 754 imprecision on credit arithmetic in regulated gambling by using integer tenths and rounding only at return.
  ```typescript
  // Before
  const multiplier = getPayMultiplier(first, matchCount);
    const lineBet = bet / 10;
    return multiplier * lineBet;
  // After
  const multiplier = getPayMultiplier(first, matchCount);
    // Use integer arithmetic to avoid floating-point drift; divide only once at the boundary.
    return Math.round(multiplier * bet) / 10;
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Track `wildCount` (count of WILD symbols in the matched run) inside the counting loop, then multiply the base payout by `(1 + wildCount) * Math.pow(2, wildCount)` before returning. [L22]

### Refactors

- **[utility · medium · trivial]** Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `computeLegacyPayout` (`computeLegacyPayout`) [L4-L24]
