# Review: `src/strategy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SpinStrategy | class | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| DefaultStrategy | class | yes | OK | LEAN | USED | UNIQUE | NONE | 85% |
| ConservativeStrategy | class | yes | OK | - | DEAD | UNIQUE | - | 90% |

### Details

#### `SpinStrategy` (L3–L5)

Auto-resolved: function ≤ 5 lines

#### `DefaultStrategy` (L7–L11)

Auto-resolved: function ≤ 5 lines

#### `ConservativeStrategy` (L13–L20)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Math.floor on payout is the correct rounding direction for casino payouts (house retains the remainder); spread-then-override pattern correctly preserves all other SpinResult fields.
- **Overengineering [OVER]**: 0 importers — dead code. Applies a hardcoded 0.8× multiplier which would reduce RTP well below the 95% target documented in README.md, suggesting it was never integrated intentionally. Premature generalization for a use case that never materialized.
- **Tests [NONE]**: No test file found. The 0.8 multiplier with Math.floor truncation is a business-rule edge case (e.g. fractional payout rounding) that is entirely untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The 0.8 multiplier reduction and floor rounding applied to `totalPayout` are meaningful business rules that should be documented.

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Both `adjustPayout` implementations accept `result: SpinResult` but never mutate it. Annotating the parameter as `Readonly<SpinResult>` encodes this intent and prevents accidental mutation in future subclasses. [L9,L15] |
| 9 | JSDoc on public exports | WARN | MEDIUM | All three exported symbols (`SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy`) and the abstract `adjustPayout` method lack JSDoc. Callers cannot understand the payout contract from IDE hover. [L3,L8,L14] |
| 17 | Context-adapted rules | WARN | MEDIUM | Casino domain (slot engine with RTP target of 95% per README). `Math.floor(result.totalPayout * 0.8)` in `ConservativeStrategy` introduces two concerns: (1) the 0.8 multiplier reduces effective RTP to ~76%, potentially violating regulatory certification if this strategy is ever used as the production default; (2) `Math.floor` on every payout creates a systematic house-favorable rounding bias. The hardcoded `0.8` should be a configurable parameter rather than a magic literal. [L16-L18] |

### Suggestions

- Mark input parameter as Readonly to encode non-mutation contract
  - Before: `abstract adjustPayout(result: SpinResult): SpinResult;`
  - After: `abstract adjustPayout(result: Readonly<SpinResult>): SpinResult;`
- Replace magic literal with a constructor-injected multiplier to avoid silent RTP violations
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
- Add JSDoc to public exports
  ```typescript
  // Before
  export abstract class SpinStrategy {
    abstract adjustPayout(result: SpinResult): SpinResult;
  }
  // After
  /**
   * Base strategy for post-calculation payout adjustment.
   * Concrete subclasses must not mutate the incoming SpinResult.
   */
  export abstract class SpinStrategy {
    /** Returns a new SpinResult with any house-edge adjustments applied. */
    abstract adjustPayout(result: Readonly<SpinResult>): SpinResult;
  }
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ConservativeStrategy` is exported but unused (`ConservativeStrategy`) [L13-L20]

### Hygiene

- **[overengineering · medium · small]** Simplify: `SpinStrategy` is over-engineered `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
