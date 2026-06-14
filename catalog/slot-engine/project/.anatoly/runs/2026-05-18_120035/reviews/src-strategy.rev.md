# Review: `src/strategy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SpinStrategy | class | yes | OK | ACCEPTABLE | USED | UNIQUE | NONE | 85% |
| DefaultStrategy | class | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| ConservativeStrategy | class | yes | OK | ACCEPTABLE | DEAD | UNIQUE | - | 80% |

### Details

#### `SpinStrategy` (L3–L5)

- **Utility [USED]**: Transitively used by DefaultStrategy
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Abstract base class is correct; interface matches arbitrated contract.
- **Overengineering [ACCEPTABLE]**: Abstract class with a single abstract method where an interface would be simpler TypeScript idiom. Justified by the documented extension contract: `.anatoly/state/internal-docs/03-Guides/02-Advanced-Configuration.md` explicitly shows custom subclasses extending this abstract class and lists it as the public extension point.
- **Tests [NONE]**: Abstract base class with no test file found.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Abstract base class with non-obvious contract (strategy pattern for post-processing SpinResult) warrants at minimum a description and note on how to extend it.

#### `DefaultStrategy` (L7–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Pass-through implementation matches documented DefaultStrategy behavior exactly.
- **Overengineering [LEAN]**: Identity pass-through with 1 runtime importer (engine.ts). Minimal and appropriate as the documented default built-in strategy.
- **Tests [NONE]**: No test file found. Used by src/engine.ts but adjustPayout (identity passthrough) is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Pass-through behavior is non-obvious without documentation; a one-line description clarifying it returns result unmodified would suffice.

#### `ConservativeStrategy` (L13–L20)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Math.floor(totalPayout * 0.8) matches the reference doc verbatim; floor is correct (house keeps remainder on 20% reduction).
- **Overengineering [ACCEPTABLE]**: 0 current importers per usage analysis, but `.anatoly/state/internal-docs/02-Architecture/02-Core-Concepts.md` and the Advanced Configuration guide both explicitly list it as a shipped built-in strategy alongside DefaultStrategy. Its existence is a documented design decision, not premature generalization.
- **Tests [NONE]**: No test file found. The 0.8 multiplier + Math.floor truncation behavior is entirely untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The 80% payout reduction is a significant behavioral detail that should be documented (e.g. '@remarks Reduces totalPayout to 80% via Math.floor').

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | All three exported symbols (`SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy`) lack JSDoc comments. The behaviour is described in Advanced-Configuration.md but not inline on the symbols. [L3-L20] |

### Suggestions

- Add JSDoc to all three exported symbols so tooling surfaces documentation at call sites.
  ```typescript
  // Before
  export abstract class SpinStrategy {
    abstract adjustPayout(result: SpinResult): SpinResult;
  }
  // After
  /**
   * Base class for post-spin payout adjustment strategies.
   * Extend and implement `adjustPayout` to customise house-edge behaviour.
   */
  export abstract class SpinStrategy {
    /** Adjust the computed payout in `result` and return a new `SpinResult`. */
    abstract adjustPayout(result: SpinResult): SpinResult;
  }
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ConservativeStrategy` is exported but unused (`ConservativeStrategy`) [L13-L20]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
