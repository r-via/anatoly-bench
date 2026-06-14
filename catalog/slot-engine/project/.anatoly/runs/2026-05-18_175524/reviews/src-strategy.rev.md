# Review: `src/strategy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SpinStrategy | class | yes | OK | ACCEPTABLE | USED | UNIQUE | NONE | 88% |
| DefaultStrategy | class | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| ConservativeStrategy | class | yes | OK | LEAN | DEAD | UNIQUE | - | 90% |

### Details

#### `SpinStrategy` (L3–L5)

- **Utility [USED]**: Transitively used by DefaultStrategy
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Abstract base class matches reference docs and arbitrated interface contract exactly.
- **Overengineering [ACCEPTABLE]**: Abstract class with a single abstract method could be replaced by a plain function type or interface, but the reference docs explicitly document this as the public extension point (ADR-005, `.anatoly/state/internal-docs/03-Guides/02-Advanced-Configuration.md`). Subclassing is the documented contract for custom strategies, so the abstract-class pattern is justified.
- **Tests [NONE]**: Abstract base class with no test file. No tests verify the interface contract.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Abstract base class with non-obvious contract (strategy pattern for post-processing SpinResult) warrants at minimum a class-level description and a note on the expected behavior of adjustPayout.

#### `DefaultStrategy` (L7–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Identity pass-through matches documented and arbitrated behavior.
- **Overengineering [LEAN]**: Trivial identity pass-through, one importer (engine.ts). No unnecessary complexity.
- **Tests [NONE]**: No test file exists. DefaultStrategy is imported by src/engine.ts (critical path), but adjustPayout — which is an identity function — has no direct tests verifying it returns the result unchanged across varying SpinResult shapes.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Pass-through identity behavior is not obvious from the name alone; a one-liner clarifying it applies no adjustment would suffice.

#### `ConservativeStrategy` (L13–L20)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Math.floor on 80% reduction matches reference doc verbatim and is correct for slot-machine domain (house retains remainder on reduction).
- **Overengineering [LEAN]**: Single arithmetic operation on a spread copy. Implementation is minimal; complexity is appropriate for documented 20% payout reduction behavior.
- **Tests [NONE]**: No test file exists. The 0.8 multiplier + Math.floor behavior (rounding, zero payout, large values) is entirely untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The 80% payout reduction and floor rounding are non-trivial behaviors that require documentation; neither is inferrable from the class name.

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `adjustPayout(result: SpinResult)` should use `Readonly<SpinResult>` to signal the parameter is not mutated. `DefaultStrategy` returns it directly; marking input as `Readonly<>` makes the contract explicit and prevents accidental mutation in future subclasses. [L4,L8,L14] |
| 9 | JSDoc on public exports | WARN | MEDIUM | All three exported symbols (`SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy`) lack JSDoc. They are public API entry points referenced extensively in the advanced-configuration guide. [L3,L7,L13] |

### Suggestions

- Mark `adjustPayout` parameter as `Readonly<SpinResult>` across all three classes to make the non-mutation contract explicit and prevent accidental mutation in future subclasses.
  - Before: `abstract adjustPayout(result: SpinResult): SpinResult;`
  - After: `abstract adjustPayout(result: Readonly<SpinResult>): SpinResult;`
- Add JSDoc to all three exported classes to match the public-API documentation already present in the advanced-configuration guide.
  ```typescript
  // Before
  export abstract class SpinStrategy {
    abstract adjustPayout(result: SpinResult): SpinResult;
  }
  // After
  /**
   * Base class for post-spin payout adjustment strategies.
   * Extend this class to implement custom house-edge or volatility behaviour.
   */
  export abstract class SpinStrategy {
    /** Transforms a raw SpinResult; must return a new object, not mutate the input. */
    abstract adjustPayout(result: Readonly<SpinResult>): SpinResult;
  }
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ConservativeStrategy` is exported but unused (`ConservativeStrategy`) [L13-L20]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
