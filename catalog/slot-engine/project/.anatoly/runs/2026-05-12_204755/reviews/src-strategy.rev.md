# Review: `src/strategy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SpinStrategy | class | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| DefaultStrategy | class | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| ConservativeStrategy | class | yes | OK | - | DEAD | UNIQUE | - | 88% |

### Details

#### `SpinStrategy` (L3–L5)

Auto-resolved: function ≤ 5 lines

#### `DefaultStrategy` (L7–L11)

Auto-resolved: function ≤ 5 lines

#### `ConservativeStrategy` (L13–L20)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Applies 0.8 multiplier and floors the result; Math.floor is correct for payout reduction (house retains remainder).
- **Overengineering [OVER]**: 0 importers. The entire behavior is a one-liner payout multiplier that could be a plain function or an inline config value. Wrapping it in a class extending an abstract base adds ceremony with no extensibility benefit.
- **Tests [NONE]**: No test file found. The 0.8 multiplier with Math.floor truncation is a business-critical calculation with no coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The 0.8 multiplier reduction and its rationale are undocumented; callers cannot discover the behavior without reading the implementation.

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Method parameters accept `SpinResult` by mutable reference. Both `adjustPayout` implementations are purely functional (return new objects), so parameters should be `readonly SpinResult`. [L8, L13] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | All three exported classes (`SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy`) lack JSDoc. Public surface area of an engine module should be documented. [L3, L7, L12] |
| 13 | Security | WARN | CRITICAL | Slot-machine domain inferred from reel/jackpot/freespin/paytable/wild vocabulary across the project. `ConservativeStrategy` computes `Math.floor(result.totalPayout * 0.8)` — floating-point multiplication on a payout value. In regulated gaming, payout arithmetic must be exact and auditable. IEEE 754 `0.8` is inexact; prefer integer arithmetic: `Math.floor(result.totalPayout * 8 / 10)` or a fixed-point approach. [L15] |

### Suggestions

- Mark input parameters readonly to enforce the purely-functional contract of both strategies.
  - Before: `adjustPayout(result: SpinResult): SpinResult`
  - After: `adjustPayout(result: Readonly<SpinResult>): SpinResult`
- Use integer arithmetic for the payout multiplier to avoid IEEE 754 rounding in regulated gaming code.
  - Before: `totalPayout: Math.floor(result.totalPayout * 0.8)`
  - After: `totalPayout: Math.floor(result.totalPayout * 8 / 10)`
- Add JSDoc to all three exported classes.
  ```typescript
  // Before
  export abstract class SpinStrategy {
  // After
  /** Base strategy for adjusting spin payouts. Extend to implement custom payout curves. */
  export abstract class SpinStrategy {
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ConservativeStrategy` is exported but unused (`ConservativeStrategy`) [L13-L20]

### Hygiene

- **[overengineering · medium · small]** Simplify: `SpinStrategy` is over-engineered `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
