# Review: `src/format.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| formatTimetable | function | yes | OK | - | - | - | - | 92% |
| formatReport | function | yes | OK | - | - | - | - | 92% |

### Details

#### `formatTimetable` (L4–L14)

- **Correction [OK]**: No correctness issues; string formatting and iteration are correct.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment. Missing description of return format, column layout, or data source (TIMETABLE).
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `formatReport` (L16–L31)

- **Correction [OK]**: No correctness issues; null check on actualArrival and string interpolation are correct.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment. Missing description of the report parameter fields consumed, return format, and how stranded vs on-time arrivals are represented.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `formatTimetable` (`formatTimetable`) [L4-L14]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `formatReport` (`formatReport`) [L16-L31]
