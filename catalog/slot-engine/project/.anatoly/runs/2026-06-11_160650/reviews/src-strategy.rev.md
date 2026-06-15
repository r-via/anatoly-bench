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
- **Correction [OK]**: Abstract base class with no logic; no correctness issues.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: Abstract base class with no test file found.
- **UNDOCUMENTED [UNDOCUMENTED]**: Abstract base class with no JSDoc. Purpose, contract, and expected extension behavior are not documented.

#### `DefaultStrategy` (L7–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Identity pass-through; structurally correct.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: No test file exists. Used by the critical `spin` function in engine.ts — pass-through behavior is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on class or method. `adjustPayout` returns the result unchanged — this identity behavior warrants a comment explaining intent (pass-through/no-op strategy).

#### `ConservativeStrategy` (L13–L20)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Math.floor on a downward-scaled payout is correct for the slot-machine domain (house keeps remainder); spread correctly preserves all other SpinResult fields.
- **Overengineering [OVER]**: 0 importers — dead code. Applies a hardcoded 0.8 multiplier with no configuration parameter, and the README specifies a 95% RTP target with no mention of a conservative mode. Unused strategy variant that fragments payout logic across an unnecessary class hierarchy.
- **Tests [NONE]**: No test file exists. The 0.8 multiplier with floor rounding is untested — no coverage of integer truncation, zero payout, or large values.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on class or method. The 0.8 multiplier and floor rounding are meaningful business decisions with no explanation of why this factor was chosen or what 'conservative' means in this context.

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | The `result` parameter in both `adjustPayout` overrides is mutable. It should be typed `Readonly<SpinResult>` to prevent accidental mutation of the caller's object. [L7-L19] |
| 9 | JSDoc on public exports | WARN | MEDIUM | All three exported symbols (`SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy`) lack JSDoc. At minimum the abstract base and the 0.8 reduction factor of ConservativeStrategy warrant documentation. [L3-L20] |
| 13 | Security | WARN | HIGH | Slot-machine domain inferred from SpinResult/SpinStrategy vocabulary and project structure. ConservativeStrategy hard-codes a 0.8 payout multiplier: applied to a 95% RTP base (per README), effective RTP drops to ~76%, below typical regulated minimums (85–97.3% depending on jurisdiction). The strategy is exported and callable by any consumer without a compliance gate. Although only DefaultStrategy is currently wired to the engine, the exported symbol constitutes a latent regulatory risk under most gaming certification frameworks. [L13-L20] |
| 17 | Context-adapted rules | WARN | MEDIUM | Regulated gaming context: payout-altering strategy classes should carry a certification annotation or be sealed behind an internal-only module boundary to prevent accidental integration. Exporting ConservativeStrategy as public API without a guard or disclaimer is inconsistent with certified game-math isolation patterns common in iGaming SDKs. [L13-L20] |

### Suggestions

- Mark the `result` parameter readonly to prevent mutation and signal intent clearly.
  - Before: `adjustPayout(result: SpinResult): SpinResult`
  - After: `adjustPayout(result: Readonly<SpinResult>): SpinResult`
- Add JSDoc to all exported symbols, especially documenting the 0.8 reduction ratio and its RTP implication.
  ```typescript
  // Before
  export class ConservativeStrategy extends SpinStrategy {
    adjustPayout(result: SpinResult): SpinResult {
  // After
  /**
   * Reduces total payout to 80% of the computed value.
   * @remarks Applying this strategy lowers effective RTP by ~19 percentage points
   * relative to the certified 95% baseline. Do not activate in regulated deployments
   * without re-certification.
   */
  export class ConservativeStrategy extends SpinStrategy {
    adjustPayout(result: Readonly<SpinResult>): SpinResult {
  ```
- Consider restricting ConservativeStrategy to an internal/non-public export if it is not intended for external callers.
  ```typescript
  // Before
  export class ConservativeStrategy extends SpinStrategy {
  // After
  /** @internal */
  export class ConservativeStrategy extends SpinStrategy {
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ConservativeStrategy` is exported but unused (`ConservativeStrategy`) [L13-L20]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SpinStrategy` (`SpinStrategy`) [L3-L5]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `DefaultStrategy` (`DefaultStrategy`) [L7-L11]
