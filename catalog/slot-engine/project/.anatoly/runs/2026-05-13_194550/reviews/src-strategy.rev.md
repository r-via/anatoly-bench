# Review: `src/strategy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SpinStrategy | class | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| DefaultStrategy | class | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| ConservativeStrategy | class | yes | OK | - | DEAD | UNIQUE | - | 80% |

### Details

#### `SpinStrategy` (L3–L5)

Auto-resolved: function ≤ 5 lines

#### `DefaultStrategy` (L7–L11)

Auto-resolved: function ≤ 5 lines

#### `ConservativeStrategy` (L13–L20)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [NEEDS_FIX]**: Two independent defects: 0.8× multiplier violates the arbitrated 95% RTP target; lineWins not scaled to match the reduced totalPayout.
- **Overengineering [OVER]**: 0 importers — dead code. Additionally, its 0.8× multiplier on `totalPayout` would violate the arbitrated 95% RTP invariant (README) if ever activated, making it both unused and architecturally inconsistent with the documented contract.
- **Tests [NONE]**: No test file found. The 0.8 multiplier with Math.floor truncation has no coverage for boundary values or fractional payout behavior.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The 0.8 multiplier and floor rounding applied to `totalPayout` are undocumented business logic that should be explained.

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | All three exported symbols (SpinStrategy, DefaultStrategy, ConservativeStrategy) and their adjustPayout methods lack JSDoc. ConservativeStrategy especially warrants a doc explaining the 0.8 RTP impact. [L1-L20] |
| 13 | Security | WARN | HIGH | Slot-machine domain inferred from SpinResult, SpinStrategy, and project filenames (reels.ts, jackpot.ts, freespin.ts). Industry rule: all monetary/payout arithmetic in regulated gambling must use exact integer operations. `result.totalPayout * 0.8` is a float multiplication on an integer coin value; although Math.floor mitigates this for typical small integers, it is not IEEE-754 safe for arbitrary values. Replace with integer-only arithmetic: `Math.floor(result.totalPayout * 4 / 5)` — where the integer multiplication precedes the division. [L18] |

### Suggestions

- Replace float multiplication with integer-safe arithmetic for gambling-domain payout calculations.
  - Before: `totalPayout: Math.floor(result.totalPayout * 0.8),`
  - After: `totalPayout: Math.floor(result.totalPayout * 4 / 5),`
- Add JSDoc to exported classes so consumers understand each strategy's RTP impact.
  ```typescript
  // Before
  export class ConservativeStrategy extends SpinStrategy {
    adjustPayout(result: SpinResult): SpinResult {
  // After
  /**
   * Reduces every payout to 80 % of its computed value (floor-truncated).
   * Intended for lower-volatility play modes; lowers effective RTP below the
   * engine's baseline 95 % target.
   */
  export class ConservativeStrategy extends SpinStrategy {
    /**
     * @param result - The raw spin outcome produced by the engine.
     * @returns A new SpinResult with totalPayout reduced to ⌊payout × 0.8⌋.
     */
    adjustPayout(result: SpinResult): SpinResult {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Revise the ConservativeStrategy payout multiplier so the resulting RTP remains at the arbitrated 95% target, or document and enforce that this strategy is only used in contexts explicitly exempt from the 95% RTP invariant. [L17]
- **[correction · medium · small]** Scale individual lineWins entries proportionally alongside totalPayout so SpinResult internal state stays consistent after adjustment. [L16]
- **[utility · high · trivial]** Remove dead code: `ConservativeStrategy` is exported but unused (`ConservativeStrategy`) [L13-L20]

### Hygiene

- **[overengineering · medium · small]** Simplify: `SpinStrategy` is over-engineered `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
