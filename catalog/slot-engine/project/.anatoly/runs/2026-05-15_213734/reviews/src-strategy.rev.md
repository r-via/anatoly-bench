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
- **Correction [OK]**: Abstract base class correctly defines the strategy contract.
- **Overengineering [ACCEPTABLE]**: Abstract class over a simple `(result: SpinResult) => SpinResult` function type adds class-hierarchy overhead, but the reference docs (Advanced-Configuration.md) explicitly prescribe this interface as the public extension point (ADR-005), show a third-party custom strategy example, and validate two concrete implementations. The complexity is justified by the documented library API contract.
- **Tests [NONE]**: Abstract base class with no test file. No tests verify the contract or subclass behavior.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Abstract base class with a single abstract method — purpose, extension contract, and intended usage pattern are undocumented.

#### `DefaultStrategy` (L7–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Pass-through implementation matches documented identity behavior.
- **Overengineering [LEAN]**: Identity pass-through; minimal and correct for its documented role as the engine's default strategy.
- **Tests [NONE]**: No test file found. Used by src/engine.ts, making this a critical path — identity passthrough behavior is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Pass-through behavior is not obvious from the name alone; a brief doc explaining the identity transform and its role as the default engine strategy is absent.

#### `ConservativeStrategy` (L13–L20)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: 20% reduction via Math.floor matches the authoritative reference doc exactly; floor rounding is correct for casino domain (house retains remainder).
- **Overengineering [LEAN]**: Single arithmetic operation on `totalPayout`. Zero runtime importers per usage analysis, but explicitly documented in Advanced-Configuration.md as a shipped built-in option for library consumers.
- **Tests [NONE]**: No test file found. The 0.8 payout multiplier and Math.floor truncation are untested — both edge cases (zero payout, fractional results) and the core reduction logic lack coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The 80% payout reduction is a non-trivial behavior that warrants documentation; the magic constant 0.8 and the use of Math.floor are undocumented.

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Both `adjustPayout` parameters accept `SpinResult` without `Readonly<SpinResult>`. The spread-return pattern signals non-mutation intent, but the signature does not enforce it. [L7-L20] |
| 9 | JSDoc on public exports | WARN | MEDIUM | All three exported symbols (`SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy`) lack JSDoc. At minimum, the abstract base and the 80%-reduction behaviour of `ConservativeStrategy` warrant documentation. [L3-L20] |
| 13 | Security | WARN | MEDIUM | Slot-machine / regulated-gaming domain inferred from SpinResult, jackpotHit, totalPayout vocabulary and reference docs. `Math.floor(result.totalPayout * 0.8)` applies floating-point multiplication to a coin-integer quantity. IEEE 754 represents 0.8 imprecisely; for most bounded integer inputs Math.floor compensates, but integer arithmetic (`Math.floor(result.totalPayout * 8 / 10)`) is the certifiably-safe form for regulated gaming payouts. [L17] |

### Suggestions

- Mark `result` parameter as `Readonly<SpinResult>` to enforce non-mutation at the type level.
  - Before: `adjustPayout(result: SpinResult): SpinResult`
  - After: `adjustPayout(result: Readonly<SpinResult>): SpinResult`
- Use integer arithmetic for the 80% payout reduction to avoid IEEE 754 imprecision in a regulated gaming context.
  - Before: `totalPayout: Math.floor(result.totalPayout * 0.8)`
  - After: `totalPayout: Math.floor(result.totalPayout * 8 / 10)`
- Add JSDoc to all three public exports.
  ```typescript
  // Before
  export abstract class SpinStrategy {
    abstract adjustPayout(result: SpinResult): SpinResult;
  }
  // After
  /**
   * Base strategy for post-processing a SpinResult payout.
   * Extend this class and implement `adjustPayout` to customise payout behaviour.
   */
  export abstract class SpinStrategy {
    /** Returns a (potentially modified) copy of `result`. Must not mutate the argument. */
    abstract adjustPayout(result: Readonly<SpinResult>): SpinResult;
  }
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ConservativeStrategy` is exported but unused (`ConservativeStrategy`) [L13-L20]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
