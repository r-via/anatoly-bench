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

- **Correction [OK]**: Module-level Map correctly scoped; all three in-file consumers (reset, read, write) use it correctly.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal module-level map storing last entry tick per block for headway enforcement — purpose is non-obvious from name alone, especially the semantic of tick vs. elapsed time.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `resetSignals` (L6–L8)

- **Correction [OK]**: Clears the map unconditionally; correct contract for simulation reset.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Exported API. No description of when to call this (e.g., before a new simulation run) or what state is cleared.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `canEnterBlock` (L10–L15)

- **Correction [NEEDS_FIX]**: Off-by-one: `elapsed >= MIN_HEADWAY - 1` enforces a 2-tick headway instead of the documented 3-tick minimum, allowing a second train to enter a block one tick too early.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Exported API with non-obvious semantics: the `_train` parameter is silently unused, the off-by-one `MIN_HEADWAY - 1` comparison is unexplained, and the return value contract (true on first entry) is implicit.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `recordEntry` (L17–L19)

- **Correction [OK]**: Simple map write; no correctness issues.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Exported API. No description of when callers must invoke this relative to canEnterBlock, or the consequence of missing a call.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

## Actions

### Quick Wins

- **[correction · medium · small]** Replace `MIN_HEADWAY - 1` with `MIN_HEADWAY` in canEnterBlock to enforce the documented 3-tick minimum headway. Currently admits a second train after only 2 elapsed ticks. [L14]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `resetSignals`, `canEnterBlock`, `recordEntry` (`resetSignals, canEnterBlock, recordEntry`) [L6-L8, L10-L15, L17-L19]
