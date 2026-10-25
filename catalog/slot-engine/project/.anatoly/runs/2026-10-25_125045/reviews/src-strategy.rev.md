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
- **Correction [OK]**: Abstract base class with single abstract method — correct TypeScript, no logic defects.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [-]**: *(not evaluated)*

#### `DefaultStrategy` (L7–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Identity pass-through; spreads nothing, returns result unchanged — no defects.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [-]**: *(not evaluated)*

#### `ConservativeStrategy` (L13–L20)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Math.floor on a 0.8-multiplied payout rounds DOWN, which is the correct direction for slot-machine payout adjustments (house keeps the remainder). Spread preserves all other SpinResult fields. No defects.
- **Overengineering [OVER]**: Zero importers — dead code. Even if wired up, a named function `conservativeStrategy = (r) => ({...r, totalPayout: Math.floor(r.totalPayout * 0.8)})` carries the same semantics without the class boilerplate.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | All three exported symbols (SpinStrategy, DefaultStrategy, ConservativeStrategy) lack JSDoc. As public API consumed by engine.ts, at minimum SpinStrategy's contract and the intent of ConservativeStrategy's 0.8 multiplier should be documented. [L3-L20] |

### Suggestions

- Add JSDoc to all three exported symbols so consumers and tools understand the strategy contract and the rationale for the 80% multiplier.
  ```typescript
  // Before
  export abstract class SpinStrategy {
    abstract adjustPayout(result: SpinResult): SpinResult;
  }
  // After
  /**
   * Base class for all payout-adjustment strategies.
   * Implement adjustPayout to transform a raw SpinResult before it is returned to the caller.
   */
  export abstract class SpinStrategy {
    /** Returns a (possibly modified) copy of result with an adjusted totalPayout. */
    abstract adjustPayout(result: SpinResult): SpinResult;
  }
  ```
- Document the 0.8 multiplier's intent in ConservativeStrategy so future maintainers know whether it is a hard-coded house-edge cap or a configurable parameter.
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
   * Reduces the raw payout to 80 % of its face value.
   * Useful for capping high-volatility sessions without touching the base paytable.
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
