# Review: `src/strategy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SpinStrategy | class | yes | OK | LEAN | USED | UNIQUE | NONE | 82% |
| DefaultStrategy | class | yes | OK | LEAN | USED | UNIQUE | NONE | 78% |
| ConservativeStrategy | class | yes | OK | - | DEAD | UNIQUE | - | 85% |

### Details

#### `SpinStrategy` (L3–L5)

Auto-resolved: function ≤ 5 lines

#### `DefaultStrategy` (L7–L11)

Auto-resolved: function ≤ 5 lines

#### `ConservativeStrategy` (L13–L20)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Math.floor(totalPayout × 0.8) is correct: floor rounds toward −∞, keeping the remainder with the house — correct direction for casino payout rounding. All other SpinResult fields are passed through unchanged. Matches the documented 80% reduction contract exactly.
- **Overengineering [OVER]**: 0 importers anywhere in the codebase. Single arithmetic operation wrapped in a subclass. Dead abstraction — the logic is a one-liner that doesn't justify class inheritance.
- **Tests [NONE]**: No test file exists. The 0.8 multiplier with Math.floor truncation is business-critical and entirely untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The 80% floor reduction applied to totalPayout is a non-trivial behavior that requires documentation to be discoverable.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine domain inferred from SpinResult, totalPayout, jackpotHit, reels vocabulary throughout project. ConservativeStrategy applies Math.floor(totalPayout × 0.8), reducing effective RTP from the documented 95% to ~76%. In regulated markets every deployable strategy variant requires independent RTP certification. No comment or guard prevents ConservativeStrategy from being silently swapped in for the default, which could constitute an undeclared RTP change. At minimum, a JSDoc note stating the RTP impact is advisable. [L14-L20] |

### Suggestions

- Document the RTP impact of ConservativeStrategy to prevent silent compliance violations in regulated deployments.
  ```typescript
  // Before
  export class ConservativeStrategy extends SpinStrategy {
    adjustPayout(result: SpinResult): SpinResult {
  // After
  /**
   * Reduces totalPayout to 80% of the engine-computed value.
   * WARNING: Applying this strategy lowers effective RTP from ~95% to ~76%.
   * Regulated deployments require re-certification before using this variant.
   */
  export class ConservativeStrategy extends SpinStrategy {
    adjustPayout(result: SpinResult): SpinResult {
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ConservativeStrategy` is exported but unused (`ConservativeStrategy`) [L13-L20]

### Hygiene

- **[overengineering · medium · small]** Simplify: `SpinStrategy` is over-engineered `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
