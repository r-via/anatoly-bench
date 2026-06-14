# Review: `src/strategy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SpinStrategy | class | yes | OK | ACCEPTABLE | USED | UNIQUE | NONE | 85% |
| DefaultStrategy | class | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| ConservativeStrategy | class | yes | OK | LEAN | DEAD | UNIQUE | - | 90% |

### Details

#### `SpinStrategy` (L3–L5)

- **Utility [USED]**: Transitively used by DefaultStrategy
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Abstract interface matches arbitrated contract and reference docs exactly.
- **Overengineering [ACCEPTABLE]**: Abstract class with a single abstract method and no shared state or implementation — a TypeScript interface would be more idiomatic and sufficient. However, `.anatoly/state/internal-docs/03-Guides/02-Advanced-Configuration.md` explicitly documents this as the public extension interface and the custom-strategy example requires extending it, so the extra ceremony is a deliberate API choice rather than accidental complexity.
- **Tests [NONE]**: Abstract base class with no test file found.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Abstract base class with non-obvious contract (strategy pattern, post-processes SpinResult) warrants documentation.

#### `DefaultStrategy` (L7–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Pass-through implementation matches documented identity behavior.
- **Overengineering [LEAN]**: Identity pass-through; minimal and matches documented behavior exactly.
- **Tests [NONE]**: No test file found. Used by src/engine.ts, making untested pass-through behavior a coverage gap in a critical path.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Pass-through identity behavior is not obvious from the name alone; a one-liner describing the no-op contract would suffice.

#### `ConservativeStrategy` (L13–L20)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Math.floor(totalPayout * 0.8) matches reference doc verbatim; rounding down is correct for house-edge direction.
- **Overengineering [LEAN]**: Single arithmetic reduction (80%), documented built-in strategy. No unnecessary abstraction within the class itself.
- **Tests [NONE]**: No test file found. The 0.8 multiplier with Math.floor truncation has edge cases (e.g. fractional payouts, zero) that are entirely untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The 80% payout reduction is a non-trivial business rule invisible from the class name; requires documentation.

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | The `result` parameter in all three `adjustPayout` signatures is typed as `SpinResult` rather than `Readonly<SpinResult>`. Since the methods never mutate the parameter, marking it readonly communicates intent and prevents accidental mutation in future subclasses. [L4, L8, L13] |
| 9 | JSDoc on public exports | WARN | MEDIUM | All three exported symbols (`SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy`) lack JSDoc. At minimum `SpinStrategy` and `ConservativeStrategy` warrant documentation explaining the 80% reduction and its RTP impact in a regulated gambling context. [L3, L7, L12] |

### Suggestions

- Mark the `result` parameter as `Readonly<SpinResult>` in all three `adjustPayout` signatures to enforce immutability as a contract for future subclasses.
  - Before: `abstract adjustPayout(result: SpinResult): SpinResult;`
  - After: `abstract adjustPayout(result: Readonly<SpinResult>): SpinResult;`
- Add JSDoc to public exports, especially `SpinStrategy` (contract) and `ConservativeStrategy` (explains the 80% reduction and RTP impact).
  ```typescript
  // Before
  export abstract class SpinStrategy {
    abstract adjustPayout(result: SpinResult): SpinResult;
  }
  // After
  /**
   * Base class for post-spin payout adjustment strategies.
   * Extend this class to customise totalPayout before it is returned to the caller.
   */
  export abstract class SpinStrategy {
    /** Adjust `result.totalPayout` and return the modified result. Must be a pure function. */
    abstract adjustPayout(result: Readonly<SpinResult>): SpinResult;
  }
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ConservativeStrategy` is exported but unused (`ConservativeStrategy`) [L13-L20]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
