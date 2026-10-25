# Review: `src/strategy.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SpinStrategy | class | yes | OK | ACCEPTABLE | USED | UNIQUE | - | 82% |
| DefaultStrategy | class | yes | OK | ACCEPTABLE | USED | UNIQUE | - | 85% |
| ConservativeStrategy | class | yes | OK | - | DEAD | UNIQUE | - | 80% |

### Details

#### `SpinStrategy` (L3–L5)

- **Utility [USED]**: Transitively used by DefaultStrategy
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Abstract base class with a single abstract method; no defects.
- **Overengineering [ACCEPTABLE]**: Abstract base with one method, two implementations. Justified as a strategy seam, though an interface or function type would suffice.
- **Tests [-]**: *(not evaluated)*

#### `DefaultStrategy` (L7–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Identity pass-through; correct for a default strategy.
- **Overengineering [ACCEPTABLE]**: Identity no-op strategy used by spin() as the default. Small and justified as a null-object implementation.
- **Tests [-]**: *(not evaluated)*

#### `ConservativeStrategy` (L13–L20)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Applies Math.floor to payout * 0.8, so it rounds down, which is correct for slot payouts. It returns a new object and leaves the input unmodified. The class has no importers, which is a Utility-axis matter.
- **Overengineering [OVER]**: 0 importers. Speculative alternative strategy with a hardcoded 0.8 multiplier and no consumer.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `adjustPayout` takes a mutable `SpinResult`. `readonly`/`Readonly<SpinResult>` would document that the strategy returns a new object and does not mutate its input. The code does not mutate the input. The `0.8` factor is an inline magic number. [L4-L19] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | No JSDoc on any of the 3 exports. `ConservativeStrategy` has a non-obvious contract: it applies a 0.8 multiplier and floors the result, which the name does not reveal. `SpinStrategy.adjustPayout` has no documented contract either. The other exports have self-describing names. [L3-L19] |
| 17 | Context-adapted rules | WARN | MEDIUM | Money-related code uses a hard-coded 0.8 float multiplier. `Math.floor(x * 0.8)` can lose a unit through floating-point error, for example when `x * 0.8` lands just below an integer. A named constant, or integer math such as `Math.floor((x * 4) / 5)`, would be safer and clearer. This is a mild practice concern, not a primitive-choice failure. [L15-L15] |

### Suggestions

- Add JSDoc and extract the magic number, using integer math to avoid float drift
  ```typescript
  // Before
  export class ConservativeStrategy extends SpinStrategy {
    adjustPayout(result: SpinResult): SpinResult {
      return { ...result, totalPayout: Math.floor(result.totalPayout * 0.8) };
    }
  }
  // After
  /** Reduces the payout to 80% of its value, rounded down to a whole unit. */
  export class ConservativeStrategy extends SpinStrategy {
    adjustPayout(result: Readonly<SpinResult>): SpinResult {
      return { ...result, totalPayout: Math.floor((result.totalPayout * 4) / 5) };
    }
  }
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ConservativeStrategy` is exported but unused (`ConservativeStrategy`) [L13-L20]
