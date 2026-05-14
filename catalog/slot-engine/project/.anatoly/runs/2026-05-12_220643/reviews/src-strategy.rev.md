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

Auto-resolved: function ≤ 5 lines

#### `DefaultStrategy` (L7–L11)

Auto-resolved: function ≤ 5 lines

#### `ConservativeStrategy` (L13–L20)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Math.floor on payout is correct for casino domain (house retains remainder); spread preserves all other SpinResult fields correctly. RTP impact tracked as doc_divergence.
- **Overengineering [OVER]**: 0 importers — dead code. The logic itself (`Math.floor(result.totalPayout * 0.8)`) is a one-liner that needs no class. Additionally, a 20% payout reduction directly contradicts the README-stated 95% RTP target, making this abstraction both unused and semantically inconsistent with the documented design.
- **Tests [NONE]**: No test file found. The 0.8 multiplier with Math.floor has edge cases (zero payout, fractional results, negative values) that are entirely untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The 0.8 multiplier and floor rounding are non-obvious business rules that require documentation explaining the 20% payout reduction and rationale.

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | All three exported symbols (SpinStrategy, DefaultStrategy, ConservativeStrategy) lack JSDoc. For a gambling engine, documenting the intended RTP impact of each strategy is especially important. [L3-L20] |
| 17 | Context-adapted rules | WARN | MEDIUM | Regulated gambling domain inferred from project vocabulary (rng.ts, jackpot.ts, paytable.ts, freespin.ts). ConservativeStrategy hard-codes the magic number 0.8 with no parameter, comment, or configurability. In a certifiable gambling engine, payout multipliers must be auditable and configurable, not baked in as unnamed literals. [L15] |

### Suggestions

- Make the Conservative multiplier a constructor parameter so it is auditable and configurable for compliance.
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
  /** Reduces totalPayout by a configurable factor. Note: multipliers below 1.0 reduce effective RTP below the 95% target. */
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
- Add JSDoc to all public exports, noting RTP implications.
  ```typescript
  // Before
  export abstract class SpinStrategy {
    abstract adjustPayout(result: SpinResult): SpinResult;
  }
  // After
  /** Base class for all payout-adjustment strategies. Implementations must preserve or reduce totalPayout; they must not increase it above the engine-calculated value. */
  export abstract class SpinStrategy {
    abstract adjustPayout(result: SpinResult): SpinResult;
  }
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ConservativeStrategy` is exported but unused (`ConservativeStrategy`) [L13-L20]

### Hygiene

- **[overengineering · medium · small]** Simplify: `SpinStrategy` is over-engineered `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
