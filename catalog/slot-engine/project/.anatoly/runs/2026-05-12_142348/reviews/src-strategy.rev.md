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

- **Utility [USED]**: Transitively used by DefaultStrategy
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Abstract base class with a single abstract method — no logic to be incorrect.
- **Overengineering [LEAN]**: Abstract extension point explicitly justified by ADR-003: new adjustment rules are added by subclassing rather than branching inside engine.ts. Zero internal importers is expected — this is a public API surface for library consumers, as shown in the docs' HighVolatilityStrategy and BonusRoundStrategy examples.
- **Tests [NONE]**: Abstract base class with no test file found.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Abstract class with non-obvious extension-point semantics (post-calculation payout adjustment) warrants documentation.

#### `DefaultStrategy` (L7–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Pass-through implementation returns result unchanged; matches documented behaviour.
- **Overengineering [LEAN]**: Minimal pass-through. ADR-003 explicitly justifies it: makes the no-adjustment case explicit rather than relying on a missing-strategy null check. One importer (engine.ts).
- **Tests [NONE]**: No test file found. Used by src/engine.ts, so its pass-through behavior is untested directly and likely untested indirectly without engine tests confirmed.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Pass-through behavior is not self-evident from the name alone; the deliberate design choice (explicit no-op vs. missing-strategy check) is undocumented.

#### `ConservativeStrategy` (L13–L20)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Spread-then-override correctly isolates totalPayout; Math.floor on 0.8× matches ADR-003 spec and is appropriate for slot-domain rounding (house keeps remainder). RTP reduction below 95% is an acknowledged, documented consequence, not a defect.
- **Overengineering [LEAN]**: Straightforward 0.8× floor reduction — four lines of logic. ADR-003 documents it as one of two built-in strategies shipped with the library. Zero internal importers is consistent with a library export rather than an internal dependency.
- **Tests [NONE]**: No test file found. The 0.8 multiplier + Math.floor truncation logic is completely untested, including edge cases like zero payout or non-integer results.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The 0.8× floor factor and its RTP impact are non-obvious business rules that require documentation.

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | FAIL | MEDIUM | All three exported symbols (`SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy`) lack JSDoc. This is a public library entry point (slot-engine) where consumer documentation is important. [L3-L20] |
| 17 | Context-adapted rules | WARN | MEDIUM | Regulated gambling/slot-machine domain inferred from vocabulary (SpinResult, totalPayout, RTP, jackpot, reels in project structure). The `0.8` multiplier in `ConservativeStrategy` is a magic number embedded in code rather than a named, configurable constant. In regulated markets, RTP parameters must be auditable and traceable; a bare numeric literal silently embedded in a class body is harder to audit than an explicitly named constant. ADR-003 (internal docs) acknowledges that this strategy 'reduces the effective RTP below the 95% target', making the auditability concern concrete. [L18] |

### Suggestions

- Add JSDoc to all three exported classes to support library consumers and generated API docs.
  ```typescript
  // Before
  export abstract class SpinStrategy {
    abstract adjustPayout(result: SpinResult): SpinResult;
  }
  // After
  /**
   * Base class for post-computation payout adjustment strategies.
   * Subclass and override {@link adjustPayout} to implement custom RTP policies.
   */
  export abstract class SpinStrategy {
    /** Returns a (possibly modified) copy of `result` with adjusted payout fields. */
    abstract adjustPayout(result: SpinResult): SpinResult;
  }
  ```
- Extract the `0.8` RTP factor in `ConservativeStrategy` to a named readonly constant for auditability in regulated gaming environments.
  ```typescript
  // Before
  totalPayout: Math.floor(result.totalPayout * 0.8),
  // After
  private static readonly PAYOUT_FACTOR = 0.8 as const;
  // ...
  totalPayout: Math.floor(result.totalPayout * ConservativeStrategy.PAYOUT_FACTOR),
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ConservativeStrategy` is exported but unused (`ConservativeStrategy`) [L13-L20]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
