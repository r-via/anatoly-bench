# Review: `src/strategy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SpinStrategy | class | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| DefaultStrategy | class | yes | OK | LEAN | USED | UNIQUE | NONE | 88% |
| ConservativeStrategy | class | yes | OK | - | DEAD | UNIQUE | - | 90% |

### Details

#### `SpinStrategy` (L3–L5)

- **Utility [USED]**: Transitively used by DefaultStrategy
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Abstract base class with one abstract method — no logic to evaluate.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: Abstract base class — no test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Abstract base class with no explanation of the strategy pattern's purpose, when to subclass, or what contract adjustPayout must satisfy.

#### `DefaultStrategy` (L7–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Identity passthrough; correctly satisfies the abstract contract and preserves engine-computed RTP.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: Identity pass-through used by the critical `spin()` function in engine.ts, but no tests exist for this file.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Passes result through unchanged — non-obvious that this is the identity/no-op strategy. No note that it is the default used by engine.ts.

#### `ConservativeStrategy` (L13–L20)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Math.floor rounds payout down (house keeps remainder), which is correct for regulated slot-machine domain. No callers exist in the static import graph, so RTP-reduction implications are a Utility-axis concern, not a correction defect.
- **Overengineering [OVER]**: Zero importers — dead code. The single operation (multiply totalPayout by 0.8) does not warrant a strategy class. Additionally, activating this class would violate the documented 95% RTP invariant.
- **Tests [NONE]**: Payout reduction logic (0.8 multiplier + floor) is untested; no test file found.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The 0.8 multiplier (20% payout reduction) is a magic number with no rationale; the business reason for this strategy is unexplained.

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Both `adjustPayout` implementations accept `result: SpinResult` but do not mark it `Readonly<SpinResult>`. The spread in ConservativeStrategy avoids mutation in practice, but the type does not prevent future implementations from mutating the input object. SpinResult already has ReadonlyArray fields per README, but scalar fields (totalPayout, wildMultiplier, etc.) are writable. [L4,L9,L16] |
| 9 | JSDoc on public exports | WARN | MEDIUM | All three exported symbols (SpinStrategy, DefaultStrategy, ConservativeStrategy) lack JSDoc. Public API consumers and tool-tip users won't get parameter or contract documentation. [L3,L7,L13] |
| 17 | Context-adapted rules | WARN | MEDIUM | Gambling domain: ConservativeStrategy hardcodes the 0.8 payout multiplier as a magic number. In a regulated slot-machine context where RTP configurations must be auditable and adjustable per jurisdiction, this should be a constructor-injected parameter. Hardcoding makes A/B testing, jurisdiction-specific tuning, and audit tracing harder. [L17] |

### Suggestions

- Accept the payout multiplier as a constructor parameter for auditability and configurability.
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
  export class ConservativeStrategy extends SpinStrategy {
    constructor(private readonly payoutMultiplier: number = 0.8) {
      super();
    }
    adjustPayout(result: Readonly<SpinResult>): SpinResult {
      return {
        ...result,
        totalPayout: Math.floor(result.totalPayout * this.payoutMultiplier),
      };
    }
  }
  ```
- Add Readonly<SpinResult> to all adjustPayout signatures to prevent accidental mutation in future implementations.
  - Before: `abstract adjustPayout(result: SpinResult): SpinResult;`
  - After: `abstract adjustPayout(result: Readonly<SpinResult>): SpinResult;`
- Add JSDoc to all three public exports.
  ```typescript
  // Before
  export abstract class SpinStrategy {
    abstract adjustPayout(result: SpinResult): SpinResult;
  }
  // After
  /** Base strategy for post-evaluation payout adjustment. Extend to implement house-edge or promotional rules. */
  export abstract class SpinStrategy {
    /** Returns a (possibly modified) copy of `result` with adjusted totalPayout. Must not mutate the input. */
    abstract adjustPayout(result: Readonly<SpinResult>): SpinResult;
  }
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ConservativeStrategy` is exported but unused (`ConservativeStrategy`) [L13-L20]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SpinStrategy` (`SpinStrategy`) [L3-L5]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `DefaultStrategy` (`DefaultStrategy`) [L7-L11]
