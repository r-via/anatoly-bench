# Review: `src/signals.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| lastEntryTick | variable | no | OK | - | - | - | - | 60% |
| resetSignals | function | yes | OK | - | - | - | - | 95% |
| canEnterBlock | function | yes | NEEDS_FIX | - | - | - | - | 95% |
| recordEntry | function | yes | OK | - | - | - | - | 95% |

### Details

#### `lastEntryTick` (L4–L4)

- **Correction [OK]**: Module-scoped Map correctly typed and used only within this file.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Private module-level map; name hints at purpose but the tick-keyed semantics and its role in headway enforcement are not explained.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `resetSignals` (L6–L8)

- **Correction [OK]**: Correctly clears the Map; no logic issues.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Exported public API with no explanation of when callers must invoke it (e.g., between simulation runs) or what state it clears.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `canEnterBlock` (L10–L15)

- **Correction [NEEDS_FIX]**: Off-by-one in headway check: `elapsed >= MIN_HEADWAY - 1` (>= 2) permits entry after only 2 ticks when the documented and constant-defined minimum headway is 3 ticks.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The `_train` parameter is silently unused, the `MIN_HEADWAY - 1` offset is unexplained, and there is no description of the headway-enforcement contract or return semantics.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `recordEntry` (L17–L19)

- **Correction [OK]**: Correctly records the entry tick; no logic issues.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Exported public API; callers must know to call this after every successful block entry to keep headway state consistent, but that contract is undocumented.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

## Actions

### Quick Wins

- **[correction · medium · small]** Change `elapsed >= MIN_HEADWAY - 1` to `elapsed >= MIN_HEADWAY` in canEnterBlock (line 14) so the enforced headway matches the documented 3-tick minimum. [L14]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `resetSignals`, `canEnterBlock`, `recordEntry` (`resetSignals, canEnterBlock, recordEntry`) [L6-L8, L10-L15, L17-L19]
