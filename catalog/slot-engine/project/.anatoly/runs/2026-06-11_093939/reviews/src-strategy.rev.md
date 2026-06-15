# Review: `src/strategy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SpinStrategy | class | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| DefaultStrategy | class | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| ConservativeStrategy | class | yes | OK | - | DEAD | UNIQUE | - | 90% |

### Details

#### `SpinStrategy` (L3–L5)

- **Utility [USED]**: Transitively used by DefaultStrategy
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Abstract base class correctly declares the adjustPayout contract.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: Abstract base class with no test file. No tests exist for any strategy classes.
- **UNDOCUMENTED [UNDOCUMENTED]**: Abstract base class with no JSDoc. Purpose, intended usage, and the contract of `adjustPayout` are not explained.

#### `DefaultStrategy` (L7–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Pass-through implementation is correct; returns result unmodified.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: No test file found. Used by src/engine.ts, making untested pass-through behavior a gap in engine-level coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on the class or its `adjustPayout` override. The pass-through behavior (no adjustment) is non-obvious and should be documented.

#### `ConservativeStrategy` (L13–L20)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Spread correctly overrides only totalPayout; Math.floor on the 0.8-multiplied value is the correct rounding direction for slot payouts (house keeps the remainder). No invariant from the arbitrated SpinResult interface is violated.
- **Overengineering [OVER]**: 0 importers — dead code. Applies a hardcoded 0.8 multiplier, which conflicts with the README's stated 95% RTP target (a 20% payout reduction far exceeds the 5% house edge). Premature generalization: a named strategy class for a single magic-number transform that is never called.
- **Tests [NONE]**: No test file found. The 0.8 multiplier and Math.floor truncation behavior are untested edge cases (e.g. fractional payouts, zero payout).
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The 0.8 multiplier and floor rounding are significant business rules with no explanation of intent or rationale.

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | The `result` parameter in both `adjustPayout` signatures is typed as `SpinResult`, not `Readonly<SpinResult>`. The primitive fields (`totalPayout`, `wildMultiplier`, etc.) could be mutated. SpinResult's array fields are already ReadonlyArray per README, but the wrapper is missing. [L7,L12] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | All three public exports (`SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy`) lack JSDoc. `SpinStrategy` should document the contract it enforces. `ConservativeStrategy` especially needs documentation explaining the 0.8 multiplier and its effect on RTP. [L3,L8,L14] |
| 13 | Security | WARN | HIGH | Slot-machine/casino domain inferred from reels/jackpot/paytable/freespin/rng vocabulary across the project. `ConservativeStrategy` applies a hard-coded `* 0.8` payout multiplier, reducing the engine's certified 95% RTP to approximately 76%. In regulated jurisdictions (GLI, eCOGRA, etc.), every payout parameter is part of the certified game math; an undocumented multiplier that silently overrides the published RTP constitutes a compliance risk. The `0.8` literal should be a named, auditable configuration constant. [L17] |
| 17 | Context-adapted rules | WARN | MEDIUM | Casino/gambling domain: payout adjustments in certified games must be auditable. `ConservativeStrategy.adjustPayout` applies a silent 20% reduction with no event emission, no logging hook, and no traceable strategy identifier on the returned `SpinResult`. Regulators and audit trails require that every payout modification be attributable to a named, versioned rule. [L14-L20] |

### Suggestions

- Mark the payout multiplier as a named constant and add JSDoc to ConservativeStrategy
  ```typescript
  // Before
  export class ConservativeStrategy extends SpinStrategy {
    adjustPayout(result: SpinResult): SpinResult {
      return {
        ...result,
        totalPayout: Math.floor(result.totalPayout * 0.8),
      };
    }
  }
  // After
  /** Multiplier applied to all payouts; yields approximately 76% RTP. Must match certified game-math submission. */
  const CONSERVATIVE_PAYOUT_FACTOR = 0.8 as const;
  
  /**
   * Conservative payout strategy — reduces total payout by 20%.
   * Use only in game modes whose certified RTP permits sub-95% returns.
   */
  export class ConservativeStrategy extends SpinStrategy {
    adjustPayout(result: Readonly<SpinResult>): SpinResult {
      return {
        ...result,
        totalPayout: Math.floor(result.totalPayout * CONSERVATIVE_PAYOUT_FACTOR),
      };
    }
  }
  ```
- Use Readonly<SpinResult> on all adjustPayout parameters to prevent accidental mutation of primitive fields
  - Before: `adjustPayout(result: SpinResult): SpinResult {`
  - After: `adjustPayout(result: Readonly<SpinResult>): SpinResult {`

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ConservativeStrategy` is exported but unused (`ConservativeStrategy`) [L13-L20]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SpinStrategy` (`SpinStrategy`) [L3-L5]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `DefaultStrategy` (`DefaultStrategy`) [L7-L11]
