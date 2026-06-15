# Review: `src/strategy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SpinStrategy | class | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| DefaultStrategy | class | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| ConservativeStrategy | class | yes | OK | ACCEPTABLE | USED | UNIQUE | NONE | 85% |

### Details

#### `SpinStrategy` (L3–L5)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Abstract base class with no logic; nothing to evaluate.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: Abstract base class with no test file. Used by src/engine.ts as a polymorphic dependency.
- **UNDOCUMENTED [UNDOCUMENTED]**: Abstract base class with no JSDoc. Purpose, intended usage pattern, and the contract of adjustPayout are not described.

#### `DefaultStrategy` (L7–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Pass-through with no mutations; correct.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: No test file. adjustPayout is an identity function but edge cases (zero payout, negative payout) are untested. Used in src/engine.ts.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on class or method. The pass-through behavior of adjustPayout (returns result unchanged) is non-obvious and warrants documentation.

#### `ConservativeStrategy` (L13–L20)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Math.floor on a 0.8× payout is correct for integer-coin domain (house keeps remainder per slot-engine convention); spread preserves all other SpinResult fields.
- **Overengineering [ACCEPTABLE]**: The transformation logic (floor 80% payout) is simple and correctly expressed. The class wrapper is forced by the SpinStrategy hierarchy rather than being this symbol's own choice. If the hierarchy were replaced with a function type, this would collapse to a one-liner arrow function — fine either way.
- **Tests [NONE]**: No test file. adjustPayout applies Math.floor(0.8x) — rounding and truncation behavior (e.g. fractional payouts, zero, large values) are entirely untested. Used in src/engine.ts.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on class or method. The 0.8 multiplier and floor operation are magic values with no explanation of their rationale or effect.

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | All three exported symbols (SpinStrategy, DefaultStrategy, ConservativeStrategy) lack JSDoc. Especially important for ConservativeStrategy whose 0.8 multiplier has non-obvious RTP implications. [L1-L20] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine domain confirmed by SpinResult, jackpotHit, freeSpinsAwarded, scatterCount vocabulary and project structure. ConservativeStrategy multiplies totalPayout by 0.8, reducing effective RTP from the arbitrated 95% target to ~76% when active — a potential regulatory compliance violation in certified gaming. Math.floor on the product also introduces a systematic downward rounding bias that compounds at high payout volumes. Neither impact is documented. [L13-L18] |

### Suggestions

- Add JSDoc to all three exported classes; ConservativeStrategy especially needs an RTP-impact note.
  ```typescript
  // Before
  export class ConservativeStrategy extends SpinStrategy {
    adjustPayout(result: SpinResult): SpinResult {
  // After
  /**
   * Reduces all payouts to 80% of the calculated amount.
   * @remarks This strategy lowers effective RTP to ~76% and must be
   * re-certified before use in a licensed deployment.
   */
  export class ConservativeStrategy extends SpinStrategy {
    adjustPayout(result: SpinResult): SpinResult {
  ```
- If ConservativeStrategy is intentional, constrain the multiplier so effective RTP stays at or above the certified 95% floor (multiplier ≥ 1.0 keeps RTP unchanged; any reduction needs re-certification). Otherwise add a floor guard.
  ```typescript
  // Before
  totalPayout: Math.floor(result.totalPayout * 0.8),
  // After
  // Must be >= 1.0 to preserve 95% certified RTP; any reduction requires regulator sign-off
  totalPayout: Math.floor(result.totalPayout * RTP_STRATEGY_MULTIPLIER),
  ```
- Use Math.round (or banker's rounding) instead of Math.floor to avoid systematic downward bias in high-volume payout calculations.
  - Before: `totalPayout: Math.floor(result.totalPayout * 0.8),`
  - After: `totalPayout: Math.round(result.totalPayout * 0.8),`

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
