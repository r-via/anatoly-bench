# Review: `src/strategy.ts`

**Verdict:** NEEDS_REFACTOR

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
- **Correction [OK]**: Pass-through implementation; no correctness issues.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [-]**: *(not evaluated)*

#### `ConservativeStrategy` (L13–L20)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Applies 0.8 multiplier and floors the result; rounding direction is correct (floor, not ceiling or round) for a slot-domain payout reduction.
- **Overengineering [OVER]**: Zero importers — dead code. Also wraps a one-line `Math.floor(x * 0.8)` in a class hierarchy. Even if consumed, this is premature generalization of a trivial scalar multiplication.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | The `result` parameter in both `adjustPayout` overrides could be typed `Readonly<SpinResult>` to make the no-mutation contract explicit to callers and the compiler. [L9-L19] |
| 9 | JSDoc on public exports | WARN | MEDIUM | All three exported symbols lack JSDoc. `ConservativeStrategy` is non-self-describing: callers cannot infer the 0.8 multiplier, what 'conservative' means in monetary terms, or the rounding direction from the name alone. [L4-L20] |
| 17 | Context-adapted rules | WARN | MEDIUM | Casino/slot domain inferred from file path and SpinResult type. The magic number 0.8 in ConservativeStrategy is a domain-sensitive constant (payout multiplier) and should be a named constant or constructor parameter to make the bet-return ratio auditable and configurable without touching the logic. [L17] |

### Suggestions

- Strengthen the adjustPayout signature with Readonly to communicate the no-mutation contract
  - Before: `adjustPayout(result: SpinResult): SpinResult`
  - After: `adjustPayout(result: Readonly<SpinResult>): SpinResult`
- Replace the magic 0.8 multiplier with a named constant or constructor-injected parameter for auditability
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
  /** Fraction of the raw payout the conservative strategy retains (e.g. 0.8 = 80%). */
  const CONSERVATIVE_PAYOUT_RATIO = 0.8;
  
  /**
   * Reduces payout to {@link CONSERVATIVE_PAYOUT_RATIO} of the raw value,
   * floored to the nearest whole credit.
   */
  export class ConservativeStrategy extends SpinStrategy {
    constructor(private readonly ratio: number = CONSERVATIVE_PAYOUT_RATIO) {
      super();
    }
    adjustPayout(result: Readonly<SpinResult>): SpinResult {
      return {
        ...result,
        totalPayout: Math.floor(result.totalPayout * this.ratio),
      };
    }
  }
  ```
- Add JSDoc to the abstract base so consumers understand the extension contract
  ```typescript
  // Before
  export abstract class SpinStrategy {
    abstract adjustPayout(result: SpinResult): SpinResult;
  }
  // After
  /**
   * Base strategy for post-evaluation payout adjustment.
   * Implementations must return a new SpinResult without mutating the input.
   */
  export abstract class SpinStrategy {
    /** Returns a (possibly modified) copy of `result` with the adjusted payout. */
    abstract adjustPayout(result: Readonly<SpinResult>): SpinResult;
  }
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ConservativeStrategy` is exported but unused (`ConservativeStrategy`) [L13-L20]
