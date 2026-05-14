# Review: `src/wild.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| applyWildBonus | function | yes | OK | - | DEAD | UNIQUE | - | 90% |

### Details

#### `applyWildBonus` (L1–L4)

- **Utility [DEAD]**: Exported symbol with 0 importers across the codebase. No consumers found.
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Implementation matches documented formula exactly: basePayout × (1 + wildCount) × 2^wildCount. Table values confirm: wildCount=1 → 2×2=4×, wildCount=2 → 3×4=12×, wildCount=3 → 4×8=32×.
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `applyWildBonus` is exported but unused (`applyWildBonus`) [L1-L4]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `applyWildBonus` (`applyWildBonus`) [L1-L4]
