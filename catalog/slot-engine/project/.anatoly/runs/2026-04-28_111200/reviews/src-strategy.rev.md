# Review: `src/strategy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SpinStrategy | class | yes | OK | LEAN | USED | UNIQUE | - | 90% |
| DefaultStrategy | class | yes | OK | LEAN | USED | UNIQUE | - | 90% |
| ConservativeStrategy | class | yes | OK | LEAN | DEAD | UNIQUE | - | 88% |

### Details

#### `SpinStrategy` (L3–L5)

- **Utility [USED]**: Transitively used by DefaultStrategy
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Abstract base class is correctly defined; no logic to evaluate.
- **Overengineering [LEAN]**: ADR-003 (.anatoly/docs/02-Architecture/04-Design-Decisions.md) explicitly documents this abstract class as the intended extension point for payout adjustment, with the rationale that new rules are added by subclassing rather than branching inside engine.ts. The pattern is also surfaced in user-facing docs as a public API. Despite 0 external importers, it serves as the documented contract for both bundled strategies and user-defined ones — the abstraction is architecturally justified.
- **Tests [-]**: *(not evaluated)*

#### `DefaultStrategy` (L7–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Pass-through implementation matches documented behaviour exactly (ADR-003, Configuration.md).
- **Overengineering [LEAN]**: Pass-through implementation with 1 importer. ADR-003 explicitly justifies its existence: making the no-adjustment case an explicit named strategy rather than a missing-strategy null-check. The implementation is minimal — a single return statement.
- **Tests [-]**: *(not evaluated)*

#### `ConservativeStrategy` (L13–L20)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Math.floor(totalPayout * 0.8) matches the documented 80% floor-rounded reduction in ADR-003 and both guide pages; rounding down is also correct for slot-domain house-edge convention.
- **Overengineering [LEAN]**: 0 external importers, but ADR-003 (.anatoly/docs/02-Architecture/04-Design-Decisions.md) documents it as one of the two concrete strategies that ship with the library, with its exact behavior (Math.floor * 0.8) specified in both the ADR and the Configuration guide. The implementation is a minimal two-line spread. Its current lack of callers is noted as a runtime concern in the ADR's Consequences section, not a design defect.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | FAIL | MEDIUM | All three exported symbols — `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` — lack JSDoc comments. This is a library extension point (documented in `.anatoly/docs/01-Getting-Started/03-Configuration.md` and `.anatoly/docs/03-Guides/02-Advanced-Configuration.md`) and is explicitly referenced as a user-facing API. At minimum the abstract base class and its `adjustPayout` abstract method should carry JSDoc explaining the contract and the extension pattern. [L3-L19] |

### Suggestions

- Add JSDoc to the abstract base class and its contract method so library consumers understand the extension point without consulting external docs.
  ```typescript
  // Before
  export abstract class SpinStrategy {
    abstract adjustPayout(result: SpinResult): SpinResult;
  }
  // After
  /**
   * Extension point for post-calculation payout adjustment.
   * Subclass this to implement custom payout policies (e.g. capped maximums,
   * bonus-round multipliers). The active strategy is applied by `engine.ts`
   * as the final step of `spin()`.
   */
  export abstract class SpinStrategy {
    /**
     * Returns a (possibly modified) copy of `result`.
     * Implementations MUST NOT mutate the input object.
     */
    abstract adjustPayout(result: SpinResult): SpinResult;
  }
  ```
- Add JSDoc to the two concrete strategy classes so generated API docs and IDE hover text describe their behaviour without requiring callers to read the ADR.
  ```typescript
  // Before
  export class DefaultStrategy extends SpinStrategy {
  export class ConservativeStrategy extends SpinStrategy {
  // After
  /** Pass-through strategy — returns the result unchanged. */
  export class DefaultStrategy extends SpinStrategy {
  
  /** Reduces {@link SpinResult.totalPayout} to 80 % of the computed value
   * using `Math.floor`, lowering effective RTP below the 95 % baseline.
   * See ADR-003 for rationale.
   */
  export class ConservativeStrategy extends SpinStrategy {
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ConservativeStrategy` is exported but unused (`ConservativeStrategy`) [L13-L20]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `ConservativeStrategy` (`ConservativeStrategy`) [L13-L20]
