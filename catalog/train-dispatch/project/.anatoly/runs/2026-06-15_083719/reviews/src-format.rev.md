# Review: `src/format.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| formatTimetable | function | yes | OK | - | - | - | - | 92% |
| formatReport | function | yes | OK | - | - | - | - | 92% |

### Details

#### `formatTimetable` (L4–L14)

- **Correction [OK]**: No correctness issues; string formatting is consistent with the TrainSpec fields accessed.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Exported public function with non-obvious output format (column widths, separator line, field ordering) — purpose and output structure are not documented.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

#### `formatReport` (L16–L31)

- **Correction [OK]**: No correctness issues; null check on actualArrival and field accesses are consistent with SimulationReport shape.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Exported public function whose output structure (tick count, on-time rate percentage, per-arrival stranded/arrived lines) is non-trivial and undocumented.
- **Utility [-]**: *(not evaluated)*
- **Duplication [-]**: *(not evaluated)*
- **Overengineering [-]**: *(not evaluated)*
- **Tests [-]**: *(not evaluated)*

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `formatTimetable` (`formatTimetable`) [L4-L14]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `formatReport` (`formatReport`) [L16-L31]
