# Review: `src/strategy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SpinStrategy | class | yes | OK | ACCEPTABLE | USED | UNIQUE | NONE | 80% |
| DefaultStrategy | class | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| ConservativeStrategy | class | yes | OK | - | DEAD | UNIQUE | - | 85% |

### Details

#### `SpinStrategy` (L3–L5)

- **Utility [USED]**: Transitively used by DefaultStrategy
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Abstract base class with a single abstract method — no logic to evaluate.
- **Overengineering [ACCEPTABLE]**: Abstract base for the strategy extension point documented as the intended pattern in Code Conventions. Flagged only ACCEPTABLE rather than LEAN because the engine hardcodes DefaultStrategy and swapping requires forking engine.ts, making the abstraction non-injectable at runtime — a design gap that reduces its value.
- **Tests [NONE]**: Abstract base class with no test file found.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The abstract class and the contract of `adjustPayout` (what it receives, what it must return, when/why it is called) are not described anywhere inline.

#### `DefaultStrategy` (L7–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Identity pass-through; returns result unchanged as documented.
- **Overengineering [LEAN]**: Minimal identity pass-through. Has 1 real importer (the engine). No excess complexity.
- **Tests [NONE]**: No test file found. Used by src/engine.ts but adjustPayout (identity return) has no coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The identity/pass-through behaviour is implicit from the code but not documented for consumers of the public API.

#### `ConservativeStrategy` (L13–L20)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Math.floor(totalPayout * 0.8) correctly reduces payout to 80% with downward rounding, matching documented behavior and slot-domain convention (house keeps remainder). IEEE 754 double arithmetic for small integer totalPayout values does not produce floor-crossing errors here.
- **Overengineering [OVER]**: 0 importers. Wraps a single Math.floor expression in a full class. Could be a plain function or removed entirely until a consumer exists. Premature concretization of a strategy that nothing uses.
- **Tests [NONE]**: No test file found. The 0.8 multiplier + Math.floor behavior is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The 80% floor reduction and the rationale for that multiplier are undocumented; this is non-obvious behaviour that warrants explanation.

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 8 | ESLint compliance | WARN | MEDIUM | Bare numeric literal 0.8 on L14 violates no-magic-numbers. Should be extracted as a named constant. [L14] |
| 13 | Security | WARN | HIGH | Slot-machine domain inferred from SpinResult/jackpotHit/totalPayout/reel vocabulary. ConservativeStrategy applies floating-point multiplication (totalPayout * 0.8) on what the arbitrated README defines as integer coin values. Math.floor mitigates immediate precision risk, but regulated gaming audits require deterministic integer arithmetic — floating-point intermediates are non-compliant. Prefer integer multiplication then integer division: Math.floor(totalPayout * 4 / 5). [L14] |
| 17 | Context-adapted rules | WARN | MEDIUM | ConservativeStrategy hardcodes the 0.8 reduction factor with no constructor parameter. In a regulated gaming engine, payout strategies should accept configurable factors to support varying RTP targets without requiring new subclasses. The current design forces subclassing for any other reduction ratio. [L11-L19] |

### Suggestions

- Replace magic literal 0.8 with a named readonly property and use integer arithmetic for regulated gaming compliance
  ```typescript
  // Before
  export class ConservativeStrategy extends SpinStrategy {
    adjustPayout(result: SpinResult): SpinResult {
      return {
        ...result,
        totalPayout: Math.floor(result.totalPayout * 0.8),
      };
    }
  }
  // After
  export class ConservativeStrategy extends SpinStrategy {
    constructor(
      private readonly numerator: number = 4,
      private readonly denominator: number = 5,
    ) {
      super();
    }
  
    adjustPayout(result: SpinResult): SpinResult {
      return {
        ...result,
        totalPayout: Math.floor((result.totalPayout * this.numerator) / this.denominator),
      };
    }
  }
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ConservativeStrategy` is exported but unused (`ConservativeStrategy`) [L13-L20]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
- **[overengineering · medium · small]** Simplify: `ConservativeStrategy` is over-engineered (`ConservativeStrategy`) [L13-L20]
