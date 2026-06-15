# Review: `src/strategy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SpinStrategy | class | yes | OK | LEAN | USED | UNIQUE | NONE | 80% |
| DefaultStrategy | class | yes | OK | ACCEPTABLE | USED | UNIQUE | NONE | 85% |
| ConservativeStrategy | class | yes | OK | - | DEAD | UNIQUE | - | 85% |

### Details

#### `SpinStrategy` (L3–L5)

Auto-resolved: function ≤ 5 lines

#### `DefaultStrategy` (L7–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Identity pass-through; matches documented behavior and the engine's default spin path.
- **Overengineering [ACCEPTABLE]**: Identity pass-through is the simplest concrete form of the base class contract. Engine instantiates it on every spin(), so it carries real runtime purpose despite being trivial.
- **Tests [NONE]**: No test file found. Used by src/engine.ts — pass-through identity behavior is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Identity behavior (pass-through) is not obvious from the class name alone and is undocumented.

#### `ConservativeStrategy` (L13–L20)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Math.floor(totalPayout * 0.8) is correct: rounds down (house keeps remainder), matches documented 80%-reduction contract, and integer inputs multiplied by the IEEE-754 representation of 0.8 produce values slightly above the exact multiple, so Math.floor cannot truncate a value that should have been higher.
- **Overengineering [OVER]**: 0 importers — dead code. The 80% floor is a one-liner that requires no class. Premature abstraction with no active consumer.
- **Tests [NONE]**: No test file found. 0.8 payout multiplier with floor truncation is untested — edge cases like fractional payouts and zero values are unverified.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The 0.8 multiplier and Math.floor truncation are non-trivial payout semantics that warrant documentation but have none.

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Method signatures accept SpinResult but should accept Readonly<SpinResult> to signal and enforce non-mutation of the input. In a regulated gambling payout path, this is an important correctness guard. [L8-L19] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine domain. ConservativeStrategy silently lowers effective RTP from the engine's declared 95% to ~76% (0.95 × 0.80). Internal docs confirm DefaultStrategy is used at runtime, but the strategy is exported as a public API with no JSDoc warning that activating it violates the stated RTP contract. In a regulated gambling context, callers selecting ConservativeStrategy could unknowingly produce non-compliant payout rates. [L14-L20] |

### Suggestions

- Use Readonly<SpinResult> for input parameters to enforce non-mutation in the gambling payout path
  - Before: `adjustPayout(result: SpinResult): SpinResult {`
  - After: `adjustPayout(result: Readonly<SpinResult>): SpinResult {`
- Add an inline comment on ConservativeStrategy warning that its use breaks the declared 95% RTP contract
  ```typescript
  // Before
  export class ConservativeStrategy extends SpinStrategy {
  // After
  /** WARNING: Reduces effective RTP below the engine's declared 95% target. Not compliant for default spin path. */
  export class ConservativeStrategy extends SpinStrategy {
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ConservativeStrategy` is exported but unused (`ConservativeStrategy`) [L13-L20]

### Hygiene

- **[overengineering · medium · small]** Simplify: `ConservativeStrategy` is over-engineered (`ConservativeStrategy`) [L13-L20]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
