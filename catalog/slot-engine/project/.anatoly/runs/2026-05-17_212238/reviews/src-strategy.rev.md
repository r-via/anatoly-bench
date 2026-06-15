# Review: `src/strategy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SpinStrategy | class | yes | OK | ACCEPTABLE | USED | UNIQUE | NONE | 85% |
| DefaultStrategy | class | yes | OK | ACCEPTABLE | USED | UNIQUE | NONE | 85% |
| ConservativeStrategy | class | yes | OK | LEAN | DEAD | UNIQUE | - | 90% |

### Details

#### `SpinStrategy` (L3–L5)

- **Utility [USED]**: Transitively used by DefaultStrategy
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Abstract base class correctly defines the adjustPayout contract; matches arbitrated interface.
- **Overengineering [ACCEPTABLE]**: Abstract class with a single abstract method could be a TypeScript interface, which would be lighter and equally extensible. However, the reference docs (Advanced-Configuration.md) explicitly define this as the public contract for custom strategy extension (ADR-005), and an abstract class allows future shared behavior. Justified by documented design decision.
- **Tests [NONE]**: Abstract base class with no test file found.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Abstract base class with non-obvious contract (strategy pattern for post-processing SpinResult) deserves at minimum a description of purpose and extension requirements.

#### `DefaultStrategy` (L7–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Identity pass-through; matches documented DefaultStrategy behavior.
- **Overengineering [ACCEPTABLE]**: A class whose sole behavior is returning its argument unchanged exists only to satisfy the abstract class contract. If strategy were an optional function, this class would be unnecessary. However, the reference docs designate it the built-in default and engine.ts depends on it directly — the pattern is deliberate per ADR-005.
- **Tests [NONE]**: No test file found. Used by src/engine.ts, but adjustPayout (identity passthrough) is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Pass-through identity behavior is not obvious from the class name alone; a one-line doc noting it returns the result unmodified would suffice.

#### `ConservativeStrategy` (L13–L20)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Math.floor(totalPayout * 0.8) matches the reference doc verbatim; rounding down is correct for casino domain (house retains remainder).
- **Overengineering [LEAN]**: Concrete implementation with meaningful behavior (Math.floor(totalPayout * 0.8)). Explicitly documented as one of two strategies that ship with the engine (Advanced-Configuration.md). 0 importers reflects it being a public API option rather than dead code.
- **Tests [NONE]**: No test file found. The 0.8 multiplier + Math.floor truncation logic is untested — edge cases like fractional payouts and zero values are unverified.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The 80% payout reduction is a non-trivial behavioral detail that should be documented inline rather than left implicit in the implementation.

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | adjustPayout parameter result is typed as SpinResult rather than Readonly<SpinResult>. ConservativeStrategy spreads result (non-mutating), but the abstract signature doesn't enforce that subclasses must not mutate the argument. [L4-L5] |
| 9 | JSDoc on public exports | WARN | MEDIUM | SpinStrategy, DefaultStrategy, and ConservativeStrategy are all public exports with no JSDoc. A one-liner per class describing intent and the 80%-reduction behaviour of ConservativeStrategy would satisfy this. [L3-L20] |

### Suggestions

- Mark the adjustPayout parameter Readonly to signal and enforce non-mutation in subclasses.
  - Before: `abstract adjustPayout(result: SpinResult): SpinResult;`
  - After: `abstract adjustPayout(result: Readonly<SpinResult>): SpinResult;`
- Add JSDoc to all three exported classes.
  ```typescript
  // Before
  export abstract class SpinStrategy {
    abstract adjustPayout(result: SpinResult): SpinResult;
  }
  // After
  /**
   * Base strategy for post-processing a SpinResult payout.
   * Extend this class and implement adjustPayout to alter totalPayout before it is returned.
   */
  export abstract class SpinStrategy {
    abstract adjustPayout(result: Readonly<SpinResult>): SpinResult;
  }
  
  /** Identity strategy — passes SpinResult through unmodified. */
  export class DefaultStrategy extends SpinStrategy { ... }
  
  /** Reduces totalPayout to 80 % of the computed value (floors to nearest integer coin). */
  export class ConservativeStrategy extends SpinStrategy { ... }
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ConservativeStrategy` is exported but unused (`ConservativeStrategy`) [L13-L20]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
