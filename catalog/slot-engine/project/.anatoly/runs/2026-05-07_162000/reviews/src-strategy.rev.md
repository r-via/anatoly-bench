# Review: `src/strategy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SpinStrategy | class | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| DefaultStrategy | class | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| ConservativeStrategy | class | yes | OK | ACCEPTABLE | DEAD | UNIQUE | - | 85% |

### Details

#### `SpinStrategy` (L3–L5)

- **Utility [USED]**: Transitively used by DefaultStrategy
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Abstract base class with a single abstract method; no logic to evaluate.
- **Overengineering [LEAN]**: Abstract extension point explicitly justified by ADR-003 (.anatoly/docs/02-Architecture/04-Design-Decisions.md): new adjustment rules are added by subclassing rather than branching in engine.ts. The single abstract method is the minimal contract needed.
- **Tests [NONE]**: Abstract base class with no test file found.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Abstract base class with a single abstract method — purpose, extension contract, and intended usage pattern are undocumented.

#### `DefaultStrategy` (L7–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Pass-through implementation matches documented behavior exactly.
- **Overengineering [LEAN]**: Pass-through implementation. ADR-003 justifies its existence: makes the no-adjustment case explicit instead of relying on a missing-strategy null check. 1 importer, zero waste.
- **Tests [NONE]**: No test file found. Used by src/engine.ts, making untested pass-through behavior a coverage gap for the engine's payout logic.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Pass-through behavior is non-obvious from the name alone; the fact that it returns the result unchanged warrants at least a one-line doc.

#### `ConservativeStrategy` (L13–L20)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Math.floor(totalPayout * 0.8) matches all three doc pages (ADR-003, 03-Configuration, 02-Advanced-Configuration) and correctly rounds down (house keeps remainder) per casino-domain conventions.
- **Overengineering [ACCEPTABLE]**: 0 importers per usage analysis, but documented as a shipped concrete strategy in ADR-003 and the configuration guide (.anatoly/docs/01-Getting-Started/03-Configuration.md). Shipping two concrete implementations alongside an extension point is the documented intent; the 0-importer count reflects current consumers, not the library's public surface.
- **Tests [NONE]**: No test file found. The 0.8 multiplier with Math.floor has edge cases (zero payout, fractional results, large values) that are entirely untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The 0.8× floor factor and its RTP implications are not documented inline; callers cannot discover this behavior without reading the implementation.

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Magic literal 0.8 in ConservativeStrategy should be a private static readonly constant, making the multiplier explicit and preventing accidental mutation if the class is extended. [L17] |
| 9 | JSDoc on public exports | WARN | MEDIUM | SpinStrategy, DefaultStrategy, and ConservativeStrategy are all exported with no JSDoc. Public API surface warrants at minimum a one-line description plus @param/@returns on adjustPayout. [L3-L20] |
| 13 | Security | WARN | HIGH | Slot-machine/regulated-gaming domain inferred from SpinResult, totalPayout, and RTP references in .anatoly/docs/. `result.totalPayout * 0.8` uses IEEE-754 floating-point on a payout value; 0.8 is not exactly representable. Math.floor partially mitigates this, but regulated RTP accounting requires exact integer arithmetic (e.g., `Math.floor(result.totalPayout * 4 / 5)`) to guarantee certifiable precision across all credit values. [L17] |

### Suggestions

- Extract the 0.8 multiplier into a named readonly constant for clarity and regulated-gaming auditability.
  ```typescript
  // Before
  adjustPayout(result: SpinResult): SpinResult {
    return {
      ...result,
      totalPayout: Math.floor(result.totalPayout * 0.8),
    };
  }
  // After
  private static readonly PAYOUT_MULTIPLIER_NUMERATOR = 4;
  private static readonly PAYOUT_MULTIPLIER_DENOMINATOR = 5;
  
  adjustPayout(result: SpinResult): SpinResult {
    return {
      ...result,
      totalPayout: Math.floor(
        (result.totalPayout * ConservativeStrategy.PAYOUT_MULTIPLIER_NUMERATOR) /
        ConservativeStrategy.PAYOUT_MULTIPLIER_DENOMINATOR
      ),
    };
  }
  ```
- Add JSDoc to public exports so tooling and API consumers get inline documentation.
  ```typescript
  // Before
  export abstract class SpinStrategy {
    abstract adjustPayout(result: SpinResult): SpinResult;
  }
  // After
  /**
   * Extension point for post-computation payout adjustment.
   * Implement {@link adjustPayout} to transform a fully-computed {@link SpinResult}
   * before it is returned to the caller.
   */
  export abstract class SpinStrategy {
    /**
     * Returns a (potentially modified) copy of `result`.
     * Implementations must not mutate the input object.
     */
    abstract adjustPayout(result: SpinResult): SpinResult;
  }
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ConservativeStrategy` is exported but unused (`ConservativeStrategy`) [L13-L20]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
