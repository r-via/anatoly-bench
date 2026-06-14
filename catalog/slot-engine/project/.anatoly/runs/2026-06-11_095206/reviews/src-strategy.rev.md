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
- **Correction [OK]**: Abstract base class with no implementation logic; no correctness defects.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: Abstract base class with no test file found.
- **UNDOCUMENTED [UNDOCUMENTED]**: Abstract base class with no JSDoc. Purpose, intended use, and the contract of `adjustPayout` are not described.

#### `DefaultStrategy` (L7–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Pass-through identity implementation is correct; no mutation, no logic error.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: No test file exists. Used by src/engine.ts, making untested identity-passthrough behavior a risk for downstream engine tests.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. It is not clear that this is a passthrough/identity strategy — the name alone does not convey that payouts are returned unchanged.

#### `ConservativeStrategy` (L13–L20)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Math.floor on totalPayout * 0.8 is mechanically correct; floor rounding is the right direction for the house in regulated gaming (rule 11). The 20% reduction is the strategy's stated intent, not a logic error. No importers exist (Utility axis concern, not correction). Applying rule 12: if this strategy replaced DefaultStrategy in the engine, implied RTP = 95% × 0.8 = 76%, which would violate the arbitrated 95% target — but that defect would belong to whichever call site wires this strategy into the engine, not to this class's own computation.
- **Overengineering [OVER]**: 0 importers — dead code. The logic is a single-line 0.8× multiplier that doesn't warrant a named class, let alone participation in a class hierarchy. If needed at all, this is a one-liner callback or a named constant, not a subclass.
- **Tests [NONE]**: No test file exists. The 0.8 multiplier with Math.floor has edge cases (zero payout, fractional rounding) that are entirely uncovered.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The 0.8 multiplier (20% reduction) and the floor truncation are undocumented behavioral details that belong in a comment.

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | All three exported symbols (SpinStrategy, DefaultStrategy, ConservativeStrategy) lack JSDoc. Especially important for ConservativeStrategy: callers need to understand the 0.8× RTP impact without reading the implementation. [L3-L20] |
| 13 | Security | WARN | MEDIUM | Slot-machine/casino domain inferred from reels.ts, jackpot.ts, freespin.ts, paytable.ts, rng.ts and README's RTP/house-edge language. `Math.floor(result.totalPayout * 0.8)` uses a non-exactly-representable IEEE-754 float (0.8 = 0.7999999…) before flooring. For low integer payouts (e.g. 1–4 coins) this is deterministic, but for large jackpot values near 2^53 the multiplication can lose precision before `Math.floor` corrects it. Prefer integer-safe arithmetic: `Math.floor(result.totalPayout * 8 / 10)`. [L18] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine/casino domain: ConservativeStrategy silently reduces all payouts by 20% (multiplier 0.8). The README certifies a 95% RTP; applying this strategy yields ~76% actual RTP (0.95 × 0.8). In regulated markets, every active payout variant must be disclosed and certified independently. There is no documentation, no guard against accidental production use, and no strategy discriminant that auditors could use to verify which certified configuration is active. [L14-L19] |

### Suggestions

- Add JSDoc to all exported symbols, especially documenting the RTP impact of ConservativeStrategy.
  ```typescript
  // Before
  export class ConservativeStrategy extends SpinStrategy {
    adjustPayout(result: SpinResult): SpinResult {
  // After
  /**
   * Reduces all payouts by 20%. Intended for testing / demo only.
   * WARNING: lowers effective RTP from ~95% to ~76%. Do NOT use in
   * certified production builds without separate regulatory approval.
   */
  export class ConservativeStrategy extends SpinStrategy {
    adjustPayout(result: SpinResult): SpinResult {
  ```
- Use integer-safe arithmetic to avoid IEEE-754 precision loss on the payout multiplier.
  - Before: `totalPayout: Math.floor(result.totalPayout * 0.8),`
  - After: `totalPayout: Math.floor(result.totalPayout * 8 / 10),`
- Add a readonly discriminant to each strategy so certified vs non-certified variants can be identified at runtime by auditing code.
  ```typescript
  // Before
  export abstract class SpinStrategy {
    abstract adjustPayout(result: SpinResult): SpinResult;
  }
  // After
  export abstract class SpinStrategy {
    abstract readonly id: string;
    abstract adjustPayout(result: SpinResult): SpinResult;
  }
  
  export class DefaultStrategy extends SpinStrategy {
    readonly id = 'default' as const;
    ...
  }
  
  export class ConservativeStrategy extends SpinStrategy {
    readonly id = 'conservative' as const;
    ...
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ConservativeStrategy` is exported but unused (`ConservativeStrategy`) [L13-L20]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SpinStrategy` (`SpinStrategy`) [L3-L5]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `DefaultStrategy` (`DefaultStrategy`) [L7-L11]
