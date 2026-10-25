# Review: `src/wild.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| applyWildBonus | function | yes | OK | - | DEAD | UNIQUE | - | 72% |

### Details

#### `applyWildBonus` (L1–L4)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: The formula (1+wildCount)*2**wildCount is unusually steep, but no doc, comment or confident convention gives the intended multiplier. The README only says 'applies wild multipliers'. The guard clause and arithmetic are consistent, so no concrete defect is provable.
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

## Actions

### Refactors

- **[utility · medium · trivial]** Remove dead code: `applyWildBonus` is exported but unused (`applyWildBonus`) [L1-L4]
