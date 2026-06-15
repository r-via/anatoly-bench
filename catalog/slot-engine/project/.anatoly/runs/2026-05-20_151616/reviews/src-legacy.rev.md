# Review: `src/legacy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| computeLegacyPayout | function | yes | OK | LEAN | DEAD | UNIQUE | - | 87% |

### Details

#### `computeLegacyPayout` (L4–L24)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: WILD substitution, contiguous left-to-right match counting, all-WILD/SCATTER guard, and `multiplier × (bet/10)` formula all match the documented spec. Edge cases (empty array, all-WILD, WILD before SCATTER) handled correctly.
- **Overengineering [LEAN]**: Straightforward payout computation: resolve leading WILD, count consecutive matches, apply multiplier. No unnecessary abstractions or patterns.
- **Tests [NONE]**: No test file found. Critical logic paths untested: WILD-only lines, SCATTER early return, WILD prefix resolution, matchCount < 3 threshold, and payout calculation via getPayMultiplier.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment. Missing description of WILD substitution logic, SCATTER/WILD early-return behavior, minimum match threshold (3), lineBet derivation (bet/10), and parameter/return docs.

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `computeLegacyPayout` (`computeLegacyPayout`) [L4-L24]
