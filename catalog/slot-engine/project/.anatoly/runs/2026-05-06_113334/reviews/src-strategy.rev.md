# Review: `src/strategy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SpinStrategy | class | yes | OK | ACCEPTABLE | USED | UNIQUE | NONE | 78% |
| DefaultStrategy | class | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| ConservativeStrategy | class | yes | OK | ACCEPTABLE | DEAD | UNIQUE | - | 72% |

### Details

#### `SpinStrategy` (L3–L5)

- **Utility [USED]**: Transitively used by DefaultStrategy
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Abstract base class is correctly defined with a single abstract method.
- **Overengineering [ACCEPTABLE]**: Abstract class with a single abstract method is a pattern that TypeScript interfaces handle more leanly — `interface SpinStrategy { adjustPayout(result: SpinResult): SpinResult }` would be strictly equivalent with no runtime overhead. That said, ADR-003 (.anatoly/docs/02-Architecture/04-Design-Decisions.md) explicitly documents the strategy pattern and its extensibility rationale, making the structural choice defensible. The 0-direct-importer count is expected for a base class consumed only via subclassing, so it is not an independent red flag here.
- **Tests [NONE]**: Abstract base class with no test file found. No tests exist for this symbol or its contract.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment present. As the public abstract base class defining the extension contract for payout adjustment, it warrants at minimum a description of its purpose, the strategy pattern intent, and guidance on how consumers should subclass it.

#### `DefaultStrategy` (L7–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Pass-through implementation correctly returns the result unchanged, matching documented behaviour in ADR-003.
- **Overengineering [LEAN]**: Simple pass-through implementation with 1 importer. ADR-003 explicitly justifies its existence: making the no-adjustment case explicit rather than relying on a null/undefined strategy guard in engine.ts. The implementation is minimal and appropriate.
- **Tests [NONE]**: No test file found. DefaultStrategy is imported by src/engine.ts, making it a critical code path, but there are zero tests verifying that adjustPayout returns the result unchanged (identity behavior).
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment present. While the pass-through behavior is inferrable from the implementation, there is no documentation clarifying that this is the no-op/identity strategy intended as the baseline when no payout adjustment is desired.

#### `ConservativeStrategy` (L13–L20)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Applies Math.floor(totalPayout * 0.8) exactly as documented in ADR-003; the RTP reduction is a known and accepted consequence per the design decision.
- **Overengineering [ACCEPTABLE]**: 0 runtime importers is a meaningful concern — the class is shipped but apparently unused within the project. The implementation itself is trivially simple (a single arithmetic expression). However, ADR-003 (.anatoly/docs/02-Architecture/04-Design-Decisions.md) explicitly lists ConservativeStrategy as part of the two strategies that 'ship with the library', implying it is intended for external consumers rather than internal wiring. Absent that ADR, 0 internal importers plus a dedicated concrete class would read as OVER.
- **Tests [NONE]**: No test file found. The 0.8 payout reduction logic and Math.floor truncation behavior are entirely untested, including edge cases like zero payouts, fractional results, and negative values.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment present. The 0.8× multiplier applied to totalPayout is a non-obvious, business-critical constant (effectively reducing RTP by 20%). This behavior requires documentation explaining the multiplier rationale, the use-case context (e.g. lower-volatility markets), and the consequence that effective RTP diverges from the engine's baseline target.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | The `result` parameter in all `adjustPayout` overrides is mutable. Marking it as `Readonly<SpinResult>` would communicate that strategies must not mutate input, which is the clear intent (ConservativeStrategy spreads rather than mutates). [L8-L19] |
| 9 | JSDoc on public exports | WARN | MEDIUM | All three exported symbols (`SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy`) are public API surface and lack JSDoc. For a library consumed externally, callers need to understand the 0.8× RTP impact of ConservativeStrategy in particular, as noted in ADR-003. [L3-L20] |
| 13 | Security | WARN | MEDIUM | Gambling/casino domain confirmed by ADR-003 (RTP target, payout adjustment vocabulary). `result.totalPayout * 0.8` uses IEEE 754 floating-point multiplication; `0.8` has no exact binary representation. `Math.floor()` provides deterministic truncation, which mitigates practical precision drift for integer-credit payouts. No hardcoded secrets, no eval, no Math.random() in this file (RNG is isolated to rng.ts). Concern is low-severity given the floor guard and that totalPayout is likely an integer credit value. [L16] |

### Suggestions

- Add JSDoc to all three exported classes so API consumers understand the payout semantics, especially the RTP impact of ConservativeStrategy.
  ```typescript
  // Before
  export abstract class SpinStrategy {
    abstract adjustPayout(result: SpinResult): SpinResult;
  }
  // After
  /**
   * Base class for post-calculation payout adjustment strategies.
   * Subclass and inject via EngineContainer to apply custom payout policies.
   */
  export abstract class SpinStrategy {
    /** Adjusts the computed payout in `result` and returns the modified SpinResult. */
    abstract adjustPayout(result: SpinResult): SpinResult;
  }
  ```
- Mark the `result` parameter as `Readonly<SpinResult>` in all strategy methods to enforce that strategies must not mutate the input object.
  - Before: `adjustPayout(result: SpinResult): SpinResult {`
  - After: `adjustPayout(result: Readonly<SpinResult>): SpinResult {`
- In a regulated gambling context, consider replacing floating-point 0.8 multiplication with integer arithmetic to guarantee bit-exact payout calculations and avoid IEEE 754 edge cases.
  - Before: `totalPayout: Math.floor(result.totalPayout * 0.8),`
  - After: `totalPayout: Math.floor((result.totalPayout * 4) / 5),`

## Actions

### Refactors

- **[utility · medium · trivial]** Remove dead code: `ConservativeStrategy` is exported but unused (`ConservativeStrategy`) [L13-L20]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
