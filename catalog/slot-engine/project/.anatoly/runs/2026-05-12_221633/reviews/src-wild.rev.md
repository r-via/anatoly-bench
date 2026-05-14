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
- **Correction [NEEDS_FIX]**: Compound multiplier (1+wildCount)×2^wildCount produces 4×/12×/32×/80× for 1–4 wilds — two independent multiplier mechanics combined multiplicatively, incompatible with 95% RTP target.
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

## Actions

### Quick Wins

- **[correction · medium · small]** Remove the (1+wildCount) linear factor; the canonical wild-multiplier formula for this domain is basePayout * 2**wildCount, keeping each wild as a 2× multiplier without a stacked linear bonus. [L3]

### Refactors

- **[utility · medium · trivial]** Remove dead code: `applyWildBonus` is exported but unused (`applyWildBonus`) [L1-L4]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `applyWildBonus` (`applyWildBonus`) [L1-L4]
