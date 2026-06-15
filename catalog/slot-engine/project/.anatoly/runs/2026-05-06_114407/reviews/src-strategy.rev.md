# Review: `src/strategy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SpinStrategy | class | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| DefaultStrategy | class | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| ConservativeStrategy | class | yes | OK | LEAN | DEAD | UNIQUE | - | 90% |

### Details

#### `SpinStrategy` (L3–L5)

- **Utility [USED]**: Transitively used via DefaultStrategy (which is imported elsewhere)
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Abstract base class is correct; no logic to evaluate.
- **Overengineering [LEAN]**: Abstract base class justified by ADR-003: strategy pattern decouples payout adjustment from engine core, enabling new strategies via subclassing. Documented design decision overrides the single-importer signal.
- **Tests [NONE]**: Abstract base class with no test file found.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Abstract base class with non-obvious extension contract (post-calculation payout adjustment hook) deserves at minimum a purpose description and note that subclasses must implement adjustPayout.

#### `DefaultStrategy` (L7–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Pass-through implementation matches documented ADR-003 behaviour exactly.
- **Overengineering [LEAN]**: Pass-through implementation makes the no-adjustment case explicit rather than a null-check, per ADR-003. One importer is expected and documented.
- **Tests [NONE]**: No test file found. Used by src/engine.ts, but adjustPayout identity behavior is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Pass-through behavior is not self-evident from the name alone; a one-line doc clarifying it returns the result unchanged would prevent misuse.

#### `ConservativeStrategy` (L13–L20)

- **Utility [DEAD]**: Exported symbol with 0 importers across the codebase. No consumers found.
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: 0.8× factor with Math.floor matches ADR-003 spec exactly; floor rounds down (house keeps remainder), consistent with casino industry convention.
- **Overengineering [LEAN]**: 0.8× floor adjustment is a concrete, documented business rule (ADR-003). Zero current importers is noted but the strategy ships as a library variant for market-specific deployment, which is the stated rationale.
- **Tests [NONE]**: No test file found. The 0.8 multiplier + floor truncation logic has no coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The 0.8× multiplier and Math.floor truncation are business-critical details that directly affect RTP; callers cannot discover the factor without reading the implementation.

## Best Practices — 7.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | The `0.8` payout factor in ConservativeStrategy is an inline literal. Extracting it as `private readonly PAYOUT_FACTOR = 0.8 as const` makes the constant immutable and auditable. [L17] |
| 8 | ESLint compliance | WARN | HIGH | Magic number `0.8` on L17 violates `no-magic-numbers`. A named constant eliminates the lint warning and improves readability. [L17] |
| 9 | JSDoc on public exports | WARN | MEDIUM | All three exported symbols (`SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy`) lack JSDoc. The ADR documents their behaviour but inline doc is absent. [L3-L20] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine domain inferred from SpinResult/SpinStrategy vocabulary and confirmed by ADR-003 (RTP targets, regulated markets). In regulated gambling, every payout multiplier must be a named, auditable constant — the bare `0.8` literal is a compliance-readability risk even though the ADR documents it. ADR-003 also notes ConservativeStrategy drops effective RTP below the 95% target; callers need a runtime guard or warning, not just a prose note. [L17] |

### Suggestions

- Extract the `0.8` payout factor into a named readonly constant to satisfy no-magic-numbers, immutability, and gambling-domain audit requirements.
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
    private readonly PAYOUT_FACTOR = 0.8 as const;
  
    adjustPayout(result: SpinResult): SpinResult {
      return {
        ...result,
        totalPayout: Math.floor(result.totalPayout * this.PAYOUT_FACTOR),
      };
    }
  }
  ```
- Add JSDoc to all three public exports so consumers and audit tooling have inline documentation.
  ```typescript
  // Before
  export abstract class SpinStrategy {
    abstract adjustPayout(result: SpinResult): SpinResult;
  }
  // After
  /**
   * Base class for post-calculation payout adjustment strategies.
   * Subclass and inject via `EngineContainer` to customise payout policy.
   */
  export abstract class SpinStrategy {
    /** Returns an adjusted copy of `result`; must not mutate the input. */
    abstract adjustPayout(result: SpinResult): SpinResult;
  }
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ConservativeStrategy` is exported but unused (`ConservativeStrategy`) [L13-L20]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
