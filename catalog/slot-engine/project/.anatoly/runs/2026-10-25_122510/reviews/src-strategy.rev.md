# Review: `src/strategy.ts`

**Verdict:** NEEDS_REFACTOR

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
- **Correction [OK]**: Abstract base; no logic.
- **Overengineering [ACCEPTABLE]**: Abstract base with one method; justified by two concrete strategies, though a plain function type/interface would suffice.
- **Tests [-]**: *(not evaluated)*

#### `DefaultStrategy` (L7–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Identity pass-through; correct.
- **Overengineering [ACCEPTABLE]**: Identity pass-through; used by spin in engine.ts as the default strategy. Small and justified.
- **Tests [-]**: *(not evaluated)*

#### `ConservativeStrategy` (L13–L20)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Floors payout scaled by 0.8 (rounds down, correct for payouts); returns a new object without mutating input. Unused, which is a Utility concern.
- **Overengineering [OVER]**: No importers; speculative alternative strategy. With DefaultStrategy as the sole used implementation, the strategy hierarchy is premature abstraction.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Parameter type is mutable SpinResult; the strategy returns the same instance in DefaultStrategy. Use Readonly<SpinResult> for input to signal no mutation. [L4-L10] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Three exported classes lack JSDoc. The 0.8 magic factor in ConservativeStrategy is undocumented. [L3-L20] |

### Suggestions

- Add JSDoc and name the payout factor as a constant
  ```typescript
  // Before
  totalPayout: Math.floor(result.totalPayout * 0.8),
  // After
  const CONSERVATIVE_PAYOUT_FACTOR = 0.8;
  // ...
  totalPayout: Math.floor(result.totalPayout * CONSERVATIVE_PAYOUT_FACTOR),
  ```
- Mark input as readonly
  - Before: `abstract adjustPayout(result: SpinResult): SpinResult;`
  - After: `abstract adjustPayout(result: Readonly<SpinResult>): SpinResult;`

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ConservativeStrategy` is exported but unused (`ConservativeStrategy`) [L13-L20]
