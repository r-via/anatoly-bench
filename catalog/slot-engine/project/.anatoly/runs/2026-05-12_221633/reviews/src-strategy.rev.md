# Review: `src/strategy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SpinStrategy | class | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| DefaultStrategy | class | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| ConservativeStrategy | class | yes | OK | - | DEAD | UNIQUE | - | 72% |

### Details

#### `SpinStrategy` (L3–L5)

Auto-resolved: function ≤ 5 lines

#### `DefaultStrategy` (L7–L11)

Auto-resolved: function ≤ 5 lines

#### `ConservativeStrategy` (L13–L20)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [NEEDS_FIX]**: 0.8 multiplier reduces effective RTP from ~95% to ~76%, violating the arbitrated 95% RTP invariant.
- **Overengineering [OVER]**: 0 importers — dead code. The logic itself (multiply totalPayout by 0.8) is a one-liner that needs no class. The README mandates a 95% RTP target with no mention of a conservative mode, so this abstraction has no documented use case.
- **Tests [NONE]**: No test file found. The 0.8 payout multiplier with Math.floor has meaningful edge cases (fractional results, zero payout, large values) that are entirely untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The 0.8 multiplier (20% payout reduction) is a significant behavioral detail that warrants documentation.

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | The `result` parameter in both `adjustPayout` overrides is typed as `SpinResult`, not `Readonly<SpinResult>`. The abstract signature should enforce read-only input to prevent accidental mutation by future subclasses. [L4, L8, L14] |
| 8 | ESLint compliance | WARN | HIGH | The literal `0.8` on L17 is a bare magic number that would trigger `no-magic-numbers` in any standard ESLint config. In a gambling codebase this is especially problematic because the value directly controls payout ratio without a named, auditable constant. [L17] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | All three exported symbols (`SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy`) lack JSDoc. `ConservativeStrategy` is particularly under-documented — it silently alters RTP without any comment explaining the multiplier, its regulatory intent, or the resulting certified RTP. [L3, L7, L13] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | The `0.8` multiplier should be a named `private static readonly` constant (or extracted to a config) and typed with `satisfies` or `as const`. This also aids auditability in a regulated context. [L17] |
| 17 | Context-adapted rules | WARN | MEDIUM | Gambling/slot-machine domain inferred from `SpinResult`, `totalPayout`, `reels`, `jackpot` vocabulary across the project. `ConservativeStrategy` hardcodes a 0.8 payout multiplier with no documentation of the resulting certified RTP (~76% effective if base engine is 95%). In regulated jurisdictions, every RTP variant must be independently documented and certified. The absence of any annotation makes this strategy non-auditable. [L13-L20] |

### Suggestions

- Extract the magic multiplier as a named typed constant and mark the parameter readonly
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
  /** Certified RTP for this strategy: 76 % (base 95 % × MULTIPLIER). */
  export class ConservativeStrategy extends SpinStrategy {
    private static readonly PAYOUT_MULTIPLIER = 0.8 as const;
  
    adjustPayout(result: Readonly<SpinResult>): SpinResult {
      return {
        ...result,
        totalPayout: Math.floor(result.totalPayout * ConservativeStrategy.PAYOUT_MULTIPLIER),
      };
    }
  }
  ```
- Add JSDoc to the abstract base class and its concrete implementations
  ```typescript
  // Before
  export abstract class SpinStrategy {
    abstract adjustPayout(result: SpinResult): SpinResult;
  }
  // After
  /**
   * Base strategy for post-calculation payout adjustment.
   * All implementations must be deterministic and produce a certified RTP.
   */
  export abstract class SpinStrategy {
    /**
     * Adjusts the raw payout from the spin engine.
     * @param result - Immutable result produced by the spin engine.
     * @returns A new SpinResult with the adjusted totalPayout.
     */
    abstract adjustPayout(result: Readonly<SpinResult>): SpinResult;
  }
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** ConservativeStrategy.adjustPayout multiplies totalPayout by 0.8, reducing RTP to ~76%. If this strategy must preserve the 95% RTP contract, the multiplier must be removed or the base payouts must be pre-scaled so that post-multiplier RTP still approximates 95% (i.e. base payouts targeting ~118.75% before the 0.8 reduction). If ConservativeStrategy is intentionally a lower-RTP mode, the README invariant must be scoped to DefaultStrategy only. [L17]

### Refactors

- **[utility · medium · trivial]** Remove dead code: `ConservativeStrategy` is exported but unused (`ConservativeStrategy`) [L13-L20]

### Hygiene

- **[overengineering · medium · small]** Simplify: `SpinStrategy` is over-engineered `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
