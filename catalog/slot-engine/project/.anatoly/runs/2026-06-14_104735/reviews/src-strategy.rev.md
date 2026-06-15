# Review: `src/strategy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SpinStrategy | class | yes | OK | LEAN | USED | UNIQUE | NONE | 87% |
| DefaultStrategy | class | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| ConservativeStrategy | class | yes | OK | - | DEAD | UNIQUE | - | 88% |

### Details

#### `SpinStrategy` (L3–L5)

- **Utility [USED]**: Transitively used by DefaultStrategy
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Abstract base class with a single abstract method; no logic to evaluate.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: Abstract class with no test file. No tests exist for any subclass or the abstract contract.
- **UNDOCUMENTED [UNDOCUMENTED]**: Abstract base class has no JSDoc. Purpose, extension contract, and expected behavior of adjustPayout are undocumented.

#### `DefaultStrategy` (L7–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Identity pass-through; correctly satisfies the SpinStrategy contract.
- **Overengineering [LEAN]**: Identity implementation with a single return statement. The over-engineering is in the abstract base, not here.
- **Tests [NONE]**: No test file found. DefaultStrategy is consumed by spin() in engine.ts but its identity-passthrough behavior is untested in isolation.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on class or method. adjustPayout passes result through unchanged — that identity behavior is non-obvious and worth documenting.

#### `ConservativeStrategy` (L13–L20)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Math.floor on a reduced payout is the correct rounding direction for slot-machine payouts (house keeps the remainder). The 0.8 multiplier is self-consistent with the 'conservative' semantics. The spread correctly copies all SpinResult fields while overriding totalPayout.
- **Overengineering [OVER]**: Zero importers across the codebase — dead code written in anticipation of a use case that never materialized. The single-line 0.8 multiplier logic does not justify a named strategy class.
- **Tests [NONE]**: No test file found. The 0.8x payout reduction and Math.floor behavior are untested, including edge cases like zero or fractional totalPayout values.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on class or method. The 0.8 multiplier and floor truncation are meaningful business rules with no explanation.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | FAIL | MEDIUM | All three exported symbols (`SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy`) lack JSDoc. At minimum, the abstract base and the payout-reduction logic in `ConservativeStrategy` warrant documentation. [L3-L20] |

### Suggestions

- Add JSDoc to all three public exports to meet documentation standards and aid consumers.
  ```typescript
  // Before
  export abstract class SpinStrategy {
    abstract adjustPayout(result: SpinResult): SpinResult;
  }
  // After
  /**
   * Base contract for payout adjustment strategies.
   * Implement this to customise house-edge behaviour per session or game mode.
   */
  export abstract class SpinStrategy {
    /** Transforms a raw spin result, returning a (possibly adjusted) copy. */
    abstract adjustPayout(result: SpinResult): SpinResult;
  }
  ```
- Document the 0.8 coefficient in `ConservativeStrategy` so future maintainers understand its effect on RTP relative to the documented 95% target.
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
   * Reduces totalPayout to 80 % of the engine's raw value.
   * NOTE: this pushes effective RTP below the documented 95 % target; use only
   * where intentionally tighter house margins are acceptable (e.g. bonus-abuse mitigation).
   */
  export class ConservativeStrategy extends SpinStrategy {
    adjustPayout(result: SpinResult): SpinResult {
      return {
        ...result,
        totalPayout: Math.floor(result.totalPayout * 0.8),
      };
    }
  }
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ConservativeStrategy` is exported but unused (`ConservativeStrategy`) [L13-L20]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SpinStrategy` (`SpinStrategy`) [L3-L5]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `DefaultStrategy` (`DefaultStrategy`) [L7-L11]
