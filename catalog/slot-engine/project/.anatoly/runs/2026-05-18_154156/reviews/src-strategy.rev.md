# Review: `src/strategy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SpinStrategy | class | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| DefaultStrategy | class | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| ConservativeStrategy | class | yes | OK | LEAN | DEAD | UNIQUE | - | 85% |

### Details

#### `SpinStrategy` (L3–L5)

- **Utility [USED]**: Transitively used by DefaultStrategy
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Abstract base class matches the documented interface exactly.
- **Overengineering [LEAN]**: Reference docs (03-Guides/02-Advanced-Configuration.md) explicitly document this abstract class as the public extension interface, provide a HighVolatilityStrategy example, and state consumers should subclass it. The pattern is intentional API surface, not accidental abstraction.
- **Tests [NONE]**: Abstract base class with no test file found.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Abstract base class with a single abstract method; purpose, extension contract, and usage pattern are undocumented.

#### `DefaultStrategy` (L7–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Identity pass-through; matches documented DefaultStrategy contract.
- **Overengineering [LEAN]**: Identity pass-through — the minimal required concrete implementation of SpinStrategy. One direct importer (engine.ts). No unnecessary complexity.
- **Tests [NONE]**: No test file found. Used by src/engine.ts, so untested pass-through behavior in a critical path.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Pass-through behavior of adjustPayout is not described.

#### `ConservativeStrategy` (L13–L20)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Math.floor on 80% reduction matches both the reference documentation example and the slot-machine industry convention of rounding payouts down (house keeps the remainder).
- **Overengineering [LEAN]**: 0 runtime importers, but reference docs (02-Architecture/02-Core-Concepts.md and 03-Guides/02-Advanced-Configuration.md) explicitly list it as a built-in strategy that ships with the engine. Its existence is a documented invariant, not accidental dead code.
- **Tests [NONE]**: No test file found. The 0.8 multiplier with Math.floor truncation is untested — edge cases like zero payout, fractional results, and negative values are uncovered.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The 80% totalPayout reduction semantics are not explained inline.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | All three exported symbols (SpinStrategy, DefaultStrategy, ConservativeStrategy) lack JSDoc. Public API consumers have no inline documentation for the strategy contract or the 20% payout reduction semantics. [L3-L22] |

### Suggestions

- Add JSDoc to all three public exports to document the strategy contract and the ConservativeStrategy reduction semantics.
  ```typescript
  // Before
  export abstract class SpinStrategy {
    abstract adjustPayout(result: SpinResult): SpinResult;
  }
  
  export class DefaultStrategy extends SpinStrategy { ... }
  
  export class ConservativeStrategy extends SpinStrategy { ... }
  // After
  /**
   * Base class for all payout adjustment strategies.
   * Subclasses override `adjustPayout` to post-process a `SpinResult`.
   */
  export abstract class SpinStrategy {
    /** Returns a (possibly modified) copy of `result`. Must be pure. */
    abstract adjustPayout(result: SpinResult): SpinResult;
  }
  
  /** Identity strategy — passes `SpinResult` through unmodified. */
  export class DefaultStrategy extends SpinStrategy { ... }
  
  /** Reduces `totalPayout` to 80 % of the computed value via `Math.floor`. */
  export class ConservativeStrategy extends SpinStrategy { ... }
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ConservativeStrategy` is exported but unused (`ConservativeStrategy`) [L13-L20]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
