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
- **Correction [OK]**: Abstract base class defines a valid contract; no logic to evaluate.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: Abstract base class with no test file found.
- **UNDOCUMENTED [UNDOCUMENTED]**: Abstract base class has no JSDoc. Purpose, intended usage pattern, and extension contract are not documented.

#### `DefaultStrategy` (L7–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Identity passthrough is correct; no mutation or type mismatch.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: No test file found. Used by src/engine.ts, making untested pass-through behavior a gap in engine-level coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on class or method. While name implies pass-through behavior, the no-op contract of adjustPayout is not explicitly stated.

#### `ConservativeStrategy` (L13–L20)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Math.floor on a reduced payout is the correct rounding direction for slot-machine coin arithmetic (house retains remainder). No logic errors.
- **Overengineering [OVER]**: 0 importers — dead code. Additionally, the 0.8× multiplier would reduce effective RTP to ~80%, contradicting the arbitrated 95% RTP target in README.md. Even if wired up, this strategy violates the engine's stated contract.
- **Tests [NONE]**: No test file found. The 0.8 multiplier + Math.floor truncation logic is untested — boundary and rounding edge cases are unverified.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on class or method. The 0.8 multiplier and floor rounding are undocumented business logic that warrants explanation.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | All three exported symbols (SpinStrategy, DefaultStrategy, ConservativeStrategy) lack JSDoc. The intent and payout-reduction semantics of ConservativeStrategy (0.8× multiplier) are not documented. [L4-L20] |
| 13 | Security | WARN | HIGH | Casino/slot-machine domain inferred from reels/jackpot/paytable/rng/freespin vocabulary in project structure. `result.totalPayout * 0.8` applies IEEE 754 floating-point multiplication to a monetary coin value. `Math.floor` mitigates most precision drift for small integers, but for large jackpot payouts the intermediate double may round incorrectly before flooring. Industry best practice for regulated gaming is integer arithmetic (e.g. `Math.floor(result.totalPayout * 4) / 5` or a Decimal library). Flagged WARN rather than FAIL because the coin domain is integer-bounded and Math.floor limits observable error. [L17] |

### Suggestions

- Add JSDoc to all three public exports documenting payout semantics and the multiplier value.
  ```typescript
  // Before
  export class ConservativeStrategy extends SpinStrategy {
    adjustPayout(result: SpinResult): SpinResult {
  // After
  /**
   * Reduces the computed payout by 20% (floor), shifting effective RTP below the engine's
   * 95% baseline. Intended for sandbox/demo modes — do NOT use on live regulated sessions.
   */
  export class ConservativeStrategy extends SpinStrategy {
    adjustPayout(result: SpinResult): SpinResult {
  ```
- Replace float multiplication with integer-safe arithmetic to avoid IEEE 754 drift on large jackpot payouts in regulated casino context.
  - Before: `totalPayout: Math.floor(result.totalPayout * 0.8),`
  - After: `totalPayout: Math.floor((result.totalPayout * 4) / 5),`

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ConservativeStrategy` is exported but unused (`ConservativeStrategy`) [L13-L20]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SpinStrategy` (`SpinStrategy`) [L3-L5]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `DefaultStrategy` (`DefaultStrategy`) [L7-L11]
