# Review: `src/strategy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SpinStrategy | class | yes | OK | LEAN | USED | UNIQUE | NONE | 85% |
| DefaultStrategy | class | yes | OK | LEAN | USED | UNIQUE | NONE | 88% |
| ConservativeStrategy | class | yes | OK | ACCEPTABLE | DEAD | UNIQUE | - | 85% |

### Details

#### `SpinStrategy` (L3–L5)

Auto-resolved: function ≤ 5 lines

#### `DefaultStrategy` (L7–L11)

Auto-resolved: function ≤ 5 lines

#### `ConservativeStrategy` (L13–L20)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Math.floor(totalPayout * 0.8) matches documented 20% reduction behavior exactly.
- **Overengineering [ACCEPTABLE]**: Contains real payout-reduction logic (Math.floor × 0.8) and is documented as a public API alternative in `.anatoly/state/internal-docs/04-API-Reference/02-Configuration-Schema.md`. Zero importers is expected by design — users apply it manually post-spin. The class form is slightly ceremonial but justified by the documented extension point.
- **Tests [NONE]**: No test file found. The 0.8 multiplier + Math.floor truncation logic is untested, including boundary cases like zero or fractional payouts.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The 20% payout reduction and floor rounding are non-trivial business rules that warrant explicit documentation.

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | All three exported symbols (SpinStrategy, DefaultStrategy, ConservativeStrategy) lack JSDoc. These are public API surface; at minimum SpinStrategy.adjustPayout contract and ConservativeStrategy's 80%-floor behavior should be documented. [L3-L20] |
| 13 | Security | WARN | CRITICAL | Casino/slot-machine domain inferred from SpinResult, totalPayout, jackpot, DIAMOND vocabulary. ConservativeStrategy computes Math.floor(totalPayout * 0.8) using floating-point multiplication on a payout value. Math.floor mitigates precision loss for integer inputs, but integer arithmetic (e.g. Math.floor((totalPayout * 4) / 5)) is the compliant form for regulated gaming engines where exact arithmetic is a certification requirement. No Math.random(), eval, or hardcoded secrets. [L18] |
| 17 | Context-adapted rules | WARN | MEDIUM | Casino domain: ConservativeStrategy is a public export that silently reduces all payouts by 20%. The declared RTP target is 95% (README arbitrated intent). Applying ConservativeStrategy post-spin would push effective RTP well below the certified model without any guard, warning, or access restriction. In regulated gaming, all payout adjustments must be reflected in the certified mathematical model. The class should at minimum document this compliance risk in JSDoc. [L14-L20] |

### Suggestions

- Use integer arithmetic for the 80% payout reduction to avoid floating-point imprecision in certified casino code.
  - Before: `totalPayout: Math.floor(result.totalPayout * 0.8),`
  - After: `totalPayout: Math.floor((result.totalPayout * 4) / 5),`
- Add JSDoc to all three public exports documenting their contract, especially ConservativeStrategy's compliance risk.
  ```typescript
  // Before
  export abstract class SpinStrategy {
    abstract adjustPayout(result: SpinResult): SpinResult;
  }
  // After
  /**
   * Base class for post-spin payout adjustment strategies.
   * Implement adjustPayout to modify the SpinResult before returning it to the caller.
   */
  export abstract class SpinStrategy {
    /** Returns a (possibly modified) SpinResult. Must not mutate the input. */
    abstract adjustPayout(result: SpinResult): SpinResult;
  }
  ```
- Guard ConservativeStrategy against accidental use in production paths where the certified RTP model must hold.
  ```typescript
  // Before
  export class ConservativeStrategy extends SpinStrategy {
  // After
  /**
   * Reduces totalPayout to 80 % of its value.
   * @warning Applying this strategy lowers effective RTP below the certified 95 % model.
   * Use only in explicitly documented testing or bonus contexts.
   */
  export class ConservativeStrategy extends SpinStrategy {
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ConservativeStrategy` is exported but unused (`ConservativeStrategy`) [L13-L20]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
