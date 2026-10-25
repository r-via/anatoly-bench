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
- **Correction [OK]**: Abstract base class with a single abstract method; no logic to fail.
- **Overengineering [ACCEPTABLE]**: Abstract base with one method, two implementations. Strategy pattern is mild for two payout variants, but a base contract for an injectable strategy is justified.
- **Tests [-]**: *(not evaluated)*

#### `DefaultStrategy` (L7–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Identity pass-through; matches the contract.
- **Overengineering [LEAN]**: Identity no-op implementation, used by spin in engine.ts as the default.
- **Tests [-]**: *(not evaluated)*

#### `ConservativeStrategy` (L13–L20)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Applies Math.floor(totalPayout * 0.8), which rounds payouts down as industry convention requires. It has no importers, so unused-code is a Utility-axis matter. The fixed 0.8 factor has no stated contract.
- **Overengineering [ACCEPTABLE]**: Small and simple, but has 0 importers. It is an unused alternative strategy, though the cost is minimal.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `adjustPayout` takes a mutable `SpinResult`. Use `Readonly<SpinResult>` or `readonly` fields to signal the input is not mutated. The 0.8 magic number is inline and could be a `private readonly` constant. [L4-L19] |
| 6 | Interface vs Type | WARN | MEDIUM | Abstract class defines a pure behavioural contract. An interface would be lighter and easier to mock, but this is a stylistic choice. [L3-L5] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` have no JSDoc. The 0.8 payout factor and floor rounding are undocumented. [L3-L19] |

### Suggestions

- Add JSDoc and extract the magic number.
  ```typescript
  // Before
  export class ConservativeStrategy extends SpinStrategy {
    adjustPayout(result: SpinResult): SpinResult {
      return { ...result, totalPayout: Math.floor(result.totalPayout * 0.8) };
    }
  }
  // After
  /** Reduces payouts to 80%, rounded down to whole credits. */
  export class ConservativeStrategy extends SpinStrategy {
    private static readonly PAYOUT_FACTOR = 0.8;
    override adjustPayout(result: Readonly<SpinResult>): SpinResult {
      return { ...result, totalPayout: Math.floor(result.totalPayout * ConservativeStrategy.PAYOUT_FACTOR) };
    }
  }
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ConservativeStrategy` is exported but unused (`ConservativeStrategy`) [L13-L20]
