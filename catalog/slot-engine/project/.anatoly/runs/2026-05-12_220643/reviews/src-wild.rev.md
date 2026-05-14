# Review: `src/wild.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| applyWildBonus | function | yes | OK | - | DEAD | UNIQUE | - | 90% |

### Details

#### `applyWildBonus` (L1–L4)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Logic is internally consistent: guards wildCount ≤ 0, then applies (1 + wildCount) * 2^wildCount multiplier to basePayout. No type mismatches, no unsafe operations, no integer overflow risk for the stated wildCount domain (small positive integers). RTP impact depends on caller-supplied basePayout and wildCount ceilings, which are not visible here — cannot verify RTP conformance from this symbol alone.
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `applyWildBonus` is exported but unused (`applyWildBonus`) [L1-L4]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `applyWildBonus` (`applyWildBonus`) [L1-L4]
