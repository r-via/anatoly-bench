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
- **Correction [OK]**: Implements `basePayout × (1 + wildCount) × 2^wildCount` exactly as documented. Guard `wildCount <= 0` correctly short-circuits to `basePayout` (wildCount=0 would yield an identical result algebraically). Operator-precedence of `**` over `*` is correct in TypeScript. Multipliers for realistic reel counts (wildCount 1–4 → 4×, 12×, 32×, 80×) are aggressive but consistent with the documented spec; no domain-absurd output for inputs the engine can realistically produce.
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `applyWildBonus` is exported but unused (`applyWildBonus`) [L1-L4]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `applyWildBonus` (`applyWildBonus`) [L1-L4]
