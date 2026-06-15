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
- **Correction [OK]**: Abstract base class with single abstract method; no implementation to contain bugs.
- **Overengineering [ACCEPTABLE]**: Abstract class where a TypeScript `interface` or function type `(result: SpinResult) => SpinResult` would suffice — abstract classes create runtime artifacts and block multiple inheritance. However, `.anatoly/state/internal-docs/03-Guides/02-Advanced-Configuration.md` explicitly prescribes this exact `abstract class` form as the public extension API with a documented custom-strategy example, making the extra complexity intentional.
- **Tests [NONE]**: Abstract base class with no test file. No tests verify the contract or polymorphic behavior.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Abstract base class with a non-obvious strategy pattern contract — purpose, extension semantics, and the adjustPayout lifecycle are undocumented.

#### `DefaultStrategy` (L7–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Identity pass-through; matches documented and arbitrated contract.
- **Overengineering [LEAN]**: Minimal null-object implementation: one method, one line, returns input unchanged. Required as the concrete default for the documented strategy substitution pattern.
- **Tests [NONE]**: No test file exists. DefaultStrategy is used by src/engine.ts, making untested pass-through behavior a coverage gap in a critical path.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Pass-through identity behavior is not self-evident from the name alone; missing explanation of when/why to use this vs other strategies.

#### `ConservativeStrategy` (L13–L20)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Math.floor(totalPayout * 0.8) matches reference docs exactly; spread preserves all other SpinResult fields; house-down rounding is correct for slot domain.
- **Overengineering [LEAN]**: Six lines of straightforward math (spread + floor + multiply). Documented as a shipped built-in strategy in Advanced-Configuration.md and Core-Concepts.md. Zero runtime importers but it is part of the public library surface, not dead internal code.
- **Tests [NONE]**: No test file exists. The 0.8 multiplier with Math.floor has edge cases (zero payout, fractional results, large values) that are entirely untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The 0.8 multiplier and Math.floor rounding behavior are meaningful business rules that warrant documentation; neither is explained inline or via JSDoc.

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | The `result` parameter in `adjustPayout` is mutated-by-convention (spread into a new object), but the signature accepts a mutable `SpinResult`. Typing it as `Readonly<SpinResult>` enforces the non-mutation contract at the call site. [L8,L13] |
| 9 | JSDoc on public exports | WARN | MEDIUM | All three exported symbols (`SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy`) lack JSDoc. Given this is a public library (slot-engine), consumers need documentation on the strategy contract and the 20% reduction semantics of `ConservativeStrategy`. [L3,L7,L13] |
| 17 | Context-adapted rules | WARN | MEDIUM | Regulated gambling domain (95% RTP target per arbitrated intent in README.md). `ConservativeStrategy` reduces totalPayout to 80%, which lowers the effective RTP to ~76% when substituted. This is a legitimate optional override but carries regulatory risk if applied in production without RTP re-certification. No in-code warning or JSDoc caution guards against misuse. [L13-L20] |

### Suggestions

- Add JSDoc to all three exported classes, especially documenting the 20% reduction on ConservativeStrategy and the RTP implications.
  ```typescript
  // Before
  export abstract class SpinStrategy {
    abstract adjustPayout(result: SpinResult): SpinResult;
  }
  // After
  /**
   * Base strategy for post-processing a SpinResult.
   * Extend this class to implement custom payout adjustments.
   */
  export abstract class SpinStrategy {
    abstract adjustPayout(result: SpinResult): SpinResult;
  }
  ```
- Use `Readonly<SpinResult>` on the parameter to enforce the non-mutation contract at call sites.
  - Before: `adjustPayout(result: SpinResult): SpinResult`
  - After: `adjustPayout(result: Readonly<SpinResult>): SpinResult`

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ConservativeStrategy` is exported but unused (`ConservativeStrategy`) [L13-L20]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
