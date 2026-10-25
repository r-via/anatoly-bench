# Review: `src/strategy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SpinStrategy | class | yes | OK | ACCEPTABLE | USED | UNIQUE | - | 82% |
| DefaultStrategy | class | yes | OK | ACCEPTABLE | USED | UNIQUE | - | 85% |
| ConservativeStrategy | class | yes | OK | ACCEPTABLE | DEAD | UNIQUE | - | 78% |

### Details

#### `SpinStrategy` (L3–L5)

- **Utility [USED]**: Transitively used by DefaultStrategy
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Abstract base class with a single abstract method; no logic to be incorrect.
- **Overengineering [ACCEPTABLE]**: Abstract base with one method and two implementations; strategy pattern is lightweight and justified as an extension point, though an interface or function type would suffice.
- **Tests [-]**: *(not evaluated)*

#### `DefaultStrategy` (L7–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Identity pass-through returning the result unchanged; matches the default-strategy contract.
- **Overengineering [ACCEPTABLE]**: Identity pass-through used by spin() as the default; small, serves as null-object for the strategy hook.
- **Tests [-]**: *(not evaluated)*

#### `ConservativeStrategy` (L13–L20)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Applies 0.8 multiplier with Math.floor, which rounds payout down (correct direction for slot payouts). No documented target contradicts the 0.8 factor. It only adjusts totalPayout, and no visible contract says other payout fields must stay consistent. The class has no importers, which is a Utility-axis matter.
- **Overengineering [ACCEPTABLE]**: Zero importers, so currently speculative, but trivial (one-line payout scaling) and a plausible alternative strategy; low cost.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 6 | Interface vs Type | WARN | MEDIUM | Abstract class with a single abstract method used as a strategy contract; an interface would suffice and be lighter. Minor. [L3-L5] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | SpinStrategy, DefaultStrategy, and ConservativeStrategy are exported without JSDoc. Behavior of the 0.8 factor and floor rounding is undocumented. [L3-L20] |
| 17 | Context-adapted rules | WARN | MEDIUM | Hard-coded 0.8 multiplier in ConservativeStrategy should be a named constant or constructor parameter. Methods could be marked override-explicit under noImplicitOverride. [L14-L19] |

### Suggestions

- Add JSDoc and extract the magic multiplier into a named, injectable constant
  ```typescript
  // Before
  export class ConservativeStrategy extends SpinStrategy {
    adjustPayout(result: SpinResult): SpinResult {
      return { ...result, totalPayout: Math.floor(result.totalPayout * 0.8) };
    }
  }
  // After
  const CONSERVATIVE_FACTOR = 0.8;
  
  /** Reduces payouts by 20%, rounded down. */
  export class ConservativeStrategy extends SpinStrategy {
    override adjustPayout(result: SpinResult): SpinResult {
      return { ...result, totalPayout: Math.floor(result.totalPayout * CONSERVATIVE_FACTOR) };
    }
  }
  ```
- Use an interface for the strategy contract
  ```typescript
  // Before
  export abstract class SpinStrategy {
    abstract adjustPayout(result: SpinResult): SpinResult;
  }
  // After
  export interface SpinStrategy {
    adjustPayout(result: SpinResult): SpinResult;
  }
  ```

## Actions

### Refactors

- **[utility · medium · trivial]** Remove dead code: `ConservativeStrategy` is exported but unused (`ConservativeStrategy`) [L13-L20]
