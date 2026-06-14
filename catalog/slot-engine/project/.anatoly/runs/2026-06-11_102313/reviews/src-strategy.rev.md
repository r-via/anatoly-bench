# Review: `src/strategy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SpinStrategy | class | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| DefaultStrategy | class | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| ConservativeStrategy | class | yes | OK | - | DEAD | UNIQUE | - | 90% |

### Details

#### `SpinStrategy` (L3–L5)

- **Utility [USED]**: Transitively used by DefaultStrategy
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Abstract base class with no implementation; nothing to evaluate correctness against.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: Abstract base class with no test file found.
- **UNDOCUMENTED [UNDOCUMENTED]**: Abstract base class with no JSDoc. Purpose, intended usage, and the contract for `adjustPayout` are not explained.

#### `DefaultStrategy` (L7–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Identity pass-through; no mutation, no type mismatch.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: No test file found. Used by src/engine.ts, making untested identity passthrough a gap in engine coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The pass-through behavior of `adjustPayout` (returns result unchanged) is non-obvious and warrants at least a brief description.

#### `ConservativeStrategy` (L13–L20)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Math.floor on a coins-denominated integer payout is correct (house keeps the remainder); the 0.8 multiplier is internally consistent and no in-tree caller triggers the code path, so no runtime defect is reachable.
- **Overengineering [OVER]**: 0 importers — dead code. A one-liner multiplier (`Math.floor(payout * 0.8)`) wrapped in a class that is never used. Should either be deleted or collapsed into a plain function if needed.
- **Tests [NONE]**: No test file found. The 0.8 multiplier with Math.floor truncation is a business-critical behavior with no test coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The 0.8 multiplier applied to `totalPayout` is a magic number with no explanation of the business rationale or configuration intent.

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | FAIL | MEDIUM | All three exported symbols (SpinStrategy, DefaultStrategy, ConservativeStrategy) lack JSDoc. In a regulated-gaming codebase the payout semantics of each strategy — especially ConservativeStrategy's 20% reduction — must be documented. [L4-L20] |
| 17 | Context-adapted rules | FAIL | MEDIUM | Regulated-gaming domain inferred from reel/spin/jackpot/scatter vocabulary and README RTP contract. The arbitrated intent states the engine must target 95% RTP. ConservativeStrategy universally multiplies totalPayout by 0.8, which drops long-run RTP from ~95% to ~76% (0.95 × 0.8 = 0.76). This contradicts the arbitrated 95% RTP invariant and would fail a regulatory audit. Either the strategy must be scoped to non-certified game modes (with explicit documentation), or the reduction factor must be calibrated to preserve the certified RTP. [L14-L20] |

### Suggestions

- Add JSDoc to all public exports, especially documenting the RTP impact of ConservativeStrategy
  ```typescript
  // Before
  export class ConservativeStrategy extends SpinStrategy {
    adjustPayout(result: SpinResult): SpinResult {
  // After
  /**
   * Reduces all payouts by 20%. NOTE: this strategy is NOT calibrated to the
   * certified 95% RTP and must only be used in non-regulated/demo contexts.
   */
  export class ConservativeStrategy extends SpinStrategy {
    adjustPayout(result: SpinResult): SpinResult {
  ```
- Align ConservativeStrategy's reduction factor to preserve the 95% RTP, or rename/guard it clearly
  ```typescript
  // Before
  totalPayout: Math.floor(result.totalPayout * 0.8),
  // After
  // If a lower-volatility profile is needed, calibrate against the paytable
  // so long-run RTP still converges to 95%.
  totalPayout: Math.floor(result.totalPayout * CONSERVATIVE_FACTOR), // CONSERVATIVE_FACTOR must be RTP-verified
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ConservativeStrategy` is exported but unused (`ConservativeStrategy`) [L13-L20]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SpinStrategy` (`SpinStrategy`) [L3-L5]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `DefaultStrategy` (`DefaultStrategy`) [L7-L11]
