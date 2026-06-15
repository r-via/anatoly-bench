# Review: `src/strategy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SpinStrategy | class | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| DefaultStrategy | class | yes | OK | LEAN | USED | UNIQUE | NONE | 88% |
| ConservativeStrategy | class | yes | OK | - | DEAD | UNIQUE | - | 85% |

### Details

#### `SpinStrategy` (L3–L5)

- **Utility [USED]**: Transitively used by DefaultStrategy
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Abstract base with a single abstract method; no logic to evaluate.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: Abstract base class with no test file found.
- **UNDOCUMENTED [UNDOCUMENTED]**: Abstract base class with no JSDoc. Purpose, contract, and intended extension points are not described.

#### `DefaultStrategy` (L7–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Pass-through implementation; correctly returns the unmodified SpinResult.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: No test file found. Used by the critical `spin` function in engine.ts — identity pass-through behavior is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on class or method. `adjustPayout` returns the result unchanged — that passthrough behavior is non-obvious and warrants documentation.

#### `ConservativeStrategy` (L13–L20)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Math.floor on the 0.8-scaled payout is correct for a slot-machine domain (house keeps the remainder; rounding down is the industry-standard convention). The floating-point intermediate (e.g. 3 * 0.8 = 2.4000…) is harmless because Math.floor is applied before the value is returned, yielding an integer. The lineWins array is left unmodified, but without a stated invariant that totalPayout must equal sum(lineWins), and with no live callers of this class, no correctness defect is established.
- **Overengineering [OVER]**: 0 importers — dead code. Even if used, a two-line payout scaling (`Math.floor(p * 0.8)`) does not warrant a named class and inheritance. A plain function or a configurable multiplier parameter on the engine would be sufficient.
- **Tests [NONE]**: No test file found. The 0.8 payout multiplier with floor rounding is untested, including edge cases like zero payout or fractional results.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on class or method. The 0.8 multiplier and floor rounding are undocumented design choices that callers cannot discover without reading the implementation.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | All three exported symbols (`SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy`) lack JSDoc. The abstract base and concrete strategies are non-trivial public API surfaces — callers need to understand payout-adjustment semantics without reading the implementation. [L3-L20] |

### Suggestions

- Add JSDoc to all three exported classes so callers understand payout-adjustment contracts without reading the implementation.
  ```typescript
  // Before
  export abstract class SpinStrategy {
    abstract adjustPayout(result: SpinResult): SpinResult;
  }
  // After
  /**
   * Base strategy for post-evaluation payout adjustment.
   * Subclass to implement custom house-edge or bonus modifiers.
   */
  export abstract class SpinStrategy {
    /** Returns a (potentially modified) copy of `result`. Must not mutate the argument. */
    abstract adjustPayout(result: SpinResult): SpinResult;
  }
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ConservativeStrategy` is exported but unused (`ConservativeStrategy`) [L13-L20]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SpinStrategy` (`SpinStrategy`) [L3-L5]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `DefaultStrategy` (`DefaultStrategy`) [L7-L11]
