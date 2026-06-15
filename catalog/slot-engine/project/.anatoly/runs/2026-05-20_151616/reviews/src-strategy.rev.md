# Review: `src/strategy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SpinStrategy | class | yes | OK | LEAN | USED | UNIQUE | NONE | 82% |
| DefaultStrategy | class | yes | OK | ACCEPTABLE | USED | UNIQUE | NONE | 85% |
| ConservativeStrategy | class | yes | OK | - | DEAD | UNIQUE | - | 90% |

### Details

#### `SpinStrategy` (L3–L5)

Auto-resolved: function ≤ 5 lines

#### `DefaultStrategy` (L7–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Identity pass-through; returns result unchanged, consistent with documented contract.
- **Overengineering [ACCEPTABLE]**: Identity wrapper is thin but justified as the engine's concrete default (1 runtime importer). Required by the class hierarchy; replacing it would mean changing the engine call site too.
- **Tests [NONE]**: No test file found. Used by src/engine.ts — identity payout pass-through is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The identity-pass-through behavior is not obvious from the name; a one-line description would suffice but is absent.

#### `ConservativeStrategy` (L13–L20)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Math.floor(totalPayout * 0.8) matches documented 80% reduction; rounding down is correct for casino payout arithmetic (house keeps remainder). Spread correctly preserves all other SpinResult fields.
- **Overengineering [OVER]**: 0 importers — dead code. The logic (`Math.floor(x * 0.8)`) is a one-liner that needs no class. Premature variant shipped with no consumer.
- **Tests [NONE]**: No test file found. The 0.8 multiplier + Math.floor truncation behavior is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The 80% floor reduction applied to totalPayout is a non-trivial semantic detail that cannot be inferred from the class name alone.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine domain: the magic literal 0.8 in ConservativeStrategy is an auditable payout modifier. In regulated gambling, payout multipliers should be named constants for traceability and auditability (e.g. during RTP certification). Extract to a named constant. [L14] |

### Suggestions

- Extract the 0.8 payout multiplier to a named constant for auditability in a regulated gambling context.
  ```typescript
  // Before
  totalPayout: Math.floor(result.totalPayout * 0.8),
  // After
  const CONSERVATIVE_PAYOUT_RATIO = 0.8 as const;
  // …
  totalPayout: Math.floor(result.totalPayout * CONSERVATIVE_PAYOUT_RATIO),
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `ConservativeStrategy` is exported but unused (`ConservativeStrategy`) [L13-L20]

### Hygiene

- **[overengineering · medium · small]** Simplify: `ConservativeStrategy` is over-engineered (`ConservativeStrategy`) [L13-L20]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
