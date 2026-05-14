# Review: `src/strategy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SpinStrategy | class | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| DefaultStrategy | class | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| ConservativeStrategy | class | yes | OK | LEAN | DEAD | UNIQUE | NONE | 88% |

### Details

#### `SpinStrategy` (L3–L5)

- **Utility [USED]**: Transitively used by DefaultStrategy
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Abstract base class with no logic; nothing to evaluate.
- **Overengineering [LEAN]**: Abstract base class for an explicitly documented extension point. ADR-003 (.anatoly/docs/02-Architecture/04-Design-Decisions.md) mandates subclassing over branching in engine.ts; the abstraction is the published API surface, not internal ceremony.
- **Tests [NONE]**: Abstract base class with no test file found.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Abstract base class with non-trivial extension semantics (strategy pattern, post-calculation hook) warrants at minimum a description and note about the abstract method contract.

#### `DefaultStrategy` (L7–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Pass-through matches documented behavior exactly.
- **Overengineering [LEAN]**: Pass-through implementation is justified by ADR-003: makes the no-adjustment case explicit instead of relying on a null-strategy guard. One importer confirms active use.
- **Tests [NONE]**: No test file found. Used by src/engine.ts, so untested pass-through behavior in a critical path.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Pass-through behavior is not obvious from the class name alone; a one-line doc clarifying it returns the result unchanged would suffice.

#### `ConservativeStrategy` (L13–L20)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Math.floor(result.totalPayout * 0.8) matches the documented 0.8× floor factor in ADR-003 and both config guides.
- **Overengineering [LEAN]**: 0 importers is a yellow flag, but ADR-003 lists it as a shipped concrete strategy alongside DefaultStrategy and documents its 0.8× RTP consequence. The docs treat both strategies as part of the library's public offering, not dead code.
- **Tests [NONE]**: No test file found. The 0.8 multiplier with Math.floor truncation is business-critical and entirely untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The 0.8× floor reduction is a non-obvious business rule with RTP implications that must be documented on the class itself, not inferred from reading the implementation.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Both `adjustPayout` signatures accept `result: SpinResult` without expressing immutability intent. `Readonly<SpinResult>` as the parameter type would prevent accidental mutation and document the contract. [L4, L8, L14] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | All three exported symbols — `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` — lack JSDoc. The ADR and configuration docs describe their semantics; those descriptions should be surfaced at the declaration site. [L3, L8, L13] |
| 13 | Security | WARN | MEDIUM | Slot-machine/casino domain inferred from SpinResult, payout, RTP vocabulary and confirmed by .anatoly/docs/. `Math.floor(result.totalPayout * 0.8)` performs IEEE-754 floating-point multiplication on a monetary value. For bounded integer payouts this is practically safe, but regulated gaming requires deterministic precision — prefer `Math.floor(result.totalPayout * 4 / 5)` or integer arithmetic to avoid any FP edge case. [L16] |

### Suggestions

- Add JSDoc to all three public exports to surface the ADR semantics at the declaration site.
  ```typescript
  // Before
  export abstract class SpinStrategy {
    abstract adjustPayout(result: SpinResult): SpinResult;
  }
  // After
  /**
   * Extension point for post-calculation payout adjustment.
   * Implement this class to apply market-specific or volatility-specific
   * payout policies without modifying engine.ts (see ADR-003).
   */
  export abstract class SpinStrategy {
    /** Returns a (possibly modified) copy of `result` with adjusted payout fields. */
    abstract adjustPayout(result: SpinResult): SpinResult;
  }
  ```
- Use `Readonly<SpinResult>` on the parameter to express immutability intent and prevent accidental mutation.
  - Before: `adjustPayout(result: SpinResult): SpinResult`
  - After: `adjustPayout(result: Readonly<SpinResult>): SpinResult`
- Replace float-factor multiplication with integer arithmetic for deterministic payout precision in regulated gaming context.
  - Before: `totalPayout: Math.floor(result.totalPayout * 0.8),`
  - After: `totalPayout: Math.floor(result.totalPayout * 4 / 5),`

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ConservativeStrategy` is exported but unused (`ConservativeStrategy`) [L13-L20]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
