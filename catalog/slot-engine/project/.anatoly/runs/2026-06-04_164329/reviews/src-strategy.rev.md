# Review: `src/strategy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SpinStrategy | class | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| DefaultStrategy | class | yes | OK | LEAN | USED | UNIQUE | NONE | 88% |
| ConservativeStrategy | class | yes | OK | - | DEAD | UNIQUE | - | 90% |

### Details

#### `SpinStrategy` (L3–L5)

- **Utility [USED]**: Transitively used by DefaultStrategy
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Abstract base class correctly defines the strategy contract.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: Abstract base class with no test file found.
- **UNDOCUMENTED [UNDOCUMENTED]**: Abstract base class with no JSDoc. Purpose, usage pattern, and the contract of adjustPayout are not described.

#### `DefaultStrategy` (L7–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Identity transform on SpinResult; no correctness issues.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: No test file found. Used by src/engine.ts, so its identity transform (pass-through payout) is untested despite being on a critical path.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on class or method. The pass-through behavior of adjustPayout is non-obvious without documentation.

#### `ConservativeStrategy` (L13–L20)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Math.floor on a downward multiplier is correct for slot-machine payout rounding (house keeps the remainder). The 0.8 factor has no stated contract to violate.
- **Overengineering [OVER]**: 0 importers — dead code. Even if it were used, the logic (multiply by 0.8) is a one-liner that needs no class. Premature generalization: a second payout strategy was authored before there is any consumer or demonstrated need for runtime strategy swapping.
- **Tests [NONE]**: No test file found. The 0.8 multiplier + Math.floor truncation behavior is untested — edge cases like zero payout, fractional results, and large values all lack coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on class or method. The 0.8 multiplier and floor rounding are undocumented business logic that warrants explanation.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | The `result` parameter in both `adjustPayout` implementations is not marked `Readonly<SpinResult>`. The arbitrated README shows `SpinResult.reels` and `lineWins` as `ReadonlyArray`, but the parameter signature doesn't enforce read-only intent at the method boundary. [L8-L20] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | All three exported symbols (`SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy`) lack JSDoc. In a regulated gaming engine, documenting the RTP impact of each strategy is especially important. [L3-L20] |
| 17 | Context-adapted rules | WARN | MEDIUM | Casino/slot-machine domain inferred from project vocabulary (reels, jackpot, freeSpins, paytable, rng). `ConservativeStrategy` applies an 0.8× multiplier with no lower-bound guard: if `totalPayout` were zero or negative (malformed upstream result), the method still returns that value silently. A non-negative assertion or clamp (e.g. `Math.max(0, ...)`) would harden the payout contract. [L15-L20] |

### Suggestions

- Mark `result` parameters as `Readonly<SpinResult>` to enforce the immutability contract at the method boundary.
  - Before: `adjustPayout(result: SpinResult): SpinResult`
  - After: `adjustPayout(result: Readonly<SpinResult>): SpinResult`
- Add JSDoc to all three exported symbols, documenting RTP impact — critical in a regulated gaming context.
  ```typescript
  // Before
  export class ConservativeStrategy extends SpinStrategy {
    adjustPayout(result: SpinResult): SpinResult {
  // After
  /**
   * Reduces total payout to 80 % of the computed value.
   * NOTE: applying this strategy lowers the effective RTP below the engine's
   * stated 95 % target. Use only in contexts where a reduced RTP is intentional.
   */
  export class ConservativeStrategy extends SpinStrategy {
    adjustPayout(result: Readonly<SpinResult>): SpinResult {
  ```
- Clamp returned payout to non-negative to guard against upstream malformed results in the casino domain.
  - Before: `totalPayout: Math.floor(result.totalPayout * 0.8),`
  - After: `totalPayout: Math.max(0, Math.floor(result.totalPayout * 0.8)),`

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ConservativeStrategy` is exported but unused (`ConservativeStrategy`) [L13-L20]

### Hygiene

- **[overengineering · medium · small]** Simplify: `SpinStrategy` is over-engineered `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
