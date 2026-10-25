# Review: `src/strategy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SpinStrategy | class | yes | OK | ACCEPTABLE | USED | UNIQUE | - | 80% |
| DefaultStrategy | class | yes | OK | ACCEPTABLE | USED | UNIQUE | - | 82% |
| ConservativeStrategy | class | yes | OK | - | DEAD | UNIQUE | - | 80% |

### Details

#### `SpinStrategy` (L3–L5)

- **Utility [USED]**: Transitively used by DefaultStrategy
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Abstract base class with a single abstract method; no correctness issues.
- **Overengineering [ACCEPTABLE]**: Abstract base with one method and two implementations. Justified as a strategy seam, though a function type would suffice.
- **Tests [-]**: *(not evaluated)*

#### `DefaultStrategy` (L7–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Identity pass-through; matches the default behavior.
- **Overengineering [ACCEPTABLE]**: Identity no-op implementation, used by spin() as the default. A class hierarchy for a pass-through is slightly heavy, but it is a valid null-object strategy.
- **Tests [-]**: *(not evaluated)*

#### `ConservativeStrategy` (L13–L20)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Applies Math.floor(totalPayout * 0.8). Rounding down is the correct direction for payouts. No documented contract for the 0.8 factor, and it has no importers (a Utility matter, not correction).
- **Overengineering [OVER]**: No importers or consumers. Speculative alternative strategy with a hardcoded 0.8 factor, built for a variation nothing uses.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `adjustPayout` takes a mutable `SpinResult`. The magic number 0.8 is inline instead of a named `as const`/readonly constant. Returns a new object rather than mutating, which is good. [L13-L16] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | `SpinStrategy`, `DefaultStrategy` and `ConservativeStrategy` are exported without JSDoc. The 0.8 payout reduction is undocumented. [L3-L20] |
| 15 | Testability | WARN | MEDIUM | `ConservativeStrategy` hardcodes the 0.8 factor, so it cannot be configured or injected. Tests can only use the fixed value. [L13-L16] |

### Suggestions

- Add JSDoc and extract the magic number into a named, configurable constant
  ```typescript
  // Before
  export class ConservativeStrategy extends SpinStrategy {
    adjustPayout(result: SpinResult): SpinResult {
      return { ...result, totalPayout: Math.floor(result.totalPayout * 0.8) };
    }
  }
  // After
  const CONSERVATIVE_PAYOUT_FACTOR = 0.8 as const;
  
  /** Reduces the total payout to 80% (floored). */
  export class ConservativeStrategy extends SpinStrategy {
    constructor(private readonly factor: number = CONSERVATIVE_PAYOUT_FACTOR) {
      super();
    }
    adjustPayout(result: Readonly<SpinResult>): SpinResult {
      return { ...result, totalPayout: Math.floor(result.totalPayout * this.factor) };
    }
  }
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ConservativeStrategy` is exported but unused (`ConservativeStrategy`) [L13-L20]
