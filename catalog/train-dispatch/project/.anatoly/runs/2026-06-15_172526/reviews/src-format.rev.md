# Review: `src/format.ts`

**Verdict:** CLEAN

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| formatTimetable | function | yes | OK | - | - | - | - | 92% |
| formatReport | function | yes | OK | - | - | - | - | 92% |

### Details

#### `formatTimetable` (L4–L14)

- **Correction [OK]**: No correctness defects; formatting logic is straightforward string padding and joining.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `formatReport` (L16–L31)

- **Correction [OK]**: No correctness defects; null check on actualArrival is correct and all report fields are accessed safely.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*
