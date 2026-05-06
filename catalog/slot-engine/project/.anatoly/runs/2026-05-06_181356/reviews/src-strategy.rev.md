# Review: `src/strategy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SpinStrategy | class | yes | OK | ACCEPTABLE | USED | UNIQUE | NONE | 85% |
| DefaultStrategy | class | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| ConservativeStrategy | class | yes | OK | LEAN | DEAD | UNIQUE | - | 90% |

### Details

#### `SpinStrategy` (L3–L5)

- **Utility [USED]**: Transitively used by DefaultStrategy
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Abstract base class is correct; no implementation to evaluate.
- **Overengineering [ACCEPTABLE]**: Abstract class with a single abstract method and no shared state is less idiomatic than a TypeScript interface for a purely abstract contract. The inheritance pattern is justified by ADR-003 (.anatoly/docs/02-Architecture/04-Design-Decisions.md), which documents subclassing as the extension mechanism, but the choice of abstract class over interface adds unnecessary class semantics.
- **Tests [NONE]**: Abstract base class with no test file found.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Abstract base class with non-obvious extension contract (strategy pattern for post-calculation payout adjustment) warrants at minimum a class-level description and note about the intended override point.

#### `DefaultStrategy` (L7–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Pass-through implementation matches documented ADR-003 behaviour exactly.
- **Overengineering [LEAN]**: Pass-through identity implementation. ADR-003 explicitly justifies its existence to make the no-adjustment case explicit rather than relying on a null-strategy check.
- **Tests [NONE]**: No test file found. Used by src/engine.ts, so payout pass-through behavior is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Pass-through behavior is not self-evident from the name alone; a brief note clarifying it returns the result unchanged would prevent misuse.

#### `ConservativeStrategy` (L13–L20)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: 0.8× factor with Math.floor matches documented ADR-003 specification exactly.
- **Overengineering [LEAN]**: Minimal 0.8× floor implementation. ADR-003 documents this as an intentionally shipped strategy; 0 runtime importers reflects unused deployment, not over-abstraction.
- **Tests [NONE]**: No test file found. The 0.8 multiplier with Math.floor truncation has no coverage for boundary values or fractional payout behavior.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The 0.8× floor reduction has a direct RTP impact that callers must know about; this non-obvious business rule demands at minimum a class-level doc noting the multiplier and its effect on effective RTP.

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Both `adjustPayout` implementations treat `result` as read-only in practice but the parameter is not typed as `Readonly<SpinResult>`, missing an explicit immutability contract. [L8,L13] |
| 9 | JSDoc on public exports | WARN | MEDIUM | All three exported symbols (SpinStrategy, DefaultStrategy, ConservativeStrategy) are undocumented in code. ADR-003 describes their behaviour but that is not surfaced via IDE tooling without JSDoc. [L3,L7,L13] |

### Suggestions

- Type `result` parameter as Readonly<SpinResult> to make the non-mutation contract explicit and prevent accidental mutation by future subclasses.
  - Before: `abstract adjustPayout(result: SpinResult): SpinResult;`
  - After: `abstract adjustPayout(result: Readonly<SpinResult>): SpinResult;`
- Add JSDoc to all three public exports so ADR behaviour surfaces in IDE tooling.
  ```typescript
  // Before
  export class ConservativeStrategy extends SpinStrategy {
    adjustPayout(result: SpinResult): SpinResult {
  // After
  /**
   * Reduces total payout by 20% (0.8× factor) for lower-volatility markets.
   * Note: lowers effective RTP below the 95% target — see ADR-003.
   */
  export class ConservativeStrategy extends SpinStrategy {
    adjustPayout(result: Readonly<SpinResult>): SpinResult {
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ConservativeStrategy` is exported but unused (`ConservativeStrategy`) [L13-L20]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
