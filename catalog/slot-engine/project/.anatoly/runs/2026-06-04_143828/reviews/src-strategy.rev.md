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

- **Utility [USED]**: Transitively used by DefaultStrategy
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Abstract base class with no implementation to evaluate.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: Abstract base class with no test file found.
- **UNDOCUMENTED [UNDOCUMENTED]**: Abstract base class with no JSDoc. Purpose, intended usage pattern, and the contract of `adjustPayout` are not described.

#### `DefaultStrategy` (L7–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Identity passthrough; correctly preserves the base engine's 95% RTP.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: No test file found. Used by src/engine.ts but adjustPayout (identity passthrough) is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on the class or its `adjustPayout` override. It is non-obvious that this is a pass-through (no-op) implementation — that behavior warrants documentation.

#### `ConservativeStrategy` (L13–L20)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Moot — symbol is DEAD (was NEEDS_FIX: 0.8 multiplier on totalPayout reduces RTP to ~76%, contradicting the arbitrated 95% RTP target.)
- **Overengineering [OVER]**: 0 importers — dead code. Even if activated, reducing totalPayout by 20% drives RTP to ~76%, contradicting the documented 95% RTP target. No caller uses this, making it speculative abstraction with no current justification.
- **Tests [NONE]**: No test file found. Floor-truncated 80% payout reduction logic is untested, including boundary behavior on fractional payouts.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The 0.8 multiplier (20% reduction) and the rationale for flooring the result are undocumented; callers cannot understand the strategy's semantics without reading the implementation.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | All three exported classes (SpinStrategy, DefaultStrategy, ConservativeStrategy) lack JSDoc. At minimum, ConservativeStrategy should document the 0.8 multiplier and its RTP impact. [L4-L20] |
| 17 | Context-adapted rules (gambling domain) | WARN | MEDIUM | Gambling domain inferred from reel/spin/payout/jackpot vocabulary and project structure. ConservativeStrategy applies an unconditional 20% payout reduction (totalPayout * 0.8), which would reduce the certified 95% RTP to ~76% — contradicting the arbitrated intent ('The engine targets a theoretical Return-to-Player of 95%'). In regulated gaming, any RTP variation must be certified and all strategies must expose an identifier (e.g., a readonly `name` property) for audit-log traceability. Neither condition is met. [L13-L19] |

### Suggestions

- Add JSDoc to all three exported classes, documenting the multiplier and RTP impact for ConservativeStrategy.
  ```typescript
  // Before
  export class ConservativeStrategy extends SpinStrategy {
    adjustPayout(result: SpinResult): SpinResult {
  // After
  /**
   * Reduces every payout by 20 %. Note: applying this strategy lowers
   * the certified 95 % RTP to ~76 % and must be accompanied by a
   * separate regulatory certification before use in production.
   */
  export class ConservativeStrategy extends SpinStrategy {
    adjustPayout(result: SpinResult): SpinResult {
  ```
- Add a readonly `name` property to SpinStrategy so engine audit logs can identify which strategy processed each spin.
  ```typescript
  // Before
  export abstract class SpinStrategy {
    abstract adjustPayout(result: SpinResult): SpinResult;
  }
  // After
  export abstract class SpinStrategy {
    abstract readonly name: string;
    abstract adjustPayout(result: SpinResult): SpinResult;
  }
  
  export class DefaultStrategy extends SpinStrategy {
    readonly name = 'default' as const;
    // ...
  }
  
  export class ConservativeStrategy extends SpinStrategy {
    readonly name = 'conservative' as const;
    // ...
  }
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** ConservativeStrategy reduces totalPayout to 80% of base, pushing RTP to ~76% against the arbitrated 95% RTP target. Either remove ConservativeStrategy, gate it to non-regulated contexts only, or redesign it so it adjusts RTP within the approved 95% band (e.g. by redistributing wins rather than globally scaling down). [L16]
- **[utility · high · trivial]** Remove dead code: `ConservativeStrategy` is exported but unused (`ConservativeStrategy`) [L13-L20]

### Hygiene

- **[overengineering · medium · small]** Simplify: `SpinStrategy` is over-engineered `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
