# Review: `src/strategy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SpinStrategy | class | yes | OK | LEAN | USED | UNIQUE | - | 88% |
| DefaultStrategy | class | yes | OK | LEAN | USED | UNIQUE | - | 85% |
| ConservativeStrategy | class | yes | OK | - | DEAD | UNIQUE | - | 90% |

### Details

#### `SpinStrategy` (L3–L5)

- **Utility [USED]**: Transitively used by DefaultStrategy
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Abstract base class with no implementation — nothing to be incorrect.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [-]**: *(not evaluated)*

#### `DefaultStrategy` (L7–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Pure pass-through; returns the result unchanged, which is the correct identity behavior for this strategy.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [-]**: *(not evaluated)*

#### `ConservativeStrategy` (L13–L20)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Math.floor on a 0.8× multiplier is correct for the slot-machine domain (house keeps the remainder; rounding down is the industry convention). For integer totalPayout values, IEEE-754 multiplication by 0.8 does not produce values near a half-integer boundary that would cause Math.floor to round the wrong way. lineWins is left unmodified, which could create internal inconsistency with the adjusted totalPayout, but LineWin's definition and whether totalPayout is contractually required to equal the sum of lineWins is not visible in this context, so no finding is raised (rule 16).
- **Overengineering [OVER]**: 0 importers — dead code. Even if it were live, it wraps a one-liner (`totalPayout * 0.8`) in a class extending an abstract class, adding three layers of indirection for a simple scalar adjustment.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `adjustPayout` receives `SpinResult` but never mutates it. Typing the parameter as `Readonly<SpinResult>` would make the non-mutation contract explicit and allow callers to pass read-only values without widening. [L5, L9, L15] |
| 9 | JSDoc on public exports | WARN | MEDIUM | All three exported symbols (`SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy`) lack JSDoc. At minimum the abstract base and `ConservativeStrategy` (with its 0.8× attenuation semantics) should be documented. [L3, L7, L12] |

### Suggestions

- Use `Readonly<SpinResult>` on the input parameter to communicate non-mutation intent and accept read-only callers.
  - Before: `adjustPayout(result: SpinResult): SpinResult {`
  - After: `adjustPayout(result: Readonly<SpinResult>): SpinResult {`
- Add JSDoc to exported symbols, especially ConservativeStrategy whose 0.8× multiplier semantics are non-obvious.
  ```typescript
  // Before
  export class ConservativeStrategy extends SpinStrategy {
    adjustPayout(result: SpinResult): SpinResult {
  // After
  /**
   * Reduces computed payouts by 20% (0.8× multiplier).
   * NOTE: Applying this strategy lowers effective RTP below the documented 95% target.
   * Intended for controlled test scenarios only — do not use in production engine.
   */
  export class ConservativeStrategy extends SpinStrategy {
    adjustPayout(result: Readonly<SpinResult>): SpinResult {
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ConservativeStrategy` is exported but unused (`ConservativeStrategy`) [L13-L20]
