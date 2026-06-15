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
- **Correction [OK]**: Abstract base class with no logic; nothing to misfire.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: Abstract base class with no test file found.
- **UNDOCUMENTED [UNDOCUMENTED]**: Abstract base class with no JSDoc. Purpose, usage pattern, and the contract of adjustPayout are undescribed.

#### `DefaultStrategy` (L7–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Identity pass-through; no mutations or type issues.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: No test file found. Used by src/engine.ts — identity pass-through behavior is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on class or method. The pass-through behavior of adjustPayout is non-obvious without a comment explaining it is the identity/no-op strategy.

#### `ConservativeStrategy` (L13–L20)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Math.floor on payout is correct for slot-machine domain (house keeps remainder); the 0.8 multiplier has no documented contract to violate, so no precision-guard-4 flag applies.
- **Overengineering [OVER]**: 0 importers — dead code. Applies a hardcoded 0.8 multiplier, which contradicts the README's stated 95% RTP target (0.8 would yield 80% RTP on affected paths). Even if it were used, this is a one-liner that does not justify a class. The strategy pattern here adds indirection with no polymorphic benefit.
- **Tests [NONE]**: No test file found. Floor-reduction logic (0.8 multiplier + Math.floor) is untested, including edge cases like zero payout or fractional results.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on class or method. The 0.8 multiplier (20% reduction) is a magic number with no explanation of its business rationale or configurability.

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | All three exported symbols (`SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy`) lack JSDoc. Public API surface of a gambling engine should document what each strategy does and its RTP impact. [L3-L20] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine domain inferred from SpinResult/jackpot/reels vocabulary and README. `ConservativeStrategy` hard-codes `0.8` with no documentation of its RTP effect. README mandates a 95% RTP target; this multiplier drives effective RTP to ~76%, a potential regulatory compliance issue. The multiplier should be a configurable, documented constructor parameter. [L13-L19] |

### Suggestions

- Extract the hard-coded multiplier into a documented, injectable readonly property so the strategy is configurable and its RTP impact is explicit.
  ```typescript
  // Before
  export class ConservativeStrategy extends SpinStrategy {
    adjustPayout(result: SpinResult): SpinResult {
      return {
        ...result,
        totalPayout: Math.floor(result.totalPayout * 0.8),
      };
    }
  }
  // After
  /**
   * Reduces totalPayout by a configurable factor.
   * Default multiplier 0.8 reduces effective RTP from 95% to ~76%.
   * Only use in non-regulated contexts or with a jurisdiction-approved multiplier.
   */
  export class ConservativeStrategy extends SpinStrategy {
    constructor(private readonly payoutMultiplier: number = 0.8) {
      super();
    }
    adjustPayout(result: SpinResult): SpinResult {
      return {
        ...result,
        totalPayout: Math.floor(result.totalPayout * this.payoutMultiplier),
      };
    }
  }
  ```
- Add JSDoc to all three public exports to document strategy intent and RTP implications.
  ```typescript
  // Before
  export abstract class SpinStrategy {
    abstract adjustPayout(result: SpinResult): SpinResult;
  }
  
  export class DefaultStrategy extends SpinStrategy { ... }
  export class ConservativeStrategy extends SpinStrategy { ... }
  // After
  /** Base strategy for post-spin payout adjustment. */
  export abstract class SpinStrategy {
    abstract adjustPayout(result: SpinResult): SpinResult;
  }
  
  /** Identity strategy — returns SpinResult unmodified. Preserves the 95% RTP target. */
  export class DefaultStrategy extends SpinStrategy { ... }
  
  /**
   * Reduces totalPayout by `payoutMultiplier` (default 0.8).
   * @param payoutMultiplier Fraction of payout to retain (0–1). Must be jurisdiction-approved.
   */
  export class ConservativeStrategy extends SpinStrategy { ... }
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ConservativeStrategy` is exported but unused (`ConservativeStrategy`) [L13-L20]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SpinStrategy` (`SpinStrategy`) [L3-L5]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `DefaultStrategy` (`DefaultStrategy`) [L7-L11]
