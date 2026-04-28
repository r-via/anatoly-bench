# Review: `src/strategy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SpinStrategy | class | yes | OK | LEAN | USED | UNIQUE | - | 90% |
| DefaultStrategy | class | yes | OK | LEAN | USED | UNIQUE | - | 90% |
| ConservativeStrategy | class | yes | OK | LEAN | DEAD | UNIQUE | - | 90% |

### Details

#### `SpinStrategy` (L3–L5)

- **Utility [USED]**: Transitively used by DefaultStrategy
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Abstract base class is structurally correct; single abstract method with matching signature.
- **Overengineering [LEAN]**: Abstract base class is explicitly justified by ADR-003 (.anatoly/docs/02-Architecture/04-Design-Decisions.md): the strategy pattern decouples payout policy from engine.ts computation, and the extension point is documented as a public API for library consumers to subclass with custom rules (e.g. BonusRoundStrategy in Advanced-Configuration.md). Zero external importers is expected for a base class whose value is in being extended, not imported directly.
- **Tests [-]**: *(not evaluated)*

#### `DefaultStrategy` (L7–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Pass-through implementation matches documented behavior exactly (ADR-003, 03-Configuration.md).
- **Overengineering [LEAN]**: Pass-through implementation is minimal and intentional. ADR-003 explicitly states 'DefaultStrategy makes the no-adjustment case explicit rather than relying on a missing-strategy check', which is a sound design choice that avoids a null/undefined guard branch in engine.ts. Single importer is appropriate for a shipped default.
- **Tests [-]**: *(not evaluated)*

#### `ConservativeStrategy` (L13–L20)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Math.floor(result.totalPayout * 0.8) matches the documented 80% floor formula verbatim across all three reference pages (ADR-003, 03-Configuration.md, 02-Advanced-Configuration.md).
- **Overengineering [LEAN]**: Two-line body applying a documented 0.8× floor is as minimal as it can be. ADR-003 and Configuration.md both document this as one of the two strategies shipped with the library for market-specific lower-volatility contexts. Zero runtime importers is consistent with it being an opt-in library export rather than an always-active component.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | All three exported symbols — SpinStrategy, DefaultStrategy, and ConservativeStrategy — are public API extension points documented extensively in .anatoly/docs/ but carry zero JSDoc in source. At minimum, SpinStrategy needs a contract description for implementors and ConservativeStrategy needs to document the 0.8× reduction and its RTP consequence (noted in ADR-003). [L3-L20] |
| 13 | Security | WARN | HIGH | Slot-engine/regulated gambling domain inferred from project vocabulary: spin(), reels.ts, jackpot.ts, rng.ts, and an explicit 95% RTP target in ADR-003. ConservativeStrategy computes Math.floor(result.totalPayout * 0.8). IEEE 754 cannot represent 0.8 exactly (stored as ~0.79999999999999995559), introducing a theoretical precision risk in regulated payout calculations. Math.floor provides partial mitigation and ADR-003 explicitly documents this pattern as intentional, reducing severity from FAIL to WARN. Consider integer-safe arithmetic: Math.floor(result.totalPayout * 4 / 5), or a Decimal library for full compliance. [L17] |

### Suggestions

- Add JSDoc to all three exported classes. SpinStrategy needs a contract description for implementors; ConservativeStrategy should document the 0.8× factor and its RTP consequence per ADR-003.
  ```typescript
  // Before
  export abstract class SpinStrategy {
    abstract adjustPayout(result: SpinResult): SpinResult;
  }
  
  export class DefaultStrategy extends SpinStrategy {
    adjustPayout(result: SpinResult): SpinResult {
      return result;
    }
  }
  
  export class ConservativeStrategy extends SpinStrategy {
    adjustPayout(result: SpinResult): SpinResult {
      return {
        ...result,
        totalPayout: Math.floor(result.totalPayout * 0.8),
      };
    }
  }
  // After
  /**
   * Extension point for post-calculation payout adjustment.
   * Subclass this to apply custom payout policies without modifying
   * the core calculation engine. Implementations MUST be pure:
   * they must not mutate `result` and must return a new SpinResult.
   */
  export abstract class SpinStrategy {
    /** Returns a (possibly modified) copy of the computed SpinResult. */
    abstract adjustPayout(result: SpinResult): SpinResult;
  }
  
  /** Pass-through strategy — returns the computed result unchanged. */
  export class DefaultStrategy extends SpinStrategy {
    adjustPayout(result: SpinResult): SpinResult {
      return result;
    }
  }
  
  /**
   * Reduces totalPayout to 80 % of the computed value (floored).
   * Note: activating this strategy reduces effective RTP below the 95 % target
   * documented in ADR-003. Callers must be aware of which strategy is active.
   */
  export class ConservativeStrategy extends SpinStrategy {
    adjustPayout(result: SpinResult): SpinResult {
      return {
        ...result,
        totalPayout: Math.floor(result.totalPayout * 0.8),
      };
    }
  }
  ```
- Replace the inexact IEEE 754 literal 0.8 with integer-safe arithmetic to eliminate theoretical precision risk in a regulated gambling context. For full compliance, a Decimal library (e.g. decimal.js) is the gold standard.
  ```typescript
  // Before
  totalPayout: Math.floor(result.totalPayout * 0.8),
  // After
  // Integer-safe: multiply by 4 first (exact), then divide by 5
  totalPayout: Math.floor((result.totalPayout * 4) / 5),
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ConservativeStrategy` is exported but unused (`ConservativeStrategy`) [L13-L20]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `ConservativeStrategy` (`ConservativeStrategy`) [L13-L20]
