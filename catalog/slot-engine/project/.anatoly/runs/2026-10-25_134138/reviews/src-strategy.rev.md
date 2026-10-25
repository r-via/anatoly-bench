# Review: `src/strategy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SpinStrategy | class | yes | OK | ACCEPTABLE | USED | UNIQUE | - | 85% |
| DefaultStrategy | class | yes | OK | LEAN | USED | UNIQUE | - | 90% |
| ConservativeStrategy | class | yes | OK | ACCEPTABLE | DEAD | UNIQUE | - | 80% |

### Details

#### `SpinStrategy` (L3–L5)

- **Utility [USED]**: Transitively used by DefaultStrategy
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Abstract base class with a single abstract method; no defects.
- **Overengineering [ACCEPTABLE]**: Abstract base with one method, two implementations. Strategy pattern is mildly heavy; a function type would suffice, but the base class is a legitimate extension point.
- **Tests [-]**: *(not evaluated)*

#### `DefaultStrategy` (L7–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Identity pass-through; no defects.
- **Overengineering [LEAN]**: Identity no-op implementation, used by engine.ts spin. Minimal.
- **Tests [-]**: *(not evaluated)*

#### `ConservativeStrategy` (L13–L20)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Applies 0.8 multiplier and floors the payout, which is the correct rounding direction for slot payouts. No importers is a Utility concern, not a correctness defect. The unit is unknown, so no basis to flag the 0.8 factor.
- **Overengineering [ACCEPTABLE]**: Small and simple, but has 0 importers (unused). Speculative alternative strategy, though it is only a few lines.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `adjustPayout` takes a mutable `SpinResult` and returns a new object without mutating input (good). Parameter could be `Readonly<SpinResult>`. The 0.8 factor is a magic number. [L4-L19] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Three exports have no JSDoc. `ConservativeStrategy` has a non-obvious contract: it applies a 0.8 multiplier and floors the result. The abstract contract (pure, non-mutating) is also undocumented. Names and signatures are mostly self-describing, so this is WARN, not FAIL. [L3-L19] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot/gaming payout domain inferred from SpinResult and totalPayout. The 0.8 factor is hard-coded, so the RTP adjustment can't be configured or audited. `DefaultStrategy` and `ConservativeStrategy` have no constructor options. Making the factor a constructor parameter would help. [L13-L19] |

### Suggestions

- Document the strategy contract and make the payout factor configurable
  ```typescript
  // Before
  export class ConservativeStrategy extends SpinStrategy {
    adjustPayout(result: SpinResult): SpinResult {
      return { ...result, totalPayout: Math.floor(result.totalPayout * 0.8) };
    }
  }
  // After
  /** Scales totalPayout by `factor` (default 0.8), rounding down to an integer. Does not mutate input. */
  export class ConservativeStrategy extends SpinStrategy {
    constructor(private readonly factor = 0.8) { super(); }
    adjustPayout(result: Readonly<SpinResult>): SpinResult {
      return { ...result, totalPayout: Math.floor(result.totalPayout * this.factor) };
    }
  }
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ConservativeStrategy` is exported but unused (`ConservativeStrategy`) [L13-L20]
