# Review: `src/format.ts`

**Verdict:** CLEAN

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| formatTimetable | function | yes | OK | - | - | - | - | 92% |
| formatReport | function | yes | OK | - | - | - | - | 92% |

### Details

#### `formatTimetable` (L4–L14)

- **Correction [OK]**: No correctness defects; string formatting and padding are consistent.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `formatReport` (L16–L31)

- **Correction [OK]**: No correctness defects; null check on actualArrival matches the TrainArrival contract (actualArrival: number | null).
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*
