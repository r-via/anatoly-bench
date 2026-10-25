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
- **Correction [OK]**: Moot — symbol is DEAD (was NEEDS_FIX: Wild bonus compounds two multipliers: (1 + wildCount) * 2 ** wildCount. For 1 wild gives 4x, 2 wilds 12x, 3 wilds 32x, 5 wilds 192x. A wild multiplier is normally a single factor (e.g. 2 ** wildCount or 1 + wildCount); applying both double-counts the wild effect and inflates payouts.)
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

## Actions

### Quick Wins

- **[correction · medium · small]** Apply a single wild multiplier formula (either `1 + wildCount` or `2 ** wildCount`) instead of multiplying both. Confirm the intended formula against the game design before changing it. [L3]
- **[utility · high · trivial]** Remove dead code: `applyWildBonus` is exported but unused (`applyWildBonus`) [L1-L4]
