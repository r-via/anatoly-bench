# Review: `src/signals.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| lastEntryTick | variable | no | OK | - | - | - | - | 98% |
| resetSignals | function | yes | OK | - | - | - | - | 98% |
| canEnterBlock | function | yes | NEEDS_FIX | - | - | - | - | 97% |
| recordEntry | function | yes | OK | - | - | - | - | 98% |

### Details

#### `lastEntryTick` (L4–L4)

- **Correction [OK]**: Module-level Map correctly scoped for per-block headway tracking.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `resetSignals` (L6–L8)

- **Correction [OK]**: Correctly clears all headway state before a new simulation run.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `canEnterBlock` (L10–L15)

- **Correction [NEEDS_FIX]**: Off-by-one in headway check enforces a 2-tick gap instead of the documented 3-tick minimum.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `recordEntry` (L17–L19)

- **Correction [OK]**: Correctly stamps the entry tick for the given block.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

## Actions

### Quick Wins

- **[correction · medium · small]** Change `elapsed >= MIN_HEADWAY - 1` to `elapsed >= MIN_HEADWAY` in canEnterBlock to enforce the documented 3-tick minimum headway instead of the current effective 2-tick gap. [L14]
