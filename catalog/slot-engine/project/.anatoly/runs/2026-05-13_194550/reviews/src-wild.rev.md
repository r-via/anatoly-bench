# Review: `src/wild.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| applyWildBonus | function | yes | OK | - | DEAD | UNIQUE | - | 70% |

### Details

#### `applyWildBonus` (L1–L4)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [NEEDS_FIX]**: Multiplier formula `(1 + wildCount) * 2 ** wildCount` compounds a linear factor with an exponential, double-counting wild contributions vs. the industry-standard `2^wildCount` pattern.
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

## Actions

### Quick Wins

- **[correction · medium · small]** Replace `(1 + wildCount) * 2 ** wildCount` with `2 ** wildCount` to apply the standard per-wild doubling multiplier without the additional linear factor; re-verify RTP model after the change. [L3]

### Refactors

- **[utility · medium · trivial]** Remove dead code: `applyWildBonus` is exported but unused (`applyWildBonus`) [L1-L4]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `applyWildBonus` (`applyWildBonus`) [L1-L4]
