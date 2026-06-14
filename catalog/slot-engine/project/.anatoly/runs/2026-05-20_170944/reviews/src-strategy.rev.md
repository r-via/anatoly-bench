# Review: `src/strategy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SpinStrategy | class | yes | OK | ACCEPTABLE | USED | UNIQUE | NONE | 85% |
| DefaultStrategy | class | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| ConservativeStrategy | class | yes | OK | - | DEAD | UNIQUE | - | 88% |

### Details

#### `SpinStrategy` (L3–L5)

- **Utility [USED]**: Transitively used by DefaultStrategy
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Abstract base with no logic; nothing to mis-implement.
- **Overengineering [ACCEPTABLE]**: Abstract class with one abstract method adds indirection a plain function type could avoid, but reference docs (Code-Conventions.md) explicitly validate this as the intended extension point for custom post-processing strategies.
- **Tests [NONE]**: Abstract base class with no test file found.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The abstract class and its `adjustPayout` contract — purpose, expected input/output semantics, and extension guide — are entirely undocumented.

#### `DefaultStrategy` (L7–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Pure identity pass-through; no mutation, no logic branches.
- **Overengineering [LEAN]**: Identity pass-through required to satisfy the abstract base contract; the engine needs a concrete default. Body is one line.
- **Tests [NONE]**: No test file found. Used by src/engine.ts but adjustPayout (identity pass-through) is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The identity-passthrough behavior of `adjustPayout` is not documented; callers cannot know this is a no-op without reading the implementation.

#### `ConservativeStrategy` (L13–L20)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Math.floor(totalPayout * 0.8) is correct for casino domain: rounding down retains the remainder for the house, consistent with slot-machine payout conventions and matches the documented behavior exactly.
- **Overengineering [OVER]**: 0 importers per usage analysis — dead code. Hardcodes a 0.8 multiplier that would push RTP well below the 95% target stated in README, yet is never wired into the engine. Ships complexity with no active consumer.
- **Tests [NONE]**: No test file found. The 0.8 multiplier with Math.floor truncation is untested — edge cases like fractional payouts and zero payout are uncovered.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The 0.8 multiplier and `Math.floor` truncation are implementation details that carry meaningful behavioral semantics and warrant documentation.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | The abstract method and overrides accept `SpinResult` rather than `Readonly<SpinResult>`. `SpinResult.totalPayout` is a mutable number field, so the signature permits callers (or subclass authors) to mutate the input. The convention example in `.anatoly/docs/` explicitly uses `ReadonlyArray` on method params. [L4-L5] |

### Suggestions

- Mark method parameters as Readonly<SpinResult> to prevent accidental mutation in future subclass implementations, consistent with the project's ReadonlyArray convention.
  - Before: `abstract adjustPayout(result: SpinResult): SpinResult;`
  - After: `abstract adjustPayout(result: Readonly<SpinResult>): SpinResult;`

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ConservativeStrategy` is exported but unused (`ConservativeStrategy`) [L13-L20]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
- **[overengineering · medium · small]** Simplify: `ConservativeStrategy` is over-engineered (`ConservativeStrategy`) [L13-L20]
