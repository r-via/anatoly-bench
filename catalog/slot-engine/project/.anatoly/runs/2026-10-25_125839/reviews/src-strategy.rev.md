# Review: `src/strategy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SpinStrategy | class | yes | OK | ACCEPTABLE | USED | UNIQUE | - | 82% |
| DefaultStrategy | class | yes | OK | LEAN | USED | UNIQUE | - | 88% |
| ConservativeStrategy | class | yes | OK | ACCEPTABLE | DEAD | UNIQUE | - | 78% |

### Details

#### `SpinStrategy` (L3–L5)

- **Utility [USED]**: Transitively used by DefaultStrategy
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Abstract base class with a single abstract method; no defects.
- **Overengineering [ACCEPTABLE]**: Abstract base with one method, two implementations. Reasonable strategy seam for payout adjustment, though an interface or function type would suffice.
- **Tests [-]**: *(not evaluated)*

#### `DefaultStrategy` (L7–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Identity pass-through; consistent with the base contract.
- **Overengineering [LEAN]**: Identity pass-through; used by spin in engine.ts. Minimal.
- **Tests [-]**: *(not evaluated)*

#### `ConservativeStrategy` (L13–L20)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Applies 0.8 multiplier with Math.floor, which rounds payouts down. The spread keeps other fields unchanged. Nothing contradicts the 0.8 factor, and no contract is stated for it.
- **Overengineering [ACCEPTABLE]**: Has 0 importers (unused), but implementation is a trivial 8-line payout scaling. The unused variant is speculative, with the 0.8 factor hardcoded.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | adjustPayout takes a mutable SpinResult. Use Readonly<SpinResult> to make the non-mutation contract explicit. The 0.8 magic number is also inline instead of a readonly constant. [L4-L19] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | SpinStrategy, DefaultStrategy and ConservativeStrategy are exported with no JSDoc. ConservativeStrategy applies a non-obvious 20% payout reduction that needs documenting. [L3-L19] |

### Suggestions

- Add JSDoc to the exported strategy classes and document the payout factor
  ```typescript
  // Before
  export class ConservativeStrategy extends SpinStrategy {
  // After
  /** Reduces each spin's total payout to 80%, rounded down to an integer. */
  export class ConservativeStrategy extends SpinStrategy {
  ```
- Use integer arithmetic for the payout factor and take a readonly input
  - Before: `totalPayout: Math.floor(result.totalPayout * 0.8),`
  - After: `totalPayout: Math.floor((result.totalPayout * 4) / 5),`

## Actions

### Refactors

- **[utility · medium · trivial]** Remove dead code: `ConservativeStrategy` is exported but unused (`ConservativeStrategy`) [L13-L20]
