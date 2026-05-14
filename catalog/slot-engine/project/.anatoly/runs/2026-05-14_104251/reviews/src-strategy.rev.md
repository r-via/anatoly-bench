# Review: `src/strategy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SpinStrategy | class | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| DefaultStrategy | class | yes | OK | LEAN | USED | UNIQUE | NONE | 88% |
| ConservativeStrategy | class | yes | OK | - | DEAD | UNIQUE | - | 87% |

### Details

#### `SpinStrategy` (L3–L5)

Auto-resolved: function ≤ 5 lines

#### `DefaultStrategy` (L7–L11)

Auto-resolved: function ≤ 5 lines

#### `ConservativeStrategy` (L13–L20)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [NEEDS_FIX]**: Two independent defects: lineWins/totalPayout inconsistency and violation of the arbitrated 95% RTP target.
- **Overengineering [OVER]**: 0 importers and the logic is a single arithmetic expression. The strategy pattern overhead (abstract base, class instantiation, polymorphic dispatch) is disproportionate to a one-liner payout adjustment. A plain function `(result: SpinResult) => ({ ...result, totalPayout: Math.floor(result.totalPayout * 0.8) })` carries the same semantics with no abstraction tax. Also note: a fixed 0.8 multiplier yields 80% RTP on this path, conflicting with the README-documented 95% RTP target — but that is a correctness concern outside this axis.
- **Tests [NONE]**: No test file found. The 0.8 multiplier with Math.floor has edge cases (zero payout, fractional results) that are completely untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The 0.8 multiplier and what 'conservative' means in this context (20% payout reduction) are not explained.

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Abstract method signature accepts `SpinResult` rather than `Readonly<SpinResult>`. In a regulated gaming codebase, input immutability should be enforced by contract so subclass overrides cannot mutate the original result in place. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | All three exported symbols (SpinStrategy, DefaultStrategy, ConservativeStrategy) lack JSDoc. In a regulated gaming engine, payout-affecting strategies must document their RTP impact for compliance review. [L3-L20] |
| 15 | Testability | WARN | MEDIUM | The 0.8 multiplier in ConservativeStrategy is hardcoded, preventing parameterised testing of boundary conditions (e.g. factor=1.0 identity, factor=0.0 zero-payout). Injecting the factor via constructor makes it testable and reusable. [L15] |
| 17 | Context-adapted rules | WARN | MEDIUM | Casino/gaming domain inferred from SpinResult, totalPayout, freeSpinsAwarded, jackpotHit vocabulary and README RTP target of 95%. ConservativeStrategy silently reduces payout by 20% via a magic constant (0.8) with no documentation of its effect on the certified RTP. Any undocumented payout multiplier is a compliance risk in a regulated gaming engine. [L13-L19] |

### Suggestions

- Enforce input immutability in the abstract contract so subclasses cannot mutate the caller's SpinResult.
  - Before: `abstract adjustPayout(result: SpinResult): SpinResult;`
  - After: `abstract adjustPayout(result: Readonly<SpinResult>): SpinResult;`
- Inject the payout factor via constructor to enable parameterised testing and document the RTP impact.
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
  /** Reduces total payout by `factor` (default 0.8 → 80% of computed payout).
   *  Note: applying factor < 1.0 lowers effective RTP below the 95% target.
   */
  export class ConservativeStrategy extends SpinStrategy {
    constructor(private readonly factor: number = 0.8) {
      super();
    }
  
    adjustPayout(result: Readonly<SpinResult>): SpinResult {
      return {
        ...result,
        totalPayout: Math.floor(result.totalPayout * this.factor),
      };
    }
  }
  ```
- Add JSDoc to all exported classes documenting their payout semantics.
  ```typescript
  // Before
  export abstract class SpinStrategy {
  // After
  /** Base strategy for post-computation payout adjustment.
   *  Implementations must preserve the 95 % RTP invariant unless deliberately overriding it.
   */
  export abstract class SpinStrategy {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** In ConservativeStrategy.adjustPayout, also scale down each LineWin's amount by 0.8 (floored) to keep lineWins consistent with the reduced totalPayout. [L14]
- **[correction · medium · small]** ConservativeStrategy's 0.8 multiplier reduces engine RTP to ~76%, contradicting the arbitrated 95% target. Either remove the strategy, raise the multiplier to 1.0, or explicitly document it as an intentional out-of-scope exception to the engine-wide RTP invariant. [L16]
- **[utility · high · trivial]** Remove dead code: `ConservativeStrategy` is exported but unused (`ConservativeStrategy`) [L13-L20]

### Hygiene

- **[overengineering · medium · small]** Simplify: `SpinStrategy` is over-engineered `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
