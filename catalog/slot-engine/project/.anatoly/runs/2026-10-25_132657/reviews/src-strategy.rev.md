# Review: `src/strategy.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SpinStrategy | class | yes | OK | LEAN | USED | UNIQUE | - | 88% |
| DefaultStrategy | class | yes | OK | LEAN | USED | UNIQUE | - | 85% |
| ConservativeStrategy | class | yes | OK | - | DEAD | UNIQUE | - | 90% |

### Details

#### `SpinStrategy` (L3–L5)

- **Utility [USED]**: Transitively used by DefaultStrategy
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Abstract base class with no logic; no correctness issues.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [-]**: *(not evaluated)*

#### `DefaultStrategy` (L7–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Pass-through adjustPayout returns result unchanged; correct.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [-]**: *(not evaluated)*

#### `ConservativeStrategy` (L13–L20)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Math.floor on totalPayout * 0.8 is correct rounding-down behavior for a payout reduction; no logic errors.
- **Overengineering [OVER]**: Zero importers — dead code. Even if consumed, it wraps a single arithmetic expression (`Math.floor(x * 0.8)`) in a class with inheritance overhead; a plain function would suffice.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | FAIL | MEDIUM | All three public exports (SpinStrategy, DefaultStrategy, ConservativeStrategy) lack JSDoc. Threshold for FAIL is 3+. [L3-L20] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-engine domain inferred from project name and payline/reel vocabulary in sibling files. ConservativeStrategy applies floating-point multiplication (totalPayout * 0.8) to a payout value before flooring. A single in-memory terminal rounding is not a critical safety issue, but in regulated gaming contexts integer arithmetic or a Decimal library is preferred to avoid representation drift across strategy chains. [L18] |

### Suggestions

- Add JSDoc to all three public exports
  ```typescript
  // Before
  export abstract class SpinStrategy {
    abstract adjustPayout(result: SpinResult): SpinResult;
  }
  // After
  /** Base strategy for post-spin payout adjustment. Extend to implement custom payout policies. */
  export abstract class SpinStrategy {
    /** Adjusts the payout of a completed spin result. */
    abstract adjustPayout(result: SpinResult): SpinResult;
  }
  ```
- Use integer arithmetic for payout scaling in regulated gaming context
  - Before: `totalPayout: Math.floor(result.totalPayout * 0.8),`
  - After: `totalPayout: Math.floor((result.totalPayout * 8) / 10),`

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ConservativeStrategy` is exported but unused (`ConservativeStrategy`) [L13-L20]
