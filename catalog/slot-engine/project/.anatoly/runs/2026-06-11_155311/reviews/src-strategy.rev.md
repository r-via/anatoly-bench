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
- **Correction [OK]**: Abstract base class with no logic; correct as a contract definition.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: Abstract base class with no test file found.
- **UNDOCUMENTED [UNDOCUMENTED]**: Abstract base class with no JSDoc. Purpose, expected behavior contract, and usage pattern of `adjustPayout` are undocumented.

#### `DefaultStrategy` (L7–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Pass-through implementation; correctly returns result unchanged.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: Used by the critical `spin` function in engine.ts but no test file exists. Identity transform (returns result unchanged) is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The pass-through behavior of `adjustPayout` (returns result unchanged) is non-obvious from the name alone and warrants at least a one-line description.

#### `ConservativeStrategy` (L13–L20)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Math.floor on 0.8× payout is correct for slot-machine domain (house keeps fractional remainder). No stated RTP contract for this strategy, so the 0.8 multiplier is self-consistent with no violable invariant.
- **Overengineering [OVER]**: Dead code: 0 runtime and 0 type-only importers across the codebase. Premature generalization for a use case that was never wired up. Additionally, if it were ever used, the 80% payout multiplier would contradict the README's 95% RTP target.
- **Tests [NONE]**: No test file found. The 0.8 multiplier + floor truncation logic is untested, including edge cases like zero payout or fractional results.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The 0.8 multiplier (20% payout reduction) and its rationale are undocumented; this is non-obvious business logic that requires explanation.

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | All three exported symbols (SpinStrategy, DefaultStrategy, ConservativeStrategy) lack JSDoc. At minimum, SpinStrategy's abstract contract and ConservativeStrategy's 20% reduction behaviour should be documented for consumers. [L3-L20] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine domain confirmed by rng.ts, reels.ts, jackpot.ts, freespin.ts. README arbitrated intent states the engine targets 95% RTP. ConservativeStrategy applies a hard-coded 0.8 multiplier, reducing effective RTP to ~76% whenever it is the active strategy. In a regulated gambling context, any strategy that deviates from the certified RTP target must be explicitly documented and justified. No such documentation exists. [L14-L20] |

### Suggestions

- Add JSDoc to all public exports, especially ConservativeStrategy's reduction factor.
  ```typescript
  // Before
  export class ConservativeStrategy extends SpinStrategy {
    adjustPayout(result: SpinResult): SpinResult {
  // After
  /**
   * Reduces total payout by 20% (factor 0.8) to lower variance.
   * NOTE: Activating this strategy lowers effective RTP below the
   * engine's certified 95% target. Use only in non-regulated contexts
   * or after re-certification.
   */
  export class ConservativeStrategy extends SpinStrategy {
    adjustPayout(result: SpinResult): SpinResult {
  ```
- Make the reduction factor a named readonly constant to surface the RTP impact clearly.
  ```typescript
  // Before
  totalPayout: Math.floor(result.totalPayout * 0.8),
  // After
  /** Payout multiplier — brings effective RTP from 95 % to ~76 %. */
  const CONSERVATIVE_MULTIPLIER = 0.8 as const;
  // ...
  totalPayout: Math.floor(result.totalPayout * CONSERVATIVE_MULTIPLIER),
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ConservativeStrategy` is exported but unused (`ConservativeStrategy`) [L13-L20]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SpinStrategy` (`SpinStrategy`) [L3-L5]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `DefaultStrategy` (`DefaultStrategy`) [L7-L11]
