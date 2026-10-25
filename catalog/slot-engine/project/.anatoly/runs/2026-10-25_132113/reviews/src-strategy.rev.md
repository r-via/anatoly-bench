# Review: `src/strategy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SpinStrategy | class | yes | OK | ACCEPTABLE | USED | UNIQUE | - | 85% |
| DefaultStrategy | class | yes | OK | LEAN | USED | UNIQUE | - | 90% |
| ConservativeStrategy | class | yes | OK | ACCEPTABLE | DEAD | UNIQUE | - | 78% |

### Details

#### `SpinStrategy` (L3–L5)

- **Utility [USED]**: Transitively used by DefaultStrategy
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Abstract base class with a single abstract method; no logic to be wrong.
- **Overengineering [ACCEPTABLE]**: Abstract base with one method, used as a strategy contract by two implementations. A plain function type or interface would suffice, but a strategy seam for payout adjustment is justified.
- **Tests [-]**: *(not evaluated)*

#### `DefaultStrategy` (L7–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Identity pass-through; returns the result unchanged as expected.
- **Overengineering [LEAN]**: No-op identity implementation. Used by the engine as the default strategy. Minimal.
- **Tests [-]**: *(not evaluated)*

#### `ConservativeStrategy` (L13–L20)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Applies a 0.8 multiplier and floors the payout. Rounding down is the correct direction for slot payouts. The spread preserves the other SpinResult fields. The class has no importers, which is a Utility-axis matter, not a correction defect.
- **Overengineering [ACCEPTABLE]**: Has 0 importers, so it is currently unused. Its implementation is a simple 0.8 payout multiplier, with a hard-coded magic number. It is a small speculative variant, not complex.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Parameter and return types use SpinResult without Readonly; the 0.8 multiplier is an inline literal rather than a named const. [L13-L16] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | All three exports (SpinStrategy, DefaultStrategy, ConservativeStrategy) lack JSDoc. The 0.8 factor and flooring behavior are undocumented. [L3-L20] |
| 17 | Context-adapted rules | WARN | MEDIUM | Abstract class with a single method and no state could be a function type/interface. The 0.8 payout factor is hard-coded, so ConservativeStrategy cannot be configured without subclassing. |

### Suggestions

- Document the exports and extract the magic factor into a named constant.
  ```typescript
  // Before
  export class ConservativeStrategy extends SpinStrategy {
    adjustPayout(result: SpinResult): SpinResult {
      return { ...result, totalPayout: Math.floor(result.totalPayout * 0.8) };
    }
  }
  // After
  const CONSERVATIVE_PAYOUT_FACTOR = 0.8;
  
  /** Reduces the total payout by 20%, rounding down. */
  export class ConservativeStrategy extends SpinStrategy {
    adjustPayout(result: SpinResult): SpinResult {
      return { ...result, totalPayout: Math.floor(result.totalPayout * CONSERVATIVE_PAYOUT_FACTOR) };
    }
  }
  ```

## Actions

### Refactors

- **[utility · medium · trivial]** Remove dead code: `ConservativeStrategy` is exported but unused (`ConservativeStrategy`) [L13-L20]
