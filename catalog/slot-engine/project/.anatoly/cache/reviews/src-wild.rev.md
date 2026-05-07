# Review: `src/wild.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| applyWildBonus | function | yes | OK | - | DEAD | UNIQUE | NONE | 90% |

### Details

#### `applyWildBonus` (L1–L4)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Implementation matches documented formula exactly: basePayout × (1 + wildCount) × 2^wildCount.
- **Overengineering [-]**: *(not evaluated)*
- **Tests [NONE]**: *(default — evaluator did not produce a result)*

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `applyWildBonus` is exported but unused (`applyWildBonus`) [L1-L4]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `applyWildBonus` (`applyWildBonus`) [L1-L4]
