# Review: `src/signals.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| lastEntryTick | variable | no | OK | - | - | - | - | 95% |
| resetSignals | function | yes | OK | - | - | - | - | 95% |
| canEnterBlock | function | yes | NEEDS_FIX | - | - | - | - | 95% |
| recordEntry | function | yes | OK | - | - | - | - | 95% |

### Details

#### `lastEntryTick` (L4–L4)

- **Correction [OK]**: Module-level Map initialized correctly; scoped to module, cleared via resetSignals.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `resetSignals` (L6–L8)

- **Correction [OK]**: Correctly clears the shared map; no logic issues.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `canEnterBlock` (L10–L15)

- **Correction [NEEDS_FIX]**: Off-by-one: headway enforcement uses MIN_HEADWAY - 1 instead of MIN_HEADWAY, allowing entry one tick too early.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `recordEntry` (L17–L19)

- **Correction [OK]**: Correctly records the entry tick for a block; no logic issues.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

## Actions

### Quick Wins

- **[correction · medium · small]** Change `elapsed >= MIN_HEADWAY - 1` to `elapsed >= MIN_HEADWAY` in canEnterBlock (line 14) to correctly enforce the minimum headway. [L14]
