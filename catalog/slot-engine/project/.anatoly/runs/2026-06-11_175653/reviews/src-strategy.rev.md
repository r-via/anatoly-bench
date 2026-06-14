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
- **Correction [OK]**: Abstract base class — no logic to evaluate.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: Abstract base class with no test file found.
- **UNDOCUMENTED [UNDOCUMENTED]**: Abstract base class with no JSDoc. Purpose, contract, and intended extension points are undocumented.

#### `DefaultStrategy` (L7–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Identity pass-through; no mutations or logic errors.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: No test file exists. Used by the critical `spin` function in engine.ts — pass-through payout behavior is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on class or method. The pass-through behavior (no payout adjustment) is non-obvious from the name alone and warrants documentation.

#### `ConservativeStrategy` (L13–L20)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Math.floor on totalPayout * 0.8 is correct for a casino domain: 0.8 multiplier reduces payout, floor rounds down so the house retains the remainder — consistent with industry convention. The LineWin interface is not shown, so whether lineWins should also be scaled cannot be determined from the given context; abstaining per rule 16.
- **Overengineering [OVER]**: 0 importers — dead code. The 20% payout reduction is a single `Math.floor(x * 0.8)` expression that needs no class or Strategy pattern. If a tunable house-edge multiplier is ever needed, a plain parameter on the engine call suffices.
- **Tests [NONE]**: No test file exists. The 0.8 multiplier with floor truncation has no coverage for edge cases (zero payout, fractional results, large values).
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on class or method. The 80% payout reduction factor is a magic number with no documented rationale.

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | All three exported symbols (SpinStrategy, DefaultStrategy, ConservativeStrategy) lack JSDoc. Consumers need to know what the 0.8 multiplier in ConservativeStrategy means in terms of RTP impact, at minimum. [L4-L20] |
| 17 | Context-adapted rules | WARN | MEDIUM | Gambling domain (regulated): ConservativeStrategy silently applies a 0.8 payout multiplier with no documentation of its RTP impact. README mandates a 95% RTP target; strategies that override payout without declaring their adjusted RTP risk violating the certified game math. At minimum, the multiplier and its RTP effect must be documented. [L13-L20] |

### Suggestions

- Add JSDoc to all three public exports, documenting the RTP contract for ConservativeStrategy in particular.
  ```typescript
  // Before
  export class ConservativeStrategy extends SpinStrategy {
    adjustPayout(result: SpinResult): SpinResult {
  // After
  /**
   * Reduces all payouts to 80% of computed value, yielding a lower effective RTP.
   * NOTE: Applying this strategy drops the theoretical RTP below the certified 95% target.
   * Only use in non-regulated or explicitly approved contexts.
   */
  export class ConservativeStrategy extends SpinStrategy {
    adjustPayout(result: SpinResult): SpinResult {
  ```
- Add JSDoc to the abstract base and DefaultStrategy for discoverability.
  ```typescript
  // Before
  export abstract class SpinStrategy {
    abstract adjustPayout(result: SpinResult): SpinResult;
  }
  
  export class DefaultStrategy extends SpinStrategy {
  // After
  /** Base class for payout adjustment strategies. Implement adjustPayout to modify a SpinResult before it is returned to the caller. */
  export abstract class SpinStrategy {
    abstract adjustPayout(result: SpinResult): SpinResult;
  }
  
  /** Identity strategy: returns the SpinResult unmodified, preserving the certified 95% RTP. */
  export class DefaultStrategy extends SpinStrategy {
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ConservativeStrategy` is exported but unused (`ConservativeStrategy`) [L13-L20]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SpinStrategy` (`SpinStrategy`) [L3-L5]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `DefaultStrategy` (`DefaultStrategy`) [L7-L11]
