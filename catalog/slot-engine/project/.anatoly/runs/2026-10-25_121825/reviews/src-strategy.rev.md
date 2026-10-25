# Review: `src/strategy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SpinStrategy | class | yes | OK | LEAN | USED | UNIQUE | - | 90% |
| DefaultStrategy | class | yes | OK | LEAN | USED | UNIQUE | - | 88% |
| ConservativeStrategy | class | yes | OK | - | DEAD | UNIQUE | - | 90% |

### Details

#### `SpinStrategy` (L3–L5)

- **Utility [USED]**: Transitively used by DefaultStrategy
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Abstract base class with no implementation — no correctness issues.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [-]**: *(not evaluated)*

#### `DefaultStrategy` (L7–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Pass-through adjustPayout returns result unchanged — correct.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [-]**: *(not evaluated)*

#### `ConservativeStrategy` (L13–L20)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Math.floor on totalPayout applies 80% reduction with correct downward rounding — no correctness issues. No live consumers found (Utility axis concern only).
- **Overengineering [OVER]**: 0 importers anywhere in the codebase — dead code. The logic itself (one multiplication) is trivial and does not justify a named class. If needed, it could be an inline config multiplier rather than a concrete strategy subclass.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | All three exported symbols (SpinStrategy, DefaultStrategy, ConservativeStrategy) lack JSDoc. Public API surface should document the purpose of each strategy and the contract of adjustPayout. [L3-L20] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine domain inferred from project structure (rng.ts, jackpot.ts, paytable.ts, reels.ts). The 0.8 multiplier in ConservativeStrategy is a hardcoded magic constant. In a regulated gambling context, payout adjustment factors must be configurable, auditable, and traceable — embedding them as literals makes them invisible to compliance tooling. [L18] |

### Suggestions

- Replace the magic 0.8 multiplier with a named, configurable parameter to support auditing and compliance in a regulated gambling context.
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
  /** Applies a configurable multiplier to payout, floored to the nearest integer. */
  export class ConservativeStrategy extends SpinStrategy {
    constructor(private readonly multiplier: number = 0.8) {
      super();
    }
  
    adjustPayout(result: SpinResult): SpinResult {
      return {
        ...result,
        totalPayout: Math.floor(result.totalPayout * this.multiplier),
      };
    }
  }
  ```
- Add JSDoc to all three public exports to document the Strategy contract.
  ```typescript
  // Before
  export abstract class SpinStrategy {
    abstract adjustPayout(result: SpinResult): SpinResult;
  }
  // After
  /**
   * Base strategy for post-spin payout adjustment.
   * Implementations may scale, cap, or transform the raw payout.
   */
  export abstract class SpinStrategy {
    /** Returns a (potentially modified) copy of the spin result with adjusted payout. */
    abstract adjustPayout(result: SpinResult): SpinResult;
  }
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ConservativeStrategy` is exported but unused (`ConservativeStrategy`) [L13-L20]
