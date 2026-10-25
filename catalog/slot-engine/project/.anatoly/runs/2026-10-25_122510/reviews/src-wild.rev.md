# Review: `src/wild.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| applyWildBonus | function | yes | OK | - | DEAD | UNIQUE | - | 80% |

### Details

#### `applyWildBonus` (L1–L4)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Moot — symbol is DEAD (was NEEDS_FIX: Wild multiplier compounds two growth factors: (1 + wildCount) and 2 ** wildCount. Both applied together yield a runaway multiplier that is likely unintended; for example, 5 wilds gives 6*32=192x.)
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

## Actions

### Quick Wins

- **[correction · medium · small]** Confirm the intended wild multiplier formula and use a single growth factor (either (1 + wildCount) or 2 ** wildCount), not both multiplied together. [L3]
- **[utility · high · trivial]** Remove dead code: `applyWildBonus` is exported but unused (`applyWildBonus`) [L1-L4]
