# Review: `src/strategy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SpinStrategy | class | yes | OK | LEAN | USED | UNIQUE | NONE | 85% |
| DefaultStrategy | class | yes | OK | LEAN | USED | UNIQUE | NONE | 85% |
| ConservativeStrategy | class | yes | OK | - | DEAD | UNIQUE | - | 88% |

### Details

#### `SpinStrategy` (L3–L5)

- **Utility [USED]**: Transitively used by DefaultStrategy
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Abstract base class with a single abstract method; no correctness issues.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: Abstract base class with no test file found.
- **UNDOCUMENTED [UNDOCUMENTED]**: Abstract base class with no JSDoc. Missing description of the strategy pattern purpose, the contract of adjustPayout, and guidance on implementing subclasses.

#### `DefaultStrategy` (L7–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Identity pass-through; no mutations or type errors.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: No test file exists. Used by the critical `spin` function in engine.ts — the identity pass-through behavior is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The pass-through behavior (returns result unchanged) is non-obvious from the name alone and warrants at least a one-liner.

#### `ConservativeStrategy` (L13–L20)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Moot — symbol is DEAD (was NEEDS_FIX: 0.8 multiplier reduces effective RTP from ~95% to ~76%, violating the arbitrated 95% RTP target.)
- **Overengineering [OVER]**: Dead code: 0 importers anywhere in the project. Also, applying a 0.8 multiplier to totalPayout would yield ~80% of the engine's base payout, violating the arbitrated 95% RTP invariant (README) if ever wired in. Premature implementation of a variant that is neither used nor compatible with the stated RTP target.
- **Tests [NONE]**: No test file exists. The 0.8 multiplier floor logic and its effect on totalPayout are completely untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The 0.8 multiplier applied to totalPayout is a meaningful business rule that should be documented — neither the reduction factor nor its rationale is explained.

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | adjustPayout parameters should be Readonly<SpinResult> to signal callers the input is not mutated and to prevent accidental in-place edits in future subclasses. [L6] |
| 9 | JSDoc on public exports | WARN | MEDIUM | All three exported symbols (SpinStrategy, DefaultStrategy, ConservativeStrategy) lack JSDoc. In a regulated gambling engine, documenting the RTP contract of each strategy is especially important. [L3-L20] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine domain inferred from reel/payline/jackpot/freeSpinsAwarded vocabulary. ConservativeStrategy applies a 0.8 multiplier to totalPayout at L17. If this strategy is active during certified play, effective RTP drops from the documented 95% to ~76%. In regulated gambling, payout modifications outside certified bounds require explicit RTP re-certification and documentation. The strategy lacks any RTP annotation. [L13-L20] |

### Suggestions

- Mark input parameters Readonly to signal immutability contract and prevent accidental mutation in subclasses.
  - Before: `abstract adjustPayout(result: SpinResult): SpinResult;`
  - After: `abstract adjustPayout(result: Readonly<SpinResult>): SpinResult;`
- Add JSDoc to all exported strategy classes documenting the RTP impact, especially critical in regulated gambling.
  ```typescript
  // Before
  export class ConservativeStrategy extends SpinStrategy {
    adjustPayout(result: SpinResult): SpinResult {
  // After
  /**
   * Reduces totalPayout to 80% of the engine's base calculation.
   * NOTE: Applying this strategy lowers effective RTP from the certified 95% to ~76%.
   * Do not activate in regulated-play sessions without RTP re-certification.
   */
  export class ConservativeStrategy extends SpinStrategy {
    adjustPayout(result: Readonly<SpinResult>): SpinResult {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Replace the 0.8 payout multiplier with a value that preserves the 95% RTP arbitrated contract, or document an explicit dispensation from that contract for this strategy variant. [L17]
- **[utility · high · trivial]** Remove dead code: `ConservativeStrategy` is exported but unused (`ConservativeStrategy`) [L13-L20]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `SpinStrategy` (`SpinStrategy`) [L3-L5]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `DefaultStrategy` (`DefaultStrategy`) [L7-L11]
