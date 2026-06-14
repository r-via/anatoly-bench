# Review: `src/strategy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SpinStrategy | class | yes | OK | ACCEPTABLE | USED | UNIQUE | NONE | 75% |
| DefaultStrategy | class | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| ConservativeStrategy | class | yes | OK | LEAN | DEAD | UNIQUE | - | 90% |

### Details

#### `SpinStrategy` (L3–L5)

- **Utility [USED]**: Transitively used by DefaultStrategy
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Abstract base class with no logic to evaluate.
- **Overengineering [ACCEPTABLE]**: Abstract class with single abstract method is validated as the documented extension point by Code Conventions (shows JackpotBoostStrategy as 'correctly structured strategy extension') and Advanced Configuration guide. However, 0 importers and engine hardcoding DefaultStrategy means the abstraction never provides polymorphic dispatch — callers can't swap strategies without forking engine.ts. Pattern is intentional per docs but architecturally undercut by the engine's implementation.
- **Tests [NONE]**: Abstract base class with no test file found.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Abstract base class with no description of its role in the payout pipeline, what implementors must guarantee, or extension contract for `adjustPayout`.

#### `DefaultStrategy` (L7–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Identity pass-through matches documented behavior.
- **Overengineering [LEAN]**: Identity pass-through, single method, no complexity.
- **Tests [NONE]**: No test file found. Used by src/engine.ts but adjustPayout (identity function) is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. 'Default' is ambiguous without a comment stating this is an identity pass-through that leaves `SpinResult` unchanged.

#### `ConservativeStrategy` (L13–L20)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Math.floor(totalPayout * 0.8) matches the explicitly documented formula. IEEE 754 representation of 0.8 is slightly above the exact value, so integer inputs do not underfloor. Leaving lineWins unchanged is explicitly documented as the intended behavior.
- **Overengineering [LEAN]**: One-liner Math.floor reduction via spread. Implementation is minimal; 0 importers is a usage concern, not overengineering in the implementation itself.
- **Tests [NONE]**: No test file found. The 0.8 multiplier with Math.floor truncation has no coverage for rounding edge cases or zero/negative payouts.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The 80% floor multiplier applied to `totalPayout` is a non-obvious semantic detail that requires documentation; the name alone does not convey it.

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 13 | Security | WARN | MEDIUM | Slot-machine domain inferred from SpinResult, jackpotHit, totalPayout vocabulary and .anatoly/docs. ConservativeStrategy uses floating-point multiplication `totalPayout * 0.8` on what the arbitrated contract defines as integer coin values. IEEE 754 representation of 0.8 is inexact; for most integer inputs Math.floor compensates, but the pattern is not certifiable for regulated gaming where exact integer payout arithmetic is expected. Prefer `Math.floor(totalPayout * 8 / 10)` to stay in integer-division semantics. [L18] |

### Suggestions

- Replace floating-point coefficient with integer division to guarantee exact payout arithmetic in regulated gaming context.
  - Before: `totalPayout: Math.floor(result.totalPayout * 0.8),`
  - After: `totalPayout: Math.floor(result.totalPayout * 8 / 10),`

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ConservativeStrategy` is exported but unused (`ConservativeStrategy`) [L13-L20]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
