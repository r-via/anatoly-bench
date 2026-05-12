# Review: `src/strategy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SpinStrategy | class | yes | OK | ACCEPTABLE | USED | UNIQUE | NONE | 78% |
| DefaultStrategy | class | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| ConservativeStrategy | class | yes | OK | LEAN | DEAD | UNIQUE | - | 90% |

### Details

#### `SpinStrategy` (L3–L5)

- **Utility [USED]**: Transitively used by DefaultStrategy
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Abstract base class with single abstract method — no logic to be incorrect.
- **Overengineering [ACCEPTABLE]**: An interface would suffice — abstract class with a single abstract method adds no shared implementation. However, as a public library extension point with two shipped concrete implementations, the pattern is lightweight and the extra ceremony is minor.
- **Tests [NONE]**: Abstract base class with no test file found.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Abstract class with a single abstract method; the extension contract, intended use, and subclassing pattern are not described inline.

#### `DefaultStrategy` (L7–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Pass-through implementation returns result unchanged, matching documented behavior.
- **Overengineering [LEAN]**: Pass-through implementation makes the no-adjustment case explicit rather than requiring callers to guard against a missing strategy. Minimal and purposeful.
- **Tests [NONE]**: No test file found. Used by src/engine.ts, making untested pass-through behavior a gap in engine coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Pass-through semantics are non-obvious without a comment explaining that this is the no-op baseline strategy.

#### `ConservativeStrategy` (L13–L20)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Math.floor(result.totalPayout * 0.8) matches ADR-003 and both config docs exactly; spread preserves all other SpinResult fields correctly.
- **Overengineering [LEAN]**: Single arithmetic transform, no unnecessary abstraction. The 0.8× floor logic is a legitimate encapsulated business rule.
- **Tests [NONE]**: No test file found. The 0.8 multiplier with Math.floor has edge cases (e.g. zero payout, fractional results) that are entirely untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The 0.8× multiplier and its RTP implications are undocumented; callers cannot discover the payout reduction factor without reading the implementation.

## Best Practices — 9.25/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | FAIL | MEDIUM | All three exported symbols (`SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy`) lack JSDoc. This is a published library (`slot-engine`); callers need in-editor documentation — especially the RTP note that ADR-003 mentions for `ConservativeStrategy`. [L3-L20] |
| 17 | Context-adapted rules | WARN | MEDIUM | Casino/slot-machine domain. ADR-003 explicitly states `ConservativeStrategy` reduces effective RTP below the 95% target, yet no in-code guard or `@throws`/JSDoc warning surfaces this. In regulated gaming, silent RTP reduction is a compliance risk; callers using `ConservativeStrategy` without awareness could ship non-compliant configurations. [L17-L22] |

### Suggestions

- Add JSDoc to all three exported classes, including the RTP-impact warning on `ConservativeStrategy`.
  ```typescript
  // Before
  export abstract class SpinStrategy {
    abstract adjustPayout(result: SpinResult): SpinResult;
  }
  
  export class ConservativeStrategy extends SpinStrategy {
    adjustPayout(result: SpinResult): SpinResult { ... }
  }
  // After
  /**
   * Extension point for post-calculation payout adjustment.
   * Implement `adjustPayout` to modify a fully-computed `SpinResult`
   * before it is returned to the caller.
   */
  export abstract class SpinStrategy {
    abstract adjustPayout(result: SpinResult): SpinResult;
  }
  
  /**
   * Reduces `totalPayout` to 80 % of the computed value.
   *
   * @remarks
   * Applying this strategy lowers the effective RTP below the 95 % target
   * documented in ADR-003. Ensure compliance review before deploying to
   * regulated markets.
   */
  export class ConservativeStrategy extends SpinStrategy {
    adjustPayout(result: SpinResult): SpinResult { ... }
  }
  ```
- Consider a runtime RTP-floor guard inside `ConservativeStrategy` so accidental deep-chaining cannot push RTP below a legal minimum.
  ```typescript
  // Before
  totalPayout: Math.floor(result.totalPayout * 0.8),
  // After
  const adjusted = Math.floor(result.totalPayout * 0.8);
  // Enforce absolute floor required by jurisdiction (e.g. 70 % of bet)
  const MIN_PAYOUT = Math.floor(result.totalPayout * 0.7);
  totalPayout: Math.max(adjusted, MIN_PAYOUT),
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ConservativeStrategy` is exported but unused (`ConservativeStrategy`) [L13-L20]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
