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
- **Correction [OK]**: Lead-symbol detection, consecutive-match counting with WILD substitution, and SCATTER/WILD guards are all correct. No wild bonus multiplier is applied, but this is a legacy path that predates that mechanic and is not under the arbitrated contract for the canonical engine. No rounding is applied to the returned value, but the float multiplication (bet/10) is an intermediate result — callers that need integer credits must round downstream.
- **Overengineering [LEAN]**: Straightforward left-to-right match counter with WILD substitution, early exits, and a single payout formula. No unnecessary abstractions.
- **Tests [NONE]**: No test file found. Function has multiple branches: WILD-first substitution, SCATTER early return, match counting with WILD mix-ins, matchCount < 3 guard, and multiplier/lineBet calculation — all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Complex behavior is undocumented: WILD substitution for lead symbol, SCATTER early-return, left-to-right consecutive match counting, 3-match minimum, and lineBet derivation (bet/10) are all opaque to callers.

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | lineSymbols is never mutated but declared as mutable Symbol[]. Should be readonly Symbol[]. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | computeLegacyPayout is exported with no JSDoc. A doc comment should note that this is a legacy path that omits the wild multiplier and has no bet validation. [L4] |
| 13 | Security | WARN | MEDIUM | Casino/slot-machine domain inferred from WILD/SCATTER/DIAMOND/jackpot/paytable vocabulary and reference docs (.anatoly/state/internal-docs/02-Architecture/03-Data-Flow.md). bet / 10 and multiplier * lineBet use IEEE-754 floating-point on credit amounts with no rounding guard. The canonical engine applies Math.ceil at aggregation; this legacy path bypasses that, leaving precision errors in caller-visible results. [L22-L23] |
| 17 | Context-adapted rules | WARN | MEDIUM | Casino domain: (1) bet is not validated against the arbitrated 1–100 integer contract (README arbitrated intent); bet=0 or negative silently returns a fractional or zero payout instead of throwing. (2) The wild multiplier formula ((1+wildCount)×2^wildCount) from the reference docs is absent with no inline comment explaining the intentional divergence, making the legacy/engine behavioral difference invisible to maintainers. [L4-L24] |

### Suggestions

- Mark lineSymbols as readonly to match actual usage.
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {`
- Add JSDoc documenting legacy status, missing wild multiplier, and expected bet range.
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
  // After
  /**
   * Legacy payline payout — intentionally omits the wild multiplier bonus.
   * Retained for backward compatibility only; prefer `evaluateLine` in engine.ts.
   * @param lineSymbols Left-to-right symbols on the payline.
   * @param bet Total bet in coins (integer, 1–100).
   */
  export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {
  ```
- Validate bet to match the arbitrated contract and mirror engine.ts behaviour on invalid input.
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
    const first = lineSymbols[0] === "WILD"
  // After
  export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {
    if (!Number.isInteger(bet) || bet < 1) throw new Error('invalid bet');
    const first = lineSymbols[0] === "WILD"
  ```
- Apply Math.ceil to the return value so the legacy path produces integer credits consistent with the engine's aggregation rounding.
  - Before: `return multiplier * lineBet;`
  - After: `return Math.ceil(multiplier * lineBet);`

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `computeLegacyPayout` (`computeLegacyPayout`) [L4-L24]
