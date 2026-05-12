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

Auto-resolved: function ≤ 5 lines

#### `DefaultStrategy` (L7–L11)

Auto-resolved: function ≤ 5 lines

#### `ConservativeStrategy` (L13–L20)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Math.floor on a scaled-down payout is correct for casino domain (house keeps remainder); 0.8 multiplier applied before floor is the right order of operations.
- **Overengineering [OVER]**: 0 importers. A one-liner transform (multiply payout by 0.8) wrapped in a class. This logic belongs inline or as a plain function — the strategy pattern is unjustified for a single, unused variant.
- **Tests [NONE]**: No test file found. The 0.8 multiplier with Math.floor has edge cases (fractional results, zero payout, large values) that are entirely uncovered.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The 0.8 multiplier (20% payout reduction) and the rationale for floor rounding are unexplained.

## Best Practices — 6.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `adjustPayout` returns a new object via spread but `totalPayout` is mutated as a plain number computation. Neither the abstract class nor the concrete classes declare method signatures or internal state as `readonly`. If `SpinResult` has mutable fields, callers can mutate the returned object. [L7-L19] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | All three exported symbols (`SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy`) lack JSDoc. The abstract method `adjustPayout` also has no documentation explaining the contract. [L3-L19] |
| 13 | Security | FAIL | CRITICAL | Slot-machine/casino domain inferred from reel/spin/jackpot/paytable/freespin vocabulary across the project (reels.ts, jackpot.ts, freespin.ts, paytable.ts). `ConservativeStrategy.adjustPayout` applies `Math.floor(result.totalPayout * 0.8)` — a fixed 20% house-edge adjustment using floating-point arithmetic on monetary payout values. In regulated gaming, payout calculations must use integer arithmetic (cents) or a certified Decimal library to avoid floating-point rounding errors that could skew certified RTP (Return To Player) percentages. Floating-point multiplication on monetary amounts is not certifiable for regulated gambling. [L14-L18] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `satisfies` operator could validate that concrete strategies conform to the abstract contract at compile time without losing narrowed types. No `const` type params or `using` applicable here, but `satisfies` is a missed opportunity. [L7-L19] |
| 17 | Context-adapted rules | FAIL | MEDIUM | Strategy pattern is appropriate, but only two strategies are defined with no registry or factory integration visible here. The `DefaultStrategy` is a no-op pass-through — it adds no value over returning the result directly and risks masking missing configuration. In a regulated gaming context, payout strategies should be auditable and version-stamped; neither strategy carries any identity metadata. [L7-L12] |

### Suggestions

- Use integer arithmetic for monetary payout calculations to avoid floating-point rounding errors in regulated gaming RTP.
  - Before: `totalPayout: Math.floor(result.totalPayout * 0.8),`
  - After: `totalPayout: Math.floor((result.totalPayout * 8) / 10),`
- Add JSDoc to all public exports, especially the abstract method contract.
  ```typescript
  // Before
  export abstract class SpinStrategy {
    abstract adjustPayout(result: SpinResult): SpinResult;
  }
  // After
  /**
   * Base strategy for post-spin payout adjustment.
   * Implementations must be deterministic and auditable.
   */
  export abstract class SpinStrategy {
    /**
     * Adjusts the payout of a completed spin result.
     * @param result - The raw spin result from the engine.
     * @returns A (possibly modified) spin result with adjusted payout.
     */
    abstract adjustPayout(result: SpinResult): SpinResult;
  }
  ```
- Use `satisfies` to validate concrete strategies conform to the abstract shape without losing type narrowing.
  - Before: `export class DefaultStrategy extends SpinStrategy {`
  - After: `export class DefaultStrategy extends SpinStrategy satisfies SpinStrategy {`
- Add a strategy identity/name field for auditability in regulated gaming contexts.
  ```typescript
  // Before
  export class ConservativeStrategy extends SpinStrategy {
  // After
  export class ConservativeStrategy extends SpinStrategy {
    readonly strategyId = 'conservative-v1' as const;
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ConservativeStrategy` is exported but unused (`ConservativeStrategy`) [L13-L20]

### Hygiene

- **[overengineering · medium · small]** Simplify: `SpinStrategy` is over-engineered `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
