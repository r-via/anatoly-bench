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
- **Correction [OK]**: Abstract base class with no implementation logic; nothing to evaluate.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: Abstract base class, no test file found.
- **UNDOCUMENTED [UNDOCUMENTED]**: Abstract base class has no JSDoc. Purpose, intended usage pattern, and the contract of adjustPayout are undocumented.

#### `DefaultStrategy` (L7–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Identity pass-through; no mutations or logic errors.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: Used by src/engine.ts but no test file exists. Identity payout logic is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The identity behavior (returns result unchanged) is non-obvious and warrants at least a one-line description.

#### `ConservativeStrategy` (L13–L20)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Math.floor on a reduced payout rounds down (house keeps remainder), which is the correct direction for regulated slot-machine payouts. Spread preserves all other SpinResult fields correctly.
- **Overengineering [OVER]**: 0 importers — dead code. Additionally, the 0.8 multiplier yields ~80% RTP, directly contradicting the arbitrated 95% RTP target from README.md. If ever wired in, it would silently break the stated house-edge invariant.
- **Tests [NONE]**: No test file found. 80% payout reduction and Math.floor rounding are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The 0.8 multiplier and its rationale (20% payout reduction) should be documented on the exported class.

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Both `adjustPayout` signatures accept `SpinResult` rather than `Readonly<SpinResult>`. Methods spread the input (good), but the type doesn't enforce the non-mutation contract. [L8,L14] |
| 9 | JSDoc on public exports | WARN | MEDIUM | All three exported symbols (`SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy`) lack JSDoc. In a regulated gambling domain, the payout-modification semantics of each strategy should be documented. [L3,L8,L14] |
| 17 | Context-adapted rules | WARN | MEDIUM | Casino/gambling domain inferred from reels/jackpot/paytable/freespin/rng vocabulary. `ConservativeStrategy` silently applies a 20% payout reduction via floating-point multiplication (`result.totalPayout * 0.8`). In regulated gaming, any RTP-affecting transform should (a) use integer-safe arithmetic (coins are integers; `Math.round` or integer division is safer than `Math.floor` on a float product) and (b) be annotated with its RTP impact for auditability. [L16] |

### Suggestions

- Declare parameters as `Readonly<SpinResult>` to encode the non-mutation contract in the type system.
  - Before: `adjustPayout(result: SpinResult): SpinResult`
  - After: `adjustPayout(result: Readonly<SpinResult>): SpinResult`
- Add JSDoc to public exports; include the RTP impact for each strategy so regulators/auditors can trace payout logic.
  ```typescript
  // Before
  export class ConservativeStrategy extends SpinStrategy {
    adjustPayout(result: SpinResult): SpinResult {
  // After
  /**
   * Reduces total payout by 20%, targeting a more conservative RTP profile.
   * NOTE: lowers effective RTP below the nominal 95% engine target — verify
   * compliance before deploying to a certified environment.
   */
  export class ConservativeStrategy extends SpinStrategy {
    adjustPayout(result: Readonly<SpinResult>): SpinResult {
  ```
- Use integer-safe arithmetic on coin payouts. Multiplying an integer coin value by 0.8 produces a float; Math.floor is a patch rather than a fix. Use integer division instead.
  - Before: `totalPayout: Math.floor(result.totalPayout * 0.8),`
  - After: `totalPayout: Math.trunc((result.totalPayout * 4) / 5),`

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ConservativeStrategy` is exported but unused (`ConservativeStrategy`) [L13-L20]

### Hygiene

- **[overengineering · medium · small]** Simplify: `SpinStrategy` is over-engineered `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
